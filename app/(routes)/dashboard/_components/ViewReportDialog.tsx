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

type props = {
  record: SessionDetail;
};

/**
 * Displays a detailed AI Training / Interview report
 */
function ViewReportDialog({ record }: props) {
  const report: any = record?.report;
  const formatDate = moment(record?.createdOn).format(
    "MMMM Do YYYY, h:mm a"
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size={"sm"}>
          View Training Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6 border border-gray-200 w-[750px]">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-3xl font-bold text-blue-500 mb-6">
              🎓 AI Training Report
            </h2>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="space-y-6 text-gray-800 text-sm">

              {/* 📌 Session Info */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Session Info
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <div className="grid grid-cols-2 gap-3">
                  <p><strong>Trainer:</strong> {report?.agent}</p>
                  <p><strong>Trainee:</strong> {report?.user || "Anonymous"}</p>
                  <p><strong>Training Topic:</strong> {report?.trainingTopic}</p>
                  <p><strong>Session Date:</strong> {formatDate}</p>
                </div>
              </div>

              {/* 🧠 Interview Summary */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Interview Summary
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.interviewSummary}</p>
              </div>

              {/* ❓ Questions Asked */}
              {report?.questionsAsked?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-500">
                    Questions Asked
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

              {/* 🗣️ User Responses */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  User Responses (Summary)
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.userResponses}</p>
              </div>

              {/* ✅ Correct Concepts */}
              {report?.correctConcepts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    Concepts Mastered
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

              {/* ❌ Missing / Incorrect Concepts */}
              {report?.incorrectOrMissingConcepts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-500">
                    Areas for Improvement
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

              {/* 📝 Trainer Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  Trainer Feedback
                </h3>
                <hr className="border-t-2 border-blue-500 my-2" />
                <p>{report?.trainerFeedback}</p>
              </div>

              {/* 🏁 Final Assessment */}
              <div>
                <h3 className="text-lg font-semibold text-purple-600">
                  Overall Assessment
                </h3>
                <hr className="border-t-2 border-purple-600 my-2" />
                <p className="font-semibold">{report?.overallAssessment}</p>
              </div>

              {/* ⚠️ Footer */}
              <div className="pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
                This report reflects a learning and assessment session conducted
                by an AI Education Assistant.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
