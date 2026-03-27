"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

/**
 * Type definition for each teacher agent card
 */
export type TeacherAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string,
    gender: "male" | "female",
    subscriptionRequired: boolean
}

type props = {
    TeacherAgent: TeacherAgent
}

function TeacherAgentCard({ TeacherAgent }: props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { has } = useAuth();

    // ✅ Check if the user has a 'pro' plan using Clerk's has() helper
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' });

    /**
     * 📞 Handle Start Lesson Button Click
     * Creates a new session with the selected teacher and redirects to the session page.
     */
    const onStartLesson = async () => {
        setLoading(true);

        // Post the new session to backend API
        const result = await axios.post('/api/session-chat', {
            notes: 'New Learning Session',
            selectedTeacher: TeacherAgent
        });

        if (result.data?.sessionId) {
            // Navigate to the new session page
            router.push('/dashboard/teacher-agent/' + result.data.sessionId);
        }

        setLoading(false);
    }

    return (
        <div className='relative'>
            {/* 🔒 Premium badge if teacher requires subscription */}
            {/* {TeacherAgent.subscriptionRequired && (
                <Badge className='absolute m-2 right-0'>Premium</Badge>
            )} */}

            {/* 🏫 Teacher image */}
            <Image
                src={TeacherAgent.image}
                alt={TeacherAgent.specialist}
                width={200}
                height={300}
                className='w-full h-[230px] object-cover rounded-xl'
            />

            {/* 📚 Specialist title */}
            <h2 className='font-semibold mt-1'>{TeacherAgent.specialist}</h2>

            {/* 📋 Teacher description */}
            <p className='line-clamp-2 text-sm text-gray-500'>
                {TeacherAgent.description}
            </p>

            {/* 🚀 Start lesson button */}
            <Button
                className='w-full mt-2 bg-[#FF6600] hover:bg-[#E65C00] text-white'
                onClick={onStartLesson}
            // disabled={!paidUser && TeacherAgent.subscriptionRequired} // disable if teacher is premium & user isn't
            >
                Start Lesson{' '}
                {loading ? (
                    <Loader2Icon className='animate-spin' />
                ) : (
                    <IconArrowRight />
                )}
            </Button>
        </div>
    )
}

export default TeacherAgentCard
