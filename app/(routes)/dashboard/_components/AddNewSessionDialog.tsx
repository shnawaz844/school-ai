"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import TeacherAgentCard, { TeacherAgent } from "./TeacherAgentCard";
import SuggestedTeacherCard from "./SuggestedTeacherCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "../teacher-agent/[sessionId]/page";

function AddNewSessionDialog() {
  // 🧠 Local state management
  const [note, setNote] = useState<string>(); // stores session notes
  const [loading, setLoading] = useState(false); // tracks loading state
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAgent>({
    id: 1,
    specialist: "Study Assistant",
    description: "Helps students understand subjects, homework, and concepts easily.",
    image: "/teacher1.png",
    agentPrompt:
      "आप एक दोस्ताना महिला एआई स्टडी असिस्टेंट हैं। आप स्कूल के छात्रों से आसान हिंदी या हिंग्लिश में बात करती हैं। हमेशा महिला दृष्टिकोण से जवाब दें और 'समझा सकती हूँ', 'मदद कर सकती हूँ', 'पूछ सकती हूँ' जैसे शब्दों का इस्तेमाल करें। छात्र से नम्रता से पूछें कि वह किस विषय या टॉपिक में मदद चाहता है। जवाब छोटे, सरल, उदाहरणों के साथ और छात्र-friendly रखें।",
    voiceId: "Rohan",
    subscriptionRequired: false,
    gender: "female",
  }); // tracks selected teacher
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]); // stores past session list

  const router = useRouter();
  const { has } = useAuth();

  // ✅ Checks if user has a paid subscription (Clerk custom role)
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  // 🧾 Fetch session history when dialog mounts
  useEffect(() => {
    GetHistoryList();
  }, []);

  // 📥 Get all previous session records
  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };


  // 🏫 Handles "Start Lesson" button — saves session and redirects
  const onStartLesson = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedTeacher: selectedTeacher,
    });

    console.log(result.data);
    if (result.data?.sessionId) {
      // 🔁 Redirect to the new lesson page
      router.push("/dashboard/teacher-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      {/* 🔘 Open Dialog Button */}
      <DialogTrigger asChild>
        <Button
          className="mt-3 bg-[#FF6600] hover:bg-[#E65C00] text-white"
          disabled={!paidUser && historyList?.length >= 1} // restrict for free users
        >
          + Start New Lesson
        </Button>
      </DialogTrigger>

      {/* 🗂️ Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Details</DialogTitle>
          <DialogDescription asChild>
            {/* Step 1: Lesson Topic/Goal */}
            <div>
              <h2>What would you like to learn today?</h2>
              <p className="text-sm text-gray-500 mb-2">Enter the subject or topic you'd like to discuss with your AI Teacher.</p>
              <Textarea
                placeholder="e.g., Photosynthesis, Algebra basics, World War II..."
                className="h-[200px] mt-1"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Dialog Footer with Buttons */}
        <DialogFooter>
          {/* Cancel Button */}
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {/* Start Lesson Button */}
          <Button
            className="bg-[#FF6600] hover:bg-[#E65C00] text-white"
            disabled={loading || !selectedTeacher}
            onClick={() => onStartLesson()}
          >
            Start Lesson{" "}
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
