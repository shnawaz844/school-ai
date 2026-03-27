"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import { SessionDetail } from '../teacher-agent/[sessionId]/page';
import HistoryTable from './HistoryTable';

/**
 * HistoryList Component
 * 
 * Displays the user's previous learning sessions.
 * - If no sessions exist: shows a placeholder UI and CTA to start a new lesson.
 * - If sessions exist: displays them in a table using <HistoryTable />.
 */
function HistoryList() {
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]); // stores learning session history

    // ⏳ Load session history when the component mounts
    useEffect(() => {
        GetHistoryList();
    }, [])

    // 📥 Fetch all learning sessions from the backend
    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data); // update state with the response data
    }

    return (
        <div className='mt-10'>
            {/* 📦 If no history, show empty state UI */}
            {historyList.length == 0 ? (
                <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2'>
                    <Image
                        src={'/learning-journey.png'}
                        alt='empty'
                        width={150}
                        height={150}
                    />
                    <h2 className='font-bold text-xl mt-2'>No Recent Learning Sessions</h2>
                    <p>“You haven’t started your learning journey yet. Let’s begin!”</p>

                    {/* ➕ Trigger to start a new lesson */}
                    <AddNewSessionDialog />
                </div>
            ) : (
                // 📊 Show learning history table
                <div className="mt-6 border rounded-xl shadow-sm bg-background overflow-hidden flex flex-col">
                    <h3 className="text-lg font-semibold p-4 border-b bg-muted/30">Recent Learning Sessions</h3>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <HistoryTable historyList={historyList} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default HistoryList
