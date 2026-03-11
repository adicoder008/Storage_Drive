"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/users.action";

type OTPmodalProps = {
  email: string;
  accountID: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OTPmodal = ({ email, accountID, open, setOpen }: OTPmodalProps) => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setLoading(true);

    try {
      const sessionId = await verifySecret({
        accountId: accountID,
        password: otp,
      });

      if (sessionId) {
        setOpen(false);
        router.push("/");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);

    try {
      await sendEmailOTP({ email });
    } catch (error) {
      console.error("Failed to resend OTP");
    }

    setResending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-md p-8">

        {/* Close button */}

        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <Image
            src="/assets/icons/close-dark.svg"
            alt="close"
            width={18}
            height={18}
          />
        </button>

        <DialogHeader className="text-center space-y-2">

          <DialogTitle className="text-2xl font-semibold">
            Verify your email
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Enter the 6-digit code sent to
          </p>

          <p className="text-sm font-medium text-gray-800">
            {email}
          </p>

        </DialogHeader>

        {/* OTP input */}

        <div className="flex justify-center mt-6">

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >

            <InputOTPGroup>

              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />

            </InputOTPGroup>

          </InputOTP>

        </div>

        {/* Verify button */}

        <Button
          onClick={handleVerify}
          disabled={otp.length !== 6 || loading}
          className="w-full mt-6 h-11 bg-red-500 hover:bg-red-600 text-white"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              Verifying
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={18}
                height={18}
                className="animate-spin"
              />
            </div>
          ) : (
            "Verify Code"
          )}
        </Button>

        {/* Resend */}

        <p className="text-sm text-center text-gray-500 mt-4">

          Didn’t receive the code?

          <button
            onClick={handleResend}
            disabled={resending}
            className="ml-1 text-red-500 font-medium hover:underline"
          >
            {resending ? "Sending..." : "Resend"}
          </button>

        </p>

      </DialogContent>
    </Dialog>
  );
};

export default OTPmodal;