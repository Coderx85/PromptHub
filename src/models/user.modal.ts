import { Schema, model, models, Types, Model } from "mongoose";
import { IUser } from "./model.type";

// export const UserSchema = new Schema({
//   id: {
//     type: Schema.Types.Mixed,
//     auto: true,
//   },
//   email: {
//     type: String,
//     unique: [true, "Email already exists!"],
//     required: [true, "Email is required!"],
//   },
//   username: {
//     type: String,
//     required: [true, "Username is required!"],
//     match: [
//       /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
//       "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
//     ],
//   },
//   image: {
//     type: String,
//   },
//   likedposts: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Post",
//     },
//   ],
// });

// const User = models.User || model("User", UserSchema);

// export default User;

export const UserSchema = new Schema<IUser, Model<IUser>>({
  _id: {
    type: Schema.Types.Mixed,
    cast: (value: string) => new Types.ObjectId(value),
  },
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  image: {
    type: String,
  },
  likedposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const User = models.User || model("User", UserSchema);

export default User;
