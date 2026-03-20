import { Types } from "mongoose";

type brand<T, B> = T & { __brand__: B & Types.ObjectId };

export type TUserId = brand<string, "User">;

export type TPromptId = brand<string, "Prompt">;

export type TPostId = brand<string, "Post">;

