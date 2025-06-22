"use server"
// This file contains server-side actions related to user management using Appwrite.
import { Query, ID, Account, Client } from "appwrite";
import { createAdminClient } from "../appwrite/index";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { send } from "process";


export const getUserByEmail = async (email: string) => {
  // try {
    console.log("Fetching user by email:");
    if (!email) throw new Error("Email is required to fetch user");
    const { database } = await createAdminClient();
    console.log("admin client created successfully");
    const result = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("Email", [email])]
    );
    console.log(result);

    console.log("fetched");
    return result.documents[0] || null;
  
}

export const sendEmailOTP = async ({ email }: { email: string }) => {


  const { account } = await createAdminClient(); //getting access to the account functionalities by using this client and {asscount}

  const session = await account.createEmailToken(ID.unique(), email);

  console.log("Token created successfully:", session);
  return session.userId;

 
}


export const createAccount = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {

  const existingUser = await getUserByEmail(email);

  
    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      throw new Error("Failed to send OTP. Please try again later.");
    }
  
  if(!existingUser) {//if no existing user found, create a new user
    console.log("No existing user found, creating a new user...");
    const { account, database } = await createAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      { Email:email, avatar: avatarPlaceholderUrl,Fullname: username,accountId }
    );
  }
  return parseStringify({ accountId });
  // return { accountId };
}




  // console.log("User metadata saved in DB:", newUser.$id);

  





export const verifySecret = async ({ accountID, password }: { accountID: string, password: string }) => {

  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountID, password);

    (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return parseStringify({ sessionID: session.$id });
  } catch (error) {
    console.error("Error verifying secret:", error);
    throw new Error("Invalid credentials. Please try again.");
  }
}

// export const verifySecret = async ({ email, password }: { email: string, password: string }) => {
//   try {
//     // console.log("before admin clint");//✅
//     // const { account } = await createAdminClient();//✅
//     // console.log("after admin clint");//✅
//      const client = new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
//       .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

//     const account = new Account(client);

//     const session = await account.createEmailSession(email, password); // ✅ use email!

//     (await cookies()).set("appwrite_session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//       maxAge: 60 * 60 * 24 * 30, // 30 days
//     });

//     return { sessionID: session.$id };
//   } catch (error) {
//     console.error("Error verifying secret:", error);
//     throw new Error("Invalid OTP. Please try again.");
//   }
// };

// export const verifySecret = async ({
//   email,
//   token,
// }: {
//   email: string;
//   token: string;
// }) => {
//   try {
//     const client = new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
//       .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

//     const account = new Account(client);

//     const session = await account.createEmailSession(email, token); // ✅ OTP-based login

//     console.log("Session created:", session);

//     return { sessionID: session.$id };
//   } catch (error) {
//     console.error("Error verifying secret:", error);
//     throw new Error("Invalid OTP. Please try again.");
//   }
// };
