import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

function Dashboard() {
    return (
        <div>
            <div className='flex justify-between items-center bg-gradient-to-r from-gray-600 via-gray-400 
text-white p-6 rounded-2xl shadow-lg mb-8'>
                <div>
                    <h2 className='font-bold text-3xl'>My Dashboard</h2>
                    <p className='text-white/90 text-sm mt-1'>Welcome back! Ready for your next session?</p>
                </div>
                <AddNewSessionDialog />
            </div>
            <HistoryList />

            <DoctorsAgentList />
        </div>
    )
}

export default Dashboard