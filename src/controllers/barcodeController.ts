import { Request, Response } from "express";
import { BarcodeService } from "../services/barcodeService";

const barcodeService = new BarcodeService();

export class BarcodeController {
  async read(req: Request, res: Response) {
    try {
      const { barcode } = req.body;
      const { branchId } = (req as any).user; // Pegando do token JWT

      console.log("Dados recebidos:", { barcode, branchId });

      if (!barcode) {
        return res
          .status(400)
          .json({ error: "Código de barras é obrigatório" });
      }

      const item = await barcodeService.processRead(barcode, branchId);
      return res.json(item);
    } catch (error) {
      console.error("ERRO DETALHADO NO BACKEND:", error); // Isso vai te mostrar o culpado!
      return res.status(500).json({ error: "Erro ao processar leitura" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { branchId } = (req as any).user;

      // Log para debug
      console.log("Buscando itens para a unidade:", branchId);

      if (!branchId) {
        return res
          .status(400)
          .json({ error: "Unidade não identificada no token" });
      }

      const items = await barcodeService.listDaily(branchId);
      return res.json(items);
    } catch (error) {
      console.error("ERRO NA LISTAGEM:", error);
      return res.status(500).json({ error: "Erro ao listar itens" });
    }
  }

  async syncStatus(req: Request, res: Response) {
    try {
      const { branchId } = (req as any).user;

      if (!branchId) {
        return res.status(400).json({ error: "Unidade não identificada" });
      }

      await barcodeService.processStatusUpdate(branchId);

      return res.json({ message: "Sincronização de leituras realizada!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao processar sincronização" });
    }
  }

  async validate(req: Request, res: Response) {
    try {
      const { barcode } = req.body;
      // Aqui você faria a lógica de fatiar e buscar no seu banco de CTEs
      // Exemplo de retorno simulando que achamos o CTE:
      const mockCteData = {
        barcode,
        cteNumber: barcode.substring(6, 12),
        origin: barcode.substring(0, 3),
        dest: barcode.substring(3, 6),
        volumes: `${barcode.substring(14, 18)}/${barcode.substring(18, 22)}`,
      };

      return res.json(mockCteData);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Código não encontrado ou inválido" });
    }
  }
}
