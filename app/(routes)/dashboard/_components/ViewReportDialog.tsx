import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../teacher-agent/[sessionId]/page";
import moment from "moment";
import { useUser } from "@clerk/nextjs";

type props = {
  record: SessionDetail;
};

/**
 * Displays a detailed AI Tutoring / Learning session report
 */
function ViewReportDialog({ record }: props) {
  const { user } = useUser();
  const report: any = record?.report;
  const formatDate = moment(record?.createdOn).format(
    "MMMM Do YYYY, h:mm a"
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size={"sm"}>
          View Learning Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6 border border-gray-200 w-[750px]">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-3xl font-bold text-blue-500 mb-6">
              📘 Student Learning Report
            </h2>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="space-y-6 text-gray-800 text-sm">

              {/* 📌 Session Info */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Learning Session Info
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <div className="grid grid-cols-2 gap-3">
                  <p><strong>Teacher:</strong> {report?.agent || record?.selectedTeacher?.specialist}</p>
                  <p><strong>Student:</strong> {report?.user && report?.user !== "Anonymous" ? report?.user : (user?.fullName || "Anonymous")}</p>
                  <p><strong>Subject / Topic:</strong> {report?.trainingTopic || record?.selectedTeacher?.specialist}</p>
                  <p><strong>Date:</strong> {formatDate}</p>
                  <p><strong>Learning Score:</strong> {report?.learningScore !== undefined && report?.learningScore !== null ? report.learningScore : "N/A"} / 100</p>
                  <p><strong>Overall Performance:</strong> {report?.overallAssessment || "N/A"}</p>
                </div>
              </div>

              {/* 🎯 Learning Goal */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Learning Goal
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.learningGoal || record?.notes}</p>
              </div>

              {/* 🧠 Lesson Summary */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Lesson Summary
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.sessionSummary || report?.interviewSummary}</p>
              </div>

              {/* ❓ Questions Asked */}
              {report?.questionsAsked?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-500">
                    Questions Given
                  </h3>
                  <hr className="border-t-2 border-blue-500 my-2" />
                  <ul className="list-disc list-inside space-y-1">
                    {report.questionsAsked.map(
                      (q: string, index: number) => (
                        <li key={index}>{q}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* 🗣️ Student Responses */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Student Responses (Summary)
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.userResponses}</p>
              </div>

              {/* ✅ Strengths */}
              {report?.correctConcepts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    Strengths
                  </h3>
                  <hr className="border-t-2 border-green-600 my-2" />
                  <ul className="list-disc list-inside">
                    {report.correctConcepts.map(
                      (concept: string, index: number) => (
                        <li key={index}>{concept}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* ❌ Areas to Improve */}
              {report?.incorrectOrMissingConcepts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-500">
                    Areas to Improve
                  </h3>
                  <hr className="border-t-2 border-red-500 my-2" />
                  <ul className="list-disc list-inside">
                    {report.incorrectOrMissingConcepts.map(
                      (concept: string, index: number) => (
                        <li key={index}>{concept}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* 📝 Teacher Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Teacher Feedback
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.trainerFeedback}</p>
              </div>

              {/* ⚠️ Footer */}
              <div className="pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
                This report reflects a student learning session conducted by an AI Teaching Assistant.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
