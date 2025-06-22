import { appwriteConfig } from "./config"

import { Client, Account, ID } from "appwrite";


export const accountCreate = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {

const client = new Client()
    .setProject(appwriteConfig.projectId); // Your project ID

const account = new Account(client);

const promise = account.create(ID.unique(), email, username);

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});
}
