import { Request, Response } from "express";
import { cteService } from "../services/cteService";

export const cteController = {
  async register(req: Request, res: Response) {
    try {
      const { branchId } = (req as any).user;

      if (!branchId) {
        return res
          .status(401)
          .json({
            error:
              "Sua sessão não contém o ID da unidade. Faça login novamente.",
          });
      }

      const cte = await cteService.create({ ...req.body, branchId });
      res.status(201).json(cte);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const { branchId } = (req as any).user; //
      const ctes = await cteService.getAll(branchId);
      res.json(ctes);
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao listar CTEs da unidade" });
    }
  },

  async update(request: Request, response: Response) {
    const id = request.params.id as string;
    const data = request.body;
    // @ts-ignore
    const { branchId } = request.user;

    try {
      // Passamos o branchId para garantir que o usuário só edite o que é dele
      const updatedCte = await cteService.update(id, data, branchId);
      return response.json(updatedCte);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      // @ts-ignore
      const { branchId } = req.user;

      await cteService.delete(id, branchId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao deletar CTE" });
    }
  },

  async getFinancialReport(req: Request, res: Response) {
    try {
      const { branchId } = (req as any).user; //
      const { year, month } = req.query;

      const report = await cteService.getFinancialReport(
        Number(year) || new Date().getFullYear(),
        month ? Number(month) : undefined,
        branchId,
      );
      return res.json(report);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao carregar dashboard" });
    }
  },
};
