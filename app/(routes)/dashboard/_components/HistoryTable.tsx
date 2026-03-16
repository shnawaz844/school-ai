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
 * Displays a table listing previous consultation sessions including:
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
            <Table>
                {/* 📋 Caption for accessibility and context */}
                <TableCaption>Previous Training Reports</TableCaption>

                {/* 🧾 Table Header Row */}
                <TableHeader>
                    <TableRow>
                        <TableHead>AI Education Assistant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* 📄 Table Body */}
                <TableBody>
                    {historyList.map((record: SessionDetail, index: number) => (
                        <TableRow key={index}>
                            {/* Doctor specialty */}
                            <TableCell className="font-medium">
                                {record.selectedTeacher.specialist}
                            </TableCell>

                            {/* Human-readable timestamp */}
                            <TableCell>
                                {moment(new Date(record.createdOn)).fromNow()}
                            </TableCell>

                            {/* 🔍 View Report & Play Recording Actions */}
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {/* 🎵 Play Voice Recording Button */}
                                    {/* <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePlayRecording(record.sessionId)}
                                        title="Play voice recording"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                    </Button> */}
                                    <ViewReportDialog record={record} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default HistoryTable
