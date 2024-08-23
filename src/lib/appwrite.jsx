import { Client, Databases, Account, Storage } from "appwrite";

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66c5aab30007d9e1efd1"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storageAppWrite = new Storage(client);
