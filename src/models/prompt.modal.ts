import { Model, Schema, model, models } from "mongoose";
import { IPrompt } from "./model.type";

/** 
  export const PromptSchema = new Schema({
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required.'],
    },
    tag: {
      type: String,
      required: [true, 'Tag is required.'],
    },
    likes: {
      type: Number,
      default: 0,
    }
  });
  
  const Prompt = models.Prompt || model("Prompt", PromptSchema);
  
  export default Prompt;
*/

const PromptSchema = new Schema<IPrompt, Model<IPrompt>>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
