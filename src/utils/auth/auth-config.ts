import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export const db = client.db("share_prompt");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
});