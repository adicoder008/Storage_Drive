import { Client, Account } from "appwrite";
import { appwriteConfig } from "./config";

export const getCurrentUser = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    // .setSession('current'); // Set the session to 'current' to get the current user


  const account = new Account(client);

 try {
    // Simply get the current user WITHOUT deleting sessions
    const result = await account.get();
    console.log("meow")
    console.log("Userhh fetched:", result);
    return result;
  } catch (error) {
    console.log("No active session:");
    return null;
  }
}

