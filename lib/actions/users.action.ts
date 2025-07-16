"use server"
// This file contains server-side actions related to user management using Appwrite.
import { Query, ID, Account, Client } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/index";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { send } from "process";
import { use } from "react";
import { redirect } from "next/navigation";


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
  
}

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.log(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { database, account } = await createSessionClient();
    console.log("session created succesfully")
    const result = await account.get();
    console.log("result: ",result);

    const user = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.log(error, "Failed to sign out user");
  } finally {
    redirect("/signIn");
  }
};


export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    console.log(error, "Failed to sign in user");
  }
};

