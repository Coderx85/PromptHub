import { Types } from "mongoose";
import * as Id from "@/utils/brand";

export interface IUser {
  _id: Id.TUserId;
  email: string;
  username: string;
  image?: string;
  likedposts: Array<Types.ObjectId>;
}

export interface IPrompt {
  _id: Id.TPromptId;
  creator: {
    username: string;
  };
  prompt: string;
  tag: string;
}
