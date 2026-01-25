import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

export const userService = {
  create: async (data: any) => {
    const { name, email, password, branchId, role } = data; // Desestruture os dados
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.user.create({
      data: {
        name,
        email,
        role: role || "USER",
        password: hashedPassword,
        // Em vez de passar branchId direto, usamos o connect
        branch: {
          connect: { id: branchId }
        }
      },
    });
  },

  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  findAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },
};
