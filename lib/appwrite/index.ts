"use server"
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config"
import { cookies } from "next/headers"


export const createSessionClient = async () => {
    console.log("Creating session client...");
    // console.log("appwriteConfig", appwriteConfig);
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint) //It tells the SDK where your backend/server is located.
        .setProject(appwriteConfig.projectId) //Ensures APIs hit the right project context
        
// appwrite-session is not set manually in your code,but instead is automatically set by Appwrite’s authentication system during login.When you log in a user using:
// account.createEmailSession(email, password);
    console.log("session client created, now waiting for cookies")
    const session = (await cookies()).get("appwrite-session"); //It tries to read the cookie named "appwrite_session" which stores the user’s session token.
    // const session = (await cookies()).get(`a_session_${appwriteConfig.projectId}`); //It tries to read the cookie named "appwrite_session" which stores the user’s session token.

    if (!session || !session?.value) throw new Error("no session");

    // client.headers["X-Fallback-Cookies"] = `a_session_${appwriteConfig.projectId}=${session.value}`;
    console.log("Session value:", session?.value);


    client.setSession(session.value);
 //usind setSession you walk in a as a user that is authenticated

    return {//these things are accessible to the user session client
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        }
    }

//     const { account } = {
//   get account() {
//     return new Account(client);
//   },
//   get database() {
//     return new Databases(client);
//   }
// };
//     try {
//   const result = await account.get();
//   console.log("✅ Authenticated session — account.get() succeeded:", result);
// } catch (err) {
//   console.error("❌ Session invalid — account.get() failed:", err);
// }

}

export const createAdminClient=async()=>{
    console.log("Appwrite Config:", appwriteConfig);
    console.log("Creating admin client...");

    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);//Tells the SDK to use a backend admin key for full access .........also only this line is extra in admin-client except the return (...) function
        console.log("admin client created successfully");
    // const apiKey=Client.setKey(appwriteConfig.secretKey); //setting the secret key for admin client

    //    console.log("meow mewo")
    return {
        get account(){
            return new Account(client);
        },
        get database(){
            return new Databases(client);
        },
        get storage(){
            return new Storage(client); //does not accept client 
        },
        get avatar(){
            return new Avatars(client);
        },
        // get users(){
        //     return new Users(client);
        // }

}
}