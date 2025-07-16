import React from 'react'
import Search from './Search'
import FileUploader from './FileUploader'
import { Button } from './ui/button'
import Image from 'next/image'
import {signOutUser} from '../lib/actions/users.action'

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <>
    <header className='flex justify-between p-3'>
        <div className=' justify-center items-center'>
          <Search/> 
        </div>

        {/* <div className='flex gap-4 justify-center items-center'>
          <FileUploader/> */}
        {/* <div className='flex gap-2 items-center justify-center cursor-pointer'>
            <div>logout</div>
            <img src="/assets/icons/logout.svg" alt="logo" />
        </div> */}
{/* its a server component and we hence to attach interactivity like button clicks we use new form feature of react 19 , which is using actions, which can specificaly do some actions for the server */}
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className=" bg-red-100">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6 "
            />
          </Button>
        </form>

        {/* </div> */}

    </header>
      
    </>
  )
}

export default Header
