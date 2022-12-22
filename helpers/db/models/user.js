import mongoose from "mongoose";
import validator from "validator";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Post from "./post";
import Comment from "./comment";

const window = new JSDOM("").window;
const purify = DOMPurify(window);
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    superAdmin: {
      type: Boolean,
      select: false,
      default: false,
    },
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

//Create a virtual field for posts
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

//Create a virtual field for posts
userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

userSchema.pre("validate", function (next) {
  this.firstName = purify.sanitize(this.firstName);
  this.lastName = purify.sanitize(this.lastName);
  this.email = purify.sanitize(this.email);
  next();
});

// DELETE user comments after a user deletes their account
userSchema.pre("remove", async function (next) {
  const user = this;

  await Post.deleteMany({ author: user._id });
  await Comment.deleteMany({ user: user._id });

  next();
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email already exists!"));
  } else {
    next();
  }
});

userSchema.post("update", function (error, res, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email already exists!"));
  } else {
    next();
  }
});

// Hide private and sensitive data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  if (!userObject.isAdmin) {
    delete userObject.isAdmin;
  }

  delete userObject.superAdmin;
  delete userObject.password;

  return userObject;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
