import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { hash, compare } from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const expiry = process.env.TOKEN_EXPIRY;

export async function hashPassword(password) {
  return await hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

export async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token) {
  try {
    const decoded = decodeJwt(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function errorResponse(
  res,
  message = "Something went wrong. Try again.",
  statusCode = 500
) {
  return res.status(statusCode).json({ message });
}

export function successResponse(
  res,
  data,
  message = "Request successful.",
  statusCode = 200
) {
  return res.status(statusCode).json({ ...data, message });
}
