import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SessionDetail } from '../teacher-agent/[sessionId]/page'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import ViewReportDialog from './ViewReportDialog'
import { Volume2 } from 'lucide-react'

type Props = {
    historyList: SessionDetail[] // Array of session records to display
}

/**
 * HistoryTable Component
 * 
 * Displays a table listing previous learning sessions including:
 * - AI Subject Specialist
 * - Created Date
 * - Voice Recording Playback
 * - View Report Action
 */
function HistoryTable({ historyList }: Props) {

    console.log(historyList);
    /**
     * Handle playing the voice recording for a session
     * Fetches the recording URL from Vapi API and plays it
     */
    const handlePlayRecording = async (sessionId: string) => {
        try {
            // Show loading state (you can add a loading indicator if desired)
            console.log(`Fetching recording for session: ${sessionId}`);

            // Fetch the recording URL from Vapi API
            // Using sessionId as callId since Vapi uses the session/call interchangeably
            const response = await fetch(`/api/vapi-recording?callId=${sessionId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch recording');
            }

            const data = await response.json();

            if (!data.recordingUrl) {
                alert('No recording available for this session');
                return;
            }

            // Play the audio recording
            const audio = new Audio(data.recordingUrl);
            audio.play().catch(err => {
                console.error('Error playing audio:', err);
                alert('Error playing audio. Please try again.');
            });

            console.log('Playing recording:', data.recordingUrl);

        } catch (error: any) {
            console.error('Error playing recording:', error);
            alert(`Error: ${error.message}`);
        }
    };
    return (
        <div>
            <div className="w-full">
                <table className="w-full caption-bottom text-sm">
                    {/* 📋 Caption for accessibility and context */}
                    <caption className="text-muted-foreground mt-4 text-sm mb-4">Previous Learning Reports</caption>

                    {/* 🧾 Table Header Row */}
                    <thead className="[&_tr]:border-b sticky top-0 bg-background z-10 shadow-sm">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">AI Education Assistant</th>
                            <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                        </tr>
                    </thead>

                    {/* 📄 Table Body */}
                    <tbody className="[&_tr:last-child]:border-0 bg-background">
                        {historyList.map((record: SessionDetail, index: number) => (
                            <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {/* Teacher specialty */}
                                <td className="p-4 align-middle font-medium">
                                    {record.selectedTeacher.specialist}
                                </td>

                                {/* Human-readable timestamp */}
                                <td className="p-4 align-middle">
                                    {moment(new Date(record.createdOn)).fromNow()}
                                </td>

                                {/* 🔍 View Report & Play Recording Actions */}
                                <td className="p-4 align-middle text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <ViewReportDialog record={record} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryTable
