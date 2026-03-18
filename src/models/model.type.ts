import { PromptSchema } from "./prompt.modal"
import { InferSchemaType } from "mongoose"
import { UserSchema } from "./user.modal"

export type TPrompt = InferSchemaType<typeof PromptSchema>

export type TUser = InferSchemaType<typeof UserSchema>