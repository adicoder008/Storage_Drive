"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createAccount, signInUser } from "@/lib/actions/users.action";
import OTPmodal from "./OTPmodal";

type AuthFormProps = {
  type: "signIn" | "signUp";
};

const formSchema = (type: "signIn" | "signUp") =>
  z.object({
    username:
      type === "signUp"
        ? z
            .string({
              required_error: "Username is required",
            })
            .min(2, { message: "Username must be at least 2 characters" })
        : z.string().optional(),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Enter a valid email address" }),
  });

const AuthForm = ({ type }: AuthFormProps) => {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [accountId, setAccountId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const [otpOpen, setOtpOpen] = useState(false);

  const schema = formSchema(type);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {

    setLoading(true);
    setErrorMsg("");

    try {

      const user =
        type === "signUp"
          ? await createAccount({
              username: values.username || "",
              email: values.email,
            })
          : await signInUser({
              email: values.email,
            });

      if (!user?.accountId) {
        throw new Error("Authentication failed");
      }

      setAccountId(user.accountId);
      setUserEmail(values.email);
      setOtpOpen(true);

    } catch (error) {

      console.error("Auth error:", error);
      setErrorMsg("Authentication failed. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex flex-col w-full max-w-md">

      <div className="bg-white rounded-2xl shadow-xl p-8">

        {/* Title */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            DriveManager
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            {type === "signIn"
              ? "Sign in to manage your files"
              : "Create your account to start storing files"}
          </p>

        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {type === "signUp" && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-gray-700">
                      Username
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="h-11 focus:ring-2 focus:ring-red-400"
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-gray-700">
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="h-11 focus:ring-2 focus:ring-red-400"
                    />
                  </FormControl>

                  <p className="text-xs text-gray-400 mt-1">
                    We'll send a one-time password to this email.
                  </p>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Submit Button */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
            >

              {loading
                ? "Sending OTP..."
                : type === "signIn"
                ? "Send OTP"
                : "Create Account"}

              {loading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loading"
                  width={18}
                  height={18}
                  className="animate-spin"
                />
              )}

            </Button>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">
                {errorMsg}
              </p>
            )}

            {/* Switch Auth */}

            <div className="text-center text-sm text-gray-500">

              {type === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}

              <Link
                href={type === "signIn" ? "/signUp" : "/signIn"}
                className="ml-1 text-red-500 font-medium hover:underline"
              >
                {type === "signIn" ? "Sign Up" : "Sign In"}
              </Link>

            </div>

          </form>
        </Form>
      </div>

      {/* OTP Modal */}

      {accountId && (
        <OTPmodal
          email={userEmail}
          accountID={accountId}
          open={otpOpen}
          setOpen={setOtpOpen}
        />
      )}

    </div>
  );
};

export default AuthForm;