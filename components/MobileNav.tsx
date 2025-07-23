"use client"
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
// import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface Props {
  ownerId?: string;
  AccountId?: string;
  avatar?: string;
  username?: string;
  email?: string;
}

const MobileNav = ({ownerId,AccountId,avatar, username,email}:Props) => {
  const [open, setOpen] = React.useState(false);
  // const pathname=usePathname();

  return (
    <header className="lg:hidden">
      <Image src="/assets/icons/logo-full-brand.svg" height={52} width={120} alt="" /> 

      <Sheet open={open} onOpenChange={setOpen} >
        <SheetTrigger><Image src="/assets/icons/menu.svg" width={30} height={30} alt="" /></SheetTrigger>
        <SheetContent className='bg-white text-black w-[80%]'>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
              <ul>
                <li>{ownerId}</li>
                <li>{AccountId}</li>
                <li>{avatar}</li>
                <li>{username}</li>
                <li>{email}</li>
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

    </header>
  )
}

export default MobileNav
