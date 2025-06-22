"use client";
import React from 'react'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { createAccount, sendEmailOTP, verifySecret } from '@/lib/actions/users.action'
import { useRouter } from 'next/navigation'


const OTPmodal = ({email,accountID}:{email:string,accountID:string}) => {
    const router=useRouter();
    const[isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("verifying secret for accountID:", accountID, "with password:", password);
            const sessionId=await verifySecret({accountID, password});
            console.log("verified");
            console.log("Session ID:", sessionId);
            if(sessionId) router.push("/")
        } catch (error) {
            console.error("Error submitting OTP:", error);
            
        }
        setIsLoading(false);

    }


    // const handleSubmit = async(values: z.infer<typeof formschema> ) => {
    //     e.preventDefault();
    //     setIsLoading(true);

    //     try {
    //         const user = await createAccount({email, password, accountID});
    //     } catch (error) {
    //         console.error("Error submitting OTP:", error);
            
    //     }
    //     setIsLoading(false);

    // }

    const handleResendOTP = async(e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        await sendEmailOTP({email});
        setIsLoading(false);
        alert("OTP sent to your email");
    }

    return (
        <>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger>OTP</AlertDialogTrigger>
                <AlertDialogContent className='bg-white'>
                    <AlertDialogHeader className='relative flex justify-center'>
                        <AlertDialogTitle className='text-2xl flex text-center'>
                            <div className='w-[95%]'>Enter your OTP</div>
                            <img src="/assets/icons/close-dark.svg" height={20} width={20} onClick={()=>setIsOpen(false)} alt="" />
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-center text-lg'>
                            We have sent an email to <span>{email}</span>

                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <InputOTP maxLength={6} value={password} onChange={(value) => setPassword(value)} className='flex justify-center items-center mt-4'>
                       <div className='w-full flex justify-center items-center'>
                        <InputOTPGroup className='flex justify-center items-center text-center'>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                        </div> 
                    </InputOTP>

                    <AlertDialogFooter>
                        <div className='flex w-full flex-col gap-4'>
                            <AlertDialogAction onClick={handleSubmit}  disabled={isLoading} className='bg-red-400 text-lg font-semibold px-3 py-2 text-center'>Submit
                               {isLoading && (<img src=".assets/icons/loader.svg" height={24} width={24} className='ml-2 animate-spin' alt="" />)}
                            </AlertDialogAction>
                                <div className='text-center'>Didnt get an OTP ?
                                    <button type='button' className='bg-red-400 px-2 py-1 text-white ml-2 rounded-md' onClick={handleResendOTP} disabled={isLoading}>click to resend</button>
                                </div>

                        </div>
                        {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                        
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>



        </>
    )
}

export default OTPmodal
