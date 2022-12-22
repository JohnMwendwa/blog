import { unstable_getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase, closeConnection } from "../../../helpers/db/db";
import Post from "../../../helpers/db/models/post";
import User from "../../../helpers/db/models/user";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return;
  }

  try {
    await connectToDatabase();
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user.isAuthenticated) {
      await closeConnection();
      res.status(401).json({ error: "Unauthorized access!" });
      return;
    }

    const { postId } = req.body;

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      await closeConnection();
      res.status(404).json({ error: "Something went wrong!" });
      return;
    }

    const post = await Post.findById(postId);

    if (!user._id.equals(post.author)) {
      await closeConnection();
      res
        .status(404)
        .json({ error: "You don't have permission to delete this resource!" });
      return;
    }

    await post.remove();

    await closeConnection();

    res.status(200).json({});
  } catch (e) {
    await closeConnection();
    res.status(500).json({
      error: e.message,
    });
  }
}
