import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <>
    <div className='flex min-h-screen'>
        <div className='flex flex-col min-h-screen gap-7 bg-red-400 w-[40%] text-white px-4'>
            <img src="/assets/icons/logo-full.svg" className='text-center' alt="" height={100} width={250}/>
            <div className='text-3xl text-center '>Manage your files the best way</div>
            <div className=''>One stop solution to storing and managing all your documents at one place</div>
            <img src="/assets/images/files.png" height={200} width={300} alt="" />
        </div>


        <div className='min-h-screen w-[60%]'>
          <div className='w-4/5 m-5 h-4/5 p-4 flex justify-center items-center '>{children}</div>
        </div>
    </div>
      
    </>
  )
}

export default layout
