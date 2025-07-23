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
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { imageConfigDefault } from "next/dist/shared/lib/image-config"
// import { set } from "zod/v4-mini"
// import { create } from "domain"
import { createAccount, signInUser } from "@/lib/actions/users.action"
import OTPmodal from "./OTPmodal"
// import { type } from "os"
// import { accountCreate } from "@/lib/appwrite/SignUp"
// import { Login } from "@/lib/appwrite/Login"
import { useRouter } from "next/navigation";
// import { createAdminClient } from "@/lib/appwrite"
// import { appwriteConfig } from "@/lib/appwrite/config"
// import { Query, ID, Account, Client } from "appwrite";
// import { sign } from "crypto"
import Image from "next/image";


type AuthFormProps = {
  type: "signIn" | "signUp";
};

// type FormType = "signIn" | "signUp";

const formSchema = (type: "signIn" | "signUp") => {
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


 const AuthForm = ({ type }: AuthFormProps) => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const schema = formSchema(type);

    const onSubmit = async (values: z.infer<typeof schema>) => {
      setLoading(true);
      setErrormsg("");
      try {
        // if (type === "signUp") {
          console.log("Submitting with:", values.username, values.email);
          const user = 
          type==='signUp'?
          await createAccount({
            username: values.username || "",
            email: values.email || "",
          }): await signInUser({email: values.email || ""});
          setAccountId(user.accountId);
          console.log("Account ID:", user.accountId);
        // }
        // } else {
        //   console.log("Submitting with:", values.username, values.email);
        //   const user = await Login({
        //     username: values.username || "",
        //     email: values.email || "",
        //   });
        //   console.log("Logged in user:", user);
        //   router.push("/");
        // }
      } catch (error) {
        console.error("Error during form submission:", error);
        setErrormsg("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    


  

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
        <div className="text-3xl text-red-500 font-semibold">{type==="signIn"?"SIGN IN" : "SIGN UP"}</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 auth-form w-3/4">
            <h1 className="text-center text-3xl">{type === "signIn" ? "Sign In" : "Sign Up"}</h1>
            {type === "signUp" && <FormField
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
            {type === "signIn" && <FormField
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
            {type === "signUp" && <FormField
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
            {type === "signIn" && <FormField
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
            <Button type="submit" className="w-full text-center bg-red-400 text-white" disabled={loading}>{type === "signIn" ? "Sign In" : "Sign Up"}
              {loading && <Image src="/assets/icons/loader.svg" className="animate-spin" alt="" />}
            </Button>
            {/* we use * for dynamic rendering */}
            {errormsg && <p className="text-red-500 text-center">*{errormsg}</p>}
            <div className="flex justify-center">
              <p className="">{type === "signIn" ? "Dont have an account ? " : "Already have an account ? "}</p>
              <Link className="text-red-400" href={type === "signIn" ? "/signUp" : "/signIn"} >{type === "signIn" ? " signUp" : " signIn"}</Link>
            </div>
          </form>
        </Form>
        {/* <OTPmodal/> */} 
         {/* {accountId && (
         <OTPmodal email={form.getValues("email") ?? ""} accountID={accountId ?? ""} />
        )} */}
         {/* {accountId && ( */}
        <OTPmodal email={form.getValues("email")?? ""} accountID={accountId ?? ""} />
      {/* )} */}
        
      </div>
    </>
  );
}



export default AuthForm
