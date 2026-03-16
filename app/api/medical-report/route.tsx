import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `
You are an AI Medical Trainer that has just completed a voice-based training / interview session with a user.

The AI agent was NOT diagnosing or prescribing treatment.
The goal of the conversation was to TRAIN and ASSESS the user's understanding of a medical topic mentioned in the session notes.

Based on:
1) AI trainer agent info
2) The full conversation between the AI trainer and the user

Generate a structured TRAINING REPORT with the following fields:

1. agent:
   Name or role of the AI trainer (e.g., "General Physician Trainer AI")

2. user:
   Name of the trainee or "Anonymous" if not provided

3. timestamp:
   Current date and time in ISO format

4. trainingTopic:
   The medical condition or topic the user was trained on (e.g., Fever, Headache)

5. interviewSummary:
   2–3 sentence summary of how the training went, including what was asked and how the user responded overall

6. questionsAsked:
   List of key questions asked by the AI trainer during the session

7. userResponses:
   Brief summary of the user’s answers (not verbatim, summarize understanding)

8. correctConcepts:
   List of medical concepts the user answered correctly or partially correctly

9. incorrectOrMissingConcepts:
   List of concepts the user struggled with, answered incorrectly, or could not answer

10. trainerFeedback:
    Constructive feedback given by the AI trainer to help the user improve

11. overallAssessment:
    One of: "Beginner", "Intermediate", or "Needs Improvement"

Return the result strictly in the following JSON format:

{
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "trainingTopic": "string",
  "interviewSummary": "string",
  "questionsAsked": ["question1", "question2"],
  "userResponses": "string",
  "correctConcepts": ["concept1", "concept2"],
  "incorrectOrMissingConcepts": ["concept1", "concept2"],
  "trainerFeedback": "string",
  "overallAssessment": "string"
}

Rules:
- Do NOT include medications, prescriptions, or prevention advice.
- Do NOT act like a medical consultation report.
- This is a learning and evaluation report, not a treatment plan.
- Respond with ONLY valid JSON. No extra text.
`;


export async function POST(req: NextRequest) {
   const { sessionId, sessionDetail, messages } = await req.json();

   try {
      const UserInput = "AI Medical Trainer Agent Info:" + JSON.stringify(sessionDetail) + ", Conversation:" + JSON.stringify(messages);
      const completion = await openai.chat.completions.create({
         model: "google/gemini-2.5-flash",
         messages: [
            { role: 'system', content: REPORT_GEN_PROMPT },
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