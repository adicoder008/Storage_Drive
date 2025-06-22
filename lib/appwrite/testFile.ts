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



// const onSubmit = async (data: any) => {
  //     setLoading(true);
  //     setErrormsg("");

  //     if(type==="signUp") {
  //     try {
  //       console.log("Submitting with:", data.username, data.email);
  //       const user = await accountCreate({
  //         username: data.username || "",
  //         email: data.email,
  //       });
  //       console.log("User created:", user);
  //     } catch (error) {
  //       console.error("Error during form submission:", error);
  //       setErrormsg("user account cold not be created");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   else{//for sign in
  //     try {
  //       console.log("Form submitted with data:", data);
  //       // Handle form submission logic here, e.g., API call
  //       console.log("Submitting with:", data.username, data.email);
  //       const user = await Login({
  //         username: data.username || "",
  //         email: data.email,
  //       });
  //       console.log("redirceting");
  //       router.push("/");

  //       console.log("logged in", user);
  //     } catch (error) {
  //       console.error("Error during form submission:", error);
  //       setErrormsg("An error occurred. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }

  //   }
  // }