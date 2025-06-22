"use client"
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"
import { set } from "zod/v4-mini"
import { create } from "domain"
import { createAccount } from "@/lib/actions/users.action"
import OTPmodal from "./OTPmodal"
import { type } from "os"
import { accountCreate } from "@/lib/appwrite/SignUp"


type AuthFormProps = {
  type: "signIn" | "signUp";
};

type FormType = "signIn" | "signUp";

const formSchema = (type: FormType) => {
  return z.object({
    username: type === "signUp"
      ? z.string({
          required_error: "Username is required",
          invalid_type_error: "Username must be a string",
        }).min(2, { message: "Username must be at least 2 characters" })
      : z.string().optional(),

    email: type === "signUp"
      ? z.string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a valid string",
        }).email({ message: "Please enter a valid email address" })
      : z.string().optional(),
  });
};




// const AuthFormSchema = (type: FormType) => {
  // return z.object({
    // email: z.string().email(),
    // fullname: type === "signUp" ? z.string().min(2).max(50) : z.string().optional,
    const AuthFormSchema = (type: FormType) => {
  return z.object({
    username: type === "signUp" ? z.string().min(2, "Username required") : z.string().optional(),
    email: type === "signUp" ? z.string().email("Invalid email") : z.string().optional(),
  });
};

  // });


const AuthForm = ({ type }: AuthFormProps) => {

  const [loading, setLoading] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [accountID, setAccountID] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrormsg("");
    // console.log("Submitting form with data:", data);
    // console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT,"meow");
    try {
      console.log("Form submitted with data:", data);
      // Handle form submission logic here, e.g., API call
      console.log("Submitting with:", data.username, data.email);
      const user = await accountCreate({
        username: data.username || "",
        email: data.email,
      });
      console.log("User created:", user);
      // Optionally handle user after creation
      // if (user && user.accountID) {
      //   setAccountID(user.accountID);
      // }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrormsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const schema = formSchema(type);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
    },
  });


  return (
    <>
    <div className="flex flex-col w-full items-center">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 auth-form w-3/4">
        <h1 className="text-center text-3xl">{type==="signIn"?"Sign In":"Sign Up"}</h1>
        {type==="signUp" && <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />}
        {type==="signUp" && <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} className="shadow-xl " />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />}
        <Button type="submit" className="w-full text-center bg-red-400 text-white" disabled={loading}>{type==="signIn"?"Sign In":"Sign Up"}
          {loading && <img src="/assets/icons/loader.svg" className="animate-spin" alt="" /> }
        </Button>
        {/* we use * for dynamic rendering */}
        {errormsg && <p className="text-red-500 text-center">*{errormsg}</p>}
        <div className="flex justify-center">
          <p className="">{type==="signIn"?"Dont have an account ? ":"Already have an account ? "}</p>
          <Link className="text-red-400" href={type==="signIn"?"/signUp":"/signIn"} >{type==="signIn"?" signUp":" signIn"}</Link>
        </div>
      </form>
    </Form>
{/* <OTPmodal/> */}
    {/* {true && (
      <OTPmodal email={form.getValues("email") ?? ""} accountID={accountID ?? ""}/>
      )} */}
      {/* <div>{process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}</div> */}
      </div>
    </>
  );
}


export default AuthForm
