import React from 'react'
import { TeacherAgent } from './TeacherAgentCard'
import Image from 'next/image'

type props = {
    TeacherAgent: TeacherAgent,             // teacher data to display
    setSelectedTeacher: (teacher: TeacherAgent) => void, // function to set selected teacher
    selectedTeacher: TeacherAgent          // currently selected teacher
}

/**
 * SuggestedDoctorCard Component
 * 
 * Displays a clickable card for a suggested doctor.
 * Highlights the card if it is the currently selected doctor.
 */
function SuggestedTeacherCard({ TeacherAgent, setSelectedTeacher, selectedTeacher }: props) {
    return (
        <div
            className={`flex flex-col items-center
            border rounded-2xl shadow p-5
            hover:border-blue-500 cursor-pointer
            ${selectedTeacher?.id == TeacherAgent?.id && 'border-blue-500'}`}
            onClick={() => setSelectedTeacher(TeacherAgent)} // select this teacher on click
        >
            {/* 👤 Teacher image */}
            <Image
                src={TeacherAgent?.image}
                alt={TeacherAgent?.specialist}
                width={70}
                height={70}
                className='w-[50px] h-[50px] rounded-4xl object-cover'
            />

            {/* 🎓 Teacher name */}
            <h2 className='font-bold text-sm text-center'>
                {TeacherAgent?.specialist}
            </h2>

            {/* 📝 Short description */}
            <p className='text-xs text-center line-clamp-2'>
                {TeacherAgent?.description}
            </p>
        </div>
    )
}

export default SuggestedTeacherCard
