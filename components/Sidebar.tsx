"use client"
import React from 'react'
import Link from 'next/link'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
    username?: string;
    email?: string;
    avatar?: string;
}

const Sidebar = ({username,email,avatar}: Props) => {
    const pathname = usePathname();

    return (
        <div>
            <div className='flex flex-col '>
                <Link href={"/"}>
                    <img src="/assets/icons/logo-full-brand.svg" alt="" height={50} width={150} className='hidden lg:block' />
                    <img src="/assets/icons/logo-brand.svg" alt="" height={52} width={52} className=' lg:hidden' />

                </Link>

                <nav>
                    <ul>
                        {navItems.map(({ name, url, icon }) => {
                            const active = pathname === url;
                            return (
                                <li key={name}>
                                    <Link
                                        href={url}
                                        className={`flex items-center gap-2 p-2 rounded-md ${active ? "bg-red-400" : "hover:bg-gray-100"
                                            }`}
                                    >
                                        <img src={icon} alt={`${name} icon`} className="w-6 h-6" />
                                        <span
                                            className={`text-sm ${active ? "font-bold text-white" : "font-normal"
                                                } hidden lg:block`}
                                        >
                                            {name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                </nav>

                <img src="/assets/images/files-2.png" height={506} width={418} alt="" />
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mt-4'>
                <p>{email}</p>
                <p>{username}</p>
            </div>
        </div>
    )
}

export default Sidebar
