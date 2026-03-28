"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/dashboard/profile'
    }
]
function AppHeader() {
    const [open, setOpen] = useState(false);

    return (
        <div className='flex items-center justify-between p-3 px-4 md:px-20 lg:px-10 sticky top-0 bg-white z-50 shadow-sm'>
            <Link href={'/'}>
                <Image src={'/logo132.png'} alt='logo' width={180} height={60} className="md:w-[200px]" />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <Link key={index} href={option.path}>
                        <h2 className='hover:font-bold hover:text-[#FF6600] cursor-pointer'>{option.name}</h2>
                    </Link>
                ))}
            </div>

            <div className='flex items-center gap-4'>
                <UserButton />

                {/* Mobile Navigation */}
                <div className='md:hidden'>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className='p-2 cursor-pointer outline-none'>
                                <Menu className='h-7 w-7 text-gray-700' />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[300px] sm:max-w-[300px] rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="text-[#FF6600] text-xl font-bold">Menu</DialogTitle>
                            </DialogHeader>
                            <div className='flex flex-col gap-6 py-4'>
                                {menuOptions.map((option, index) => (
                                    <Link key={index} href={option.path} onClick={() => setOpen(false)}>
                                        <div className='text-lg font-medium hover:text-[#FF6600] cursor-pointer transition-colors duration-200 border-b border-gray-100 pb-2 flex items-center justify-between'>
                                            {option.name}
                                            <span className='text-gray-400'>&rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default AppHeader