import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const branchController = {
  async list(req: Request, res: Response) {
    try {
      // Busca todas as unidades para carregar no seu Select do Frontend
      const branches = await prisma.branch.findMany({
        orderBy: { name: 'asc' }
      });
      return res.json(branches);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar unidades" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, city } = req.body;
      const branch = await prisma.branch.create({
        data: { name, city }
      });
      return res.status(201).json(branch);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar unidade" });
    }
  }
};