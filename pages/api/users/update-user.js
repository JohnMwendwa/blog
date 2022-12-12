import { unstable_getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase, closeConnection } from "../../../helpers/db/db";
import User from "../../../helpers/db/models/user";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  try {
    await connectToDatabase();

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      await closeConnection();
      res.status(401).json({ error: "Unauthaurized access" });
      return;
    }

    const { firstName, lastName, email } = req.body;

    const user = await User.findOne({ email: session.user.email });

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    await user.save();

    await closeConnection();
    res.status(200).json({
      message: "Details updated",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
