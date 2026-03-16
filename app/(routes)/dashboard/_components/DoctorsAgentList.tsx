import { AITeacherAgents } from '@/shared/list'
import React from 'react'
import TeacherAgentCard from './TeacherAgentCard'

/**
 * DoctorsAgentList Component
 * Displays a grid of AI-powered doctor agent cards using data from AIDoctorAgents.
 */
function DoctorsAgentList() {
    return (
        <div className='mt-10'>
            {/* 🧠 Section Title */}
            <h2 className='font-bold text-xl'>AI Subject Teachers</h2>

            {/* 🏫 Responsive grid layout for teacher cards */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5'>
                {AITeacherAgents.map((teacher, index) => (
                    <div key={index}>
                        {/* 🧑‍🏫 Render each teacher agent card */}
                        <TeacherAgentCard TeacherAgent={teacher} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorsAgentList
