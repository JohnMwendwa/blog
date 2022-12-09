import { unstable_getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]";
import { connectToDatabase, closeConnection } from "../../../../helpers/db/db";
import User from "../../../../helpers/db/models/user";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  try {
    await connectToDatabase();

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user.isAdmin) {
      await closeConnection();
      res.status(401).json({ error: "Unauthorized Access!" });
      return;
    }

    const user = await User.findById({ _id: req.body.id }).select(
      "+superAdmin"
    );

    const currentUser = await User.findOne({
      email: session.user.email,
    }).select("+superAdmin");

    if (!user) {
      await closeConnection();
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    if (!currentUser.superAdmin) {
      await closeConnection();
      res
        .status(401)
        .json({ error: "You have no permission to change user admin status" });
      return;
    }

    if (user.superAdmin) {
      await closeConnection();
      res.status(401).json({ error: "You can't change your admin status" });
      return;
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    await closeConnection();

    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
