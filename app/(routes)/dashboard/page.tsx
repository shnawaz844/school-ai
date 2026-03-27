import React from 'react'
import Image from 'next/image'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

function Dashboard() {
    return (
        <div className='relative min-h-screen'>
            {/* Blurred Background */}

            <div className='flex justify-between items-center bg-gradient-to-r from-[#434140] to-[#ebeae8] 
text-white p-6 rounded-2xl shadow-lg mb-8 h-40 overflow-hidden'>
                <div>
                    <h2 className='font-bold text-3xl shrink-0'>My Dashboard</h2>
                    <p className='text-white/90 text-sm mt-1'>Welcome Ready for your session?</p>
                </div>
                <Image 
                    src={'/parth-gautam.png'} 
                    alt='dashboard' 
                    width={150} 
                    height={150} 
                    className='hidden md:block object-contain' 
                    priority
                />
            </div>
            {/* <HistoryList /> */}

            <DoctorsAgentList />
        </div >
    )
}

export default Dashboard