import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const SESSION_REPORT_PROMPT = `
You are an AI Education Specialist that has just completed a voice-based tutoring / learning session with a student.

The goal of the conversation was to TEACH and ASSESS the user's understanding of a specific subject topic mentioned in the session notes.

Based on:
1) AI teacher agent info
2) The full conversation between the AI teacher and the student

Generate a structured LEARNING REPORT with the following fields:

1. agent:
   Name or role of the AI teacher (e.g., "Mathematics Teacher AI")

2. user:
   Name of the student or "Anonymous" if not provided

3. timestamp:
   Current date and time in ISO format

4. trainingTopic:
   The specific subject topic the user was taught (e.g., Algebra, Photosynthesis)

5. learningGoal:
   The primary objective or goal of this session based on the session notes

5. sessionSummary:
   2–3 sentence summary of how the learning session went, including what was explained and how the student responded overall

6. questionsAsked:
   List of key questions asked by the AI teacher during the session

7. userResponses:
   Brief summary of the student’s answers (not verbatim, summarize understanding)

8. correctConcepts:
   List of concepts the student answered correctly or partially correctly

9. incorrectOrMissingConcepts:
   List of concepts the student struggled with, answered incorrectly, or could not answer

10. trainerFeedback:
    Constructive feedback given by the AI teacher to help the student improve

12. learningScore:
    A numerical score from 1 to 100 based on the student's performance and understanding during the session

Return the result strictly in the following JSON format:

{
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "learningGoal": "string",
  "trainingTopic": "string",
  "sessionSummary": "string",
  "questionsAsked": ["question1", "question2"],
  "userResponses": "string",
  "correctConcepts": ["concept1", "concept2"],
  "incorrectOrMissingConcepts": ["concept1", "concept2"],
  "trainerFeedback": "string",
  "overallAssessment": "string",
  "learningScore": number
}

Rules:
- Do NOT act like a medical consultation or job interview report.
- Focus strictly on educational concepts and learning outcomes.
- This is a teaching and academic evaluation report.
- Respond with ONLY valid JSON. No extra text.
`;


export async function POST(req: NextRequest) {
   const { sessionId, sessionDetail, messages } = await req.json();

   try {
      const UserInput = "AI Teacher Agent Info:" + JSON.stringify(sessionDetail) + ", Conversation:" + JSON.stringify(messages);
      const completion = await openai.chat.completions.create({
         model: "google/gemini-2.5-flash",
         messages: [
            { role: 'system', content: SESSION_REPORT_PROMPT },
            { role: "user", content: UserInput }
         ],
      });

      const rawResp = completion.choices[0].message;

      //@ts-ignore
      const Resp = rawResp.content.trim().replace('```json', '').replace('```', '')
      const JSONResp = JSON.parse(Resp);

      // Save to Database
      const result = await db.update(SessionChatTable).set({
         report: JSONResp,
         conversation: messages
      }).where(eq(SessionChatTable.sessionId, sessionId));

      return NextResponse.json(JSONResp)
   } catch (e) {
      return NextResponse.json(e)

   }
}
