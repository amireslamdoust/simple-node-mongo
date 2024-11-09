import * as jwt from "jsonwebtoken";

import { ObjectId } from "mongodb";

const { JWT_SECRET } = process.env;

interface JwtPayload {
  id: string;
}

export const getUserFromToken = async (token, db) => {
  if (!token) {
    return null;
  }

  const tokenData = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!tokenData?.id) {
    return null;
  }

  const obj = new ObjectId(String(tokenData.id)); // Ensure tokenData.id is a string

  return await db.collection("Users").findOne({ _id: obj });
};
