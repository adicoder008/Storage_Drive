import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
// import { getUserByEmail } from '@/lib/actions/users.action'
import { getCurrentUser } from '@/lib/actions/users.action'
import { redirect } from 'next/navigation' //next/vaigation is imp
import React from 'react'
import { Toaster } from "@/components/ui/sonner"

const layout = async ({children}:{children:React.ReactNode}) => {

  const currentUser = await getCurrentUser();
  console.log("Current User:", currentUser);
  if (!currentUser) return redirect('/signIn');

  return (
    <>
    <div className='h-screen flex '>
        <div className=' w-[23%]'><Sidebar {...currentUser}  /></div>
        <section className='h-full flex flex-1 flex-col'>
            <MobileNav {...currentUser}/>
            <Header userId={currentUser.$id} accountId={currentUser.accountId} />
            <div>{children}</div>
        </section>
        <Toaster />

    </div>
      
    </>
  )
}

export default layout
