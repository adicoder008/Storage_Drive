import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/appwrite/GetAccount'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async ({children}:{children:React.ReactNode}) => {

  const currentUser = await getCurrentUser();
  console.log("Current User:", currentUser);
  // if (!currentUser) redirect('/signIn');

  return (
    <>
    <div className='h-screen flex '>
        <div className=' w-[23%]'><Sidebar {...currentUser}  /></div>
        <section className='h-full flex flex-1 flex-col'>
            <MobileNav {...currentUser}/>
            <Header />
            <div>{children}</div>
        </section>

    </div>
      
    </>
  )
}

export default layout
