"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TeacherAgent } from "../../_components/TeacherAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedTeacher: TeacherAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

/**
 * TeacherVoiceAgent Component
 *
 * Provides an AI-powered educational voice assistant interface where students can
 * start a voice lesson with an AI teacher agent, interact in real-time,
 * view live transcripts, and generate a learning report.
 */
function TeacherVoiceAgent() {
  const { sessionId } = useParams(); // Get sessionId from route parameters
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>(); // Current session details
  const [callStarted, setCallStarted] = useState(false); // Call connection status
  const [vapiInstance, setVapiInstance] = useState<any>(null); // Instance of Vapi for voice interaction
  const [currentRole, setCurrentRole] = useState<string | null>(null); // Current speaking role (user/assistant)
  const [liveTranscript, setLiveTranscript] = useState<string>(""); // Live transcription text
  const [messages, setMessages] = useState<messages[]>([]); // Finalized chat messages log
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [vapiCallId, setVapiCallId] = useState<string | null>(null); // Vapi call ID for recording retrieval
  const [seconds, setSeconds] = useState(0); // Timer seconds
  const [isEnded, setIsEnded] = useState(false); // Session ended state
  const [isMuted, setIsMuted] = useState(false); // Microphone mute state
  const router = useRouter();
  const { user } = useUser();
  const callActiveRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStarted) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStarted]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, liveTranscript]);

  // Handle Video Playback based on current role (agent speaking)
  useEffect(() => {
    if (videoRef.current) {
      if (currentRole === "assistant") {
        videoRef.current.play().catch((err) => console.log("Video play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentRole]);

  const toggleMute = () => {
    if (vapiInstance) {
      vapiInstance.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatMessage = (text: string) => {
    if (!text) return text;
    // Split text by sentence-ending punctuation followed by space
    const sentences = text.split(/(?<=[.!?।])\s+/).filter((s) => s.trim().length > 0);

    if (sentences.length <= 1) {
      return <span>{text}</span>;
    }

    return (
      <ul className="space-y-2">
        {sentences.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5 text-sm">•</span>
            <span>{s.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Load session details on component mount or when sessionId changes
  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Fetch session detail data from backend API
  const GetSessionDetails = async () => {
    const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
    console.log("Session deatails", result.data);
    setSessionDetail(result.data);
  };

  /**
   * StartCall
   * Initializes and starts the voice call with the AI Subject Teacher Voice Agent
   * using the Vapi SDK and sets up event listeners for call and speech events.
   */
  const StartCall = () => {
    console.log("Starting call", sessionDetail);
    if (!sessionDetail) return;
    setLoading(true);
    setSeconds(0);

    // Initialize Vapi instance with your API key
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // Configuration for the AI voice agent
    const VapiAgentConfig = {
      name: "AI Subject Specialist",

      // Use the teacher's custom greeting/prompt
      firstMessage: sessionDetail.selectedTeacher?.agentPrompt || "Hello student, how can I help you today?",

      transcriber: {
        model: "nova-3",
        provider: "deepgram",
        language: "hi",
      },

      voice: {
        model: "eleven_turbo_v2_5",
        // Select voice based on agent's gender
        voiceId: sessionDetail.selectedTeacher?.gender === "male"
          ? process.env.NEXT_PUBLIC_MALE_VOICE_ID!
          : process.env.NEXT_PUBLIC_FEMALE_VOICE_ID!,
        provider: "11labs",
        stability: 0.5,
        similarityBoost: 0.75,
      },

      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an experienced AI ${sessionDetail.selectedTeacher?.specialist || "Subject Teacher"}.

🔹 Lesson Topic:
Focus strictly on school curriculum and educational concepts as per the specialist: ${sessionDetail.selectedTeacher?.specialist}. 

⛔ CRITICAL: Do NOT discuss medical treatments, diagnostic advice, or professional career recruitment. Focus on teaching concepts like in a classroom.

Teaching Rules:
- Follow the communication style and language from your greeting message.
- Don't lecture directly — ask questions to guide the student's learning.
- Ask only one question at a time.
- Cover definitions, concepts, application-based scenarios, and common misconceptions.

Answer Evaluation:
- Correct answer → Praise and enhance with additional insights.
- Incorrect answer → Calmly explain the correct answer with reasoning.
- Never scold, always teach.

Behavior:
- Act as a friendly teacher/mentor.
- Keep answers short, clear, and learning-focused.
- Encouragement is essential for student confidence.

Goal:
Help the student understand the topic well enough to confidently clear a school exam or conceptual quiz on this topic.
        `,
          },
        ],
      },
    };

    //@ts-ignore
    vapi.start(VapiAgentConfig);

    // Event listeners for Vapi voice call lifecycle

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-start", async (data: any) => {
      callActiveRef.current = true;
      setLoading(false);
      setCallStarted(true);
      console.log("Call started event received");
      console.log("Full call-start data:", JSON.stringify(data, null, 2), data);

      // Try to get call ID from the vapi instance itself
      //@ts-ignore
      console.log("Vapi instance properties:", Object.keys(vapi));
      //@ts-ignore
      console.log("Vapi call:", vapi.call);
      //@ts-ignore
      console.log("Vapi callId:", vapi.callId);
      //@ts-ignore
      console.log("Vapi _call:", vapi._call);
      //@ts-ignore
      console.log("Vapi activeCall:", vapi.activeCall);

      // Try to extract call ID from vapi instance
      //@ts-ignore
      const instanceCallId = (vapi as any).call?.callClientId || (vapi as any).call?._callClientId || (vapi as any).call?.id || (vapi as any).callId;
      //@ts-ignore
      console.log("Instance call ID:", instanceCallId, vapi.call);

      if (instanceCallId) {
        setVapiCallId(instanceCallId);
        console.log("✅ Call ID found in vapi instance:", instanceCallId);

        try {
          await axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: instanceCallId
          });
          console.log("✅ Vapi call ID saved to database");
        } catch (error) {
          console.error("❌ Failed to save Vapi call ID:", error);
        }
      } else {
        console.log("⚠️ No call ID found in vapi instance yet, waiting for message events...");
      }
    });

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-end", (data: any) => {
      callActiveRef.current = false;
      setCallStarted(false);
      setVapiInstance(null);
      console.log("Call ended", data);
      if (vapiCallId) {
        console.log("Recording should be available for call ID:", vapiCallId);
      }
    });

    vapi.on("message", (message) => {
      if (!callActiveRef.current) return;

      // Log all messages to debug
      console.log("Vapi message received:", message);

      // Check for end-of-call-report to get recording URL
      if (message.type === "end-of-call-report") {
        console.log("📞 End-of-call-report received:", message);
        //@ts-ignore
        const recordingUrl = message.recordingUrl || message.artifact?.recordingUrl || message.stereoRecordingUrl;

        if (recordingUrl) {
          console.log("✅ Recording URL captured:", recordingUrl);
          // Save recording URL to database
          axios.post('/api/save-recording-url', {
            sessionId: sessionId,
            recordingUrl: recordingUrl
          }).then(() => {
            console.log("✅ Recording URL saved to database");
          }).catch(error => {
            console.error("❌ Failed to save recording URL:", error);
          });
        } else {
          console.log("⚠️ No recording URL in end-of-call-report");
        }
      }

      // Check for call-start message type to get call ID
      if (message.type === "call-start") {
        console.log("Call-start message detected:", message);
        // Try to extract call ID from various possible locations
        //@ts-ignore
        const callId = message.call?.id || message.callId || message.id;
        if (callId) {
          setVapiCallId(callId);
          console.log("✅ Call ID captured from message:", callId);

          // Save the Vapi call ID to the database
          axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: callId
          }).then(() => {
            console.log("✅ Vapi call ID saved to database");
          }).catch(error => {
            console.error("❌ Failed to save Vapi call ID:", error);
          });
        }
      }

      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          // Show live partial transcript while user/assistant is speaking
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Add finalized transcript to messages log
          setMessages((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].role === role) {
              const lastMsg = prev[prev.length - 1];
              // Separate out questions into their own bubbles
              const isLastQuestion = lastMsg.text.includes('?');
              const isNewQuestion = transcript.includes('?');

              if (isLastQuestion || isNewQuestion) {
                return [...prev, { role, text: transcript }];
              }

              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + " " + transcript
              };
              return updatedMessages;
            }
            return [...prev, { role, text: transcript }];
          });
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
    vapi.on("error", (err) => {
      if (err?.errorMsg === "Meeting has ended") {
        console.log("Meeting already ended, ignoring");
        return;
      }

      console.error("Vapi error:", err);
    });
  };

  /**
   * endCall
   * Ends the ongoing voice call, cleans up listeners, generates
   * a learning report, and redirects the user back to dashboard.
   */
  const endCall = async () => {
    if (!vapiInstance || !callActiveRef.current) {
      router.replace("/dashboard");
      return;
    }

    callActiveRef.current = false;
    // Generate learning report based on chat messages/
    try {
      const result = await GenerateReport();
    } catch (e) {
      console.error("Report generation failed", e);
    }

    // if (!vapiInstance) return;

    // Stop the Vapi call and remove event listeners
    try {
      vapiInstance.stop();
    } catch {
      // call already ended — ignore
      console.log("Meeting already ended, ignoring");
      return;
    }

    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");
    vapiInstance.off("speech-start");
    vapiInstance.off("speech-end");

    setCallStarted(false);
    setVapiInstance(null);

    toast.success("Your learning report is generated!");

    setIsEnded(true);
    setIsMuted(false);
  };

  /**
   * GenerateReport
   * Sends the collected messages and session details to backend API to
   * create a learning session report.
   */
  const GenerateReport = async () => {
    setLoading(true);
    const result = await axios.post("/api/training-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
      studentName: user?.fullName || user?.firstName || "Anonymous"
    });

    console.log(result.data);
    setLoading(false);

    return result.data;
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-10rem)] p-3 md:p-5 border rounded-3xl bg-[#e69b6a]">
      {/* Status bar showing if call is connected */}
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center text-[#ffff]">
          <Circle
            className={`h-4 w-4 rounded-full text-[#ffff] ${callStarted ? "bg-green-500" : "bg-red-500"
              }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-[#ffff]">{formatTime(seconds)}</h2>{" "}
      </div>

      {/* Main content shows student details and conversation */}
      {sessionDetail && (
        <div className="flex flex-col md:grid md:grid-cols-10 gap-4 md:gap-6 mt-4 md:mt-6 md:flex-1 md:min-h-0">
          {/* Left Side: Avatar & Controls (30%) */}
          <div className="md:col-span-3 flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100 p-2 md:p-6 h-[400px] md:h-full overflow-y-auto md:overflow-hidden shrink-0 custom-scrollbar">
            <audio id="vapi-dummy-audio" className="hidden" autoPlay playsInline />
            {sessionDetail.selectedTeacher?.gender === "male" ? (
              <video
                ref={videoRef}
                src="/lantaai.mp4"
                loop
                muted
                playsInline
                className={`h-[120px] w-[120px] object-cover rounded-full shadow-md mb-4 transition-all duration-300 ${currentRole === "assistant"
                  ? "ring-4 ring-orange-500 animate-ripple scale-105"
                  : ""
                  }`}
              />
            ) : sessionDetail.selectedTeacher?.gender === "female" ? (
              <video
                ref={videoRef}
                src="/female.mp4"
                loop
                muted
                playsInline
                className={`h-[120px] w-[120px] object-cover rounded-full shadow-md mb-4 transition-all duration-300 ${currentRole === "assistant"
                  ? "ring-4 ring-orange-500 animate-ripple scale-105"
                  : ""
                  }`}
              />
            ) : (
              <Image
                src={sessionDetail.selectedTeacher?.image}
                alt={sessionDetail.selectedTeacher?.specialist ?? ""}
                width={120}
                height={120}
                className="h-[90px] w-[90px] md:h-[120px] md:w-[120px] object-cover rounded-full shadow-md mb-2 md:mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
              {sessionDetail.selectedTeacher?.specialist}
            </h2>
            <p className="text-sm text-gray-500 mb-2 md:mb-4">AI Education Assistant</p>

            {/* Start, End Call, or Dashboard buttons */}
            <div className="w-full mt-2 md:mt-auto flex flex-col gap-2">
              {!callStarted ? (
                !isEnded ? (
                  <Button
                    className="w-full h-14 text-lg hover:scale-105 transition-all"
                    onClick={StartCall}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      <PhoneCall className="mr-2" />
                    )}
                    Start Call
                  </Button>
                ) : (
                  <Button
                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all"
                    onClick={() => router.replace("/dashboard")}
                    disabled={loading}
                  >
                    Back to Dashboard
                  </Button>
                )
              ) : (
                <>
                  <Button
                    className={`w-full h-14 text-lg hover:scale-105 transition-all ${isMuted
                      ? "bg-orange-100 text-orange-600 border-orange-300 hover:bg-orange-200"
                      : ""
                      }`}
                    variant={isMuted ? "outline" : "secondary"}
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <MicOff className="mr-2 h-5 w-5 text-orange-500" />
                    ) : (
                      <Mic className="mr-2 h-5 w-5" />
                    )}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>

                  <Button
                    className="w-full h-14 text-lg hover:scale-105 transition-all"
                    variant="destructive"
                    onClick={endCall}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      <PhoneOff className="mr-2" />
                    )}
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Chat Conversation (70%) */}
          <div className="md:col-span-7 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 h-[350px] md:h-full md:min-h-0">
            {/* Show all finalized messages and live transcript */}
            <div className="overflow-y-auto w-full h-full flex flex-col scroll-smooth pr-4 gap-4">
              {messages.length === 0 && !liveTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start the call to begin!</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col items-start w-full">
                  <span className="text-sm text-gray-600 mb-1">{msg.role === 'user' ? 'You' : 'Teacher'}</span>
                  <div className={`py-3 px-4 rounded-xl text-gray-800 border max-w-[85%] ${msg.role === 'user' ? 'bg-gray-100 border-gray-200' : 'bg-red-100 border-red-200'}`}>
                    {msg.role === 'user' ? msg.text : formatMessage(msg.text)}
                  </div>
                </div>
              ))}
              {liveTranscript && (
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm text-gray-400 mb-1">{currentRole === 'user' ? 'You' : 'Teacher'}</span>
                  <div className={`py-3 px-4 rounded-xl text-gray-800 border max-w-[85%] italic ${currentRole === 'user' ? 'bg-gray-100 border-gray-200' : 'bg-red-100 border-red-200'}`}>
                    {currentRole === 'user' ? liveTranscript : formatMessage(liveTranscript)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherVoiceAgent;
