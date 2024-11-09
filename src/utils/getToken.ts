import * as jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const getToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7 days",
  });
};
