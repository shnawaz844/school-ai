import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

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
    return (
        <div className='flex items-center justify-between p-3 px-4 md:px-20 lg:px-10 sticky top-0 bg-white'>
            <Link href={'/'}>
                <Image src={'/logo132.png'} alt='logo' width={140} height={16} className="md:w-[160px]" />
            </Link>
            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <Link key={index} href={option.path}>
                        <h2 className='hover:font-bold hover:text-[#FF6600] cursor-pointer'>{option.name}</h2>
                    </Link>
                ))}
            </div>
            <div className='flex items-center gap-4'>
                <UserButton />
            </div>
        </div>
    )
}

export default AppHeader