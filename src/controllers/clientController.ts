import { Request, Response } from "express";
import { clientService } from "../services/clientService";

export const clientController = {
  async register(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { branchId } = (req as any).user;
      
      const client = await clientService.create({ ...req.body, branchId });
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { branchId } = (req as any).user;

      // Importante: Passamos o branchId para o service filtrar
      const clients = await clientService.getAll(branchId);
      res.json(clients);
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao listar clientes" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedClient = await clientService.update(id, req.body);
      res.json(updatedClient);
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao atualizar cliente" });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await clientService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao deletar cliente" });
    }
  }
};