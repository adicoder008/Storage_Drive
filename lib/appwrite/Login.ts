import { Client, Account } from "appwrite";
import { appwriteConfig } from "./config";


export const Login = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {



const client = new Client()
    .setProject(appwriteConfig.projectId); // Your project ID

const account = new Account(client);

const promise = account.createEmailPasswordSession(email, username);
 

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});
}
