import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

interface TokenPayload {
  id: string;
  branchId: string;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret);

    const { id, role, branchId } = decoded as TokenPayload;

    // @ts-ignore
    req.user = { id, role, branchId };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
