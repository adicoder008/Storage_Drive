'use server'
import {ID, Account, Avatars, Client, Databases } from "appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers"

export const createAdminClient=async()=>{
    console.log("Appwrite Config:", appwriteConfig);
    console.log("Creating admin client...");

    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setJWT(appwriteConfig.secretKey);//Tells the SDK to use a backend admin key for full access .........also only this line is extra in admin-client except the return (...) function
    
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
        }

}
}