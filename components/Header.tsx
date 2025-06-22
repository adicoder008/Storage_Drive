import React from 'react'
import Search from './Search'
import FileUploader from './FileUploader'

const Header = () => {
  return (
    <>
    <header className='flex bg-green-200 p-3'>
        <div className='w-[50%] justify-center items-center'>
        <div><Search/> </div>
        </div>

        <div className='w-[50%] flex gap-4 justify-center items-center'>
        <div><FileUploader/></div>
        <div className='flex gap-2 items-center justify-center cursor-pointer'>
            <div>logout</div>
            <img src="/assets/icons/logout.svg" alt="" />
        </div>
        </div>

    </header>
      
    </>
  )
}

export default Header
