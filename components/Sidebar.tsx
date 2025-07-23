"use client"
import React from 'react'
import Link from 'next/link'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
// import { cn } from '@/lib/utils'

interface Props {
    Fullname?: string;
    Email?: string;
    avatar?: string;
}

const Sidebar = ({Fullname,Email,avatar}: Props) => {
    const pathname = usePathname();

    return (
        <div>
            <div className='flex flex-col '>
                <Link href={"/"}>
                    <Image src="/assets/icons/logo-full-brand.svg" alt="" height={50} width={150} className='hidden lg:block' />
                    <Image src="/assets/icons/logo-brand.svg" alt="" height={52} width={52} className=' lg:hidden' />

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
                                        <Image src={icon} alt={`${name} icon`} width={24} height={24} />
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

                <Image src="/assets/images/files-2.png" height={470} width={400} alt="" />
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mt-4'>
                
                <Image src={avatar || "/assets/images/default-avatar.png"} height={44} width={44} alt="" />
                
                <div className='flex flex-col text-sm'>
                    <p>{Email}</p>
                    <p>{Fullname}</p>
                </div>
                
                
            </div>
        </div>
    )
}

export default Sidebar
