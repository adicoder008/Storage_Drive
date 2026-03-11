"use client"

import React from "react"
import Link from "next/link"
import { navItems } from "@/constants"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface Props {
  Fullname?: string
  Email?: string
  avatar?: string
}

const Sidebar = ({ Fullname, Email, avatar }: Props) => {

  const pathname = usePathname()

  return (
    <aside className="h-screen flex flex-col justify-between bg-white border-r border-gray-200 px-6 py-6">

      {/* Top section */}

      <div>

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-2 mb-10"
        >
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="DriveManager"
            height={50}
            width={150}
            className="hidden lg:block"
          />

          <Image
            src="/assets/icons/logo-brand.svg"
            alt="DriveManager"
            height={42}
            width={42}
            className="lg:hidden"
          />
        </Link>

        {/* Navigation */}

        <nav>

          <ul className="flex flex-col gap-2">

            {navItems.map(({ name, url, icon }) => {

              const active = pathname === url

              return (
                <li key={name}>

                  <Link
                    href={url}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      
                      ${active
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >

                    <Image
                      src={icon}
                      alt={`${name} icon`}
                      width={22}
                      height={22}
                      className={active ? "invert brightness-0" : ""}
                    />

                    <span
                      className={`text-sm font-medium hidden lg:block`}
                    >
                      {name}
                    </span>

                  </Link>

                </li>
              )

            })}

          </ul>

        </nav>

        {/* Decorative image */}

        <div className="mt-12 hidden lg:flex justify-center">
          <Image
            src="/assets/images/files-2.png"
            height={140}
            width={150}
            alt="files illustration"
            className="opacity-90"
          />
        </div>

      </div>

      {/* User section */}

      <div className="border-t border-gray-200 pt-5 flex items-center gap-3">

        <Image
          src={avatar || "/assets/images/default-avatar.png"}
          height={40}
          width={40}
          alt="User avatar"
          className="rounded-full"
        />

        <div className="flex flex-col text-sm leading-tight hidden lg:flex">

          <p className="font-semibold text-gray-800">
            {Fullname || "User"}
          </p>

          <p className="text-gray-500 truncate max-w-[160px]">
            {Email}
          </p>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar