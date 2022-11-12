import mongoose from "mongoose";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const { Schema } = mongoose;
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const commentSchema = new Schema(
  {
    body: {
      type: String,
      trim: true,
      required: [true, "You can't create an empty comment"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  {
    timestamps: {
      createdAt: "date_uploaded",
      updatedAt: "date_modified",
    },
  }
);

commentSchema.pre("validate", function (next) {
  this.body = purify.sanitize(this.body);
  this.email = purify.sanitize(this.email);
  this.name = purify.sanitize(this.name);
  next();
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
