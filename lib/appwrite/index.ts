"use server"
import {ID, Account, Avatars, Client, Databases } from "appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers"
import { Users } from "lucide-react";
// import { get } from "http"



export const createSessionClient = async () => {
    console.log("Creating session client...");
    // console.log("appwriteConfig", appwriteConfig);
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint) //It tells the SDK where your backend/server is located.
        .setProject(appwriteConfig.projectId) //Ensures APIs hit the right project context
        .setDevKey(appwriteConfig.secretKey)

    const session = (await cookies()).get("appwrite_session"); //It tries to read the cookie named "appwrite_session" which stores the user’s session token.

    if (!session || !session?.value) throw new Error("no session");

    client.setSession(session.value); //usind setSession you walk in a as a user that is authenticated

    return {//these things are accessible to the user session client
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        }
    }

}

export const createAdminClient=async()=>{
    console.log("Appwrite Config:", appwriteConfig);
    console.log("Creating admin client...");

    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setDevKey(appwriteConfig.secretKey);//Tells the SDK to use a backend admin key for full access .........also only this line is extra in admin-client except the return (...) function
        console.log(appwriteConfig.secretKey);
    // const apiKey=Client.setKey(appwriteConfig.secretKey); //setting the secret key for admin client

       console.log("meow mewo")
    return {
        get account(){
            return new Account(client);
        },
        get database(){
            return new Databases(client);
        },
        get storage(){
            return new Storage(); //does not accept client 
        },
        get avatar(){
            return new Avatars(client);
        },
        // get users(){
        //     return new Users(client);
        // }

}
}