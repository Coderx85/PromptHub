import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {});

export const db = client.db("share_prompt");

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
});