import { Request, Response } from "express";
import { userService } from "../services/userService";
import { authConfig } from "../config/auth";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

export const userController = {
  register: async (req: Request, res: Response) => {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao registrar" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const signOptions: SignOptions = {
        expiresIn: authConfig.jwt.expiresIn as any,
      };
      const token = jwt.sign(
        {
          id: user.id,
          branchId: user.branchId,
          role: user.role,
        },
        authConfig.jwt.secret,
        signOptions
      );
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },

 async listAll(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      include: {
        branch: true // Traz os dados da unidade junto com o usuário
      },
      orderBy: { name: 'asc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(400).json({ error: "Erro ao listar usuários" });
  }
}
};
