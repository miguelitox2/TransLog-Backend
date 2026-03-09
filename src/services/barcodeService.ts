import { prisma } from "../config/prisma";
import { startOfDay, subDays, endOfDay } from "date-fns";

export class BarcodeService {
  /**
   * Lista todos os itens da unidade para exibição no frontend
   */
  async listDaily(branchId: string) {
    try {
      return await prisma.barcodeItem.findMany({
        where: {
          branchId: branchId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Erro ao listar itens no Prisma:", error);
      throw new Error("Erro ao buscar lista de códigos.");
    }
  }

  /**
   * Processa a leitura do código de barras: cria novo ou marca como urgente
   */
  async processRead(barcode: string, branchId: string) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
      // Verifica se o código já foi lido HOJE nesta unidade específica
      const existingItem = await prisma.barcodeItem.findFirst({
        where: {
          barcode,
          branchId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      if (!existingItem) {
        // Primeira leitura do dia -> Status ATIVO (PENDING)
        return await prisma.barcodeItem.create({
          data: {
            barcode,
            branchId,
            status: "PENDING",
            readCount: 1,
            firstReadAt: new Date(),
            lastReadAt: new Date(),
          },
        });
      } else {
        // Já lido hoje -> Vira URGENTE e incrementa leituras
        return await prisma.barcodeItem.update({
          where: { id: existingItem.id },
          data: {
            lastReadAt: new Date(),
            status: "URGENT",
            readCount: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error("Erro ao processar leitura no Prisma:", error);
      throw new Error("Erro ao salvar leitura.");
    }
  }

  /**
   * Sincronização Manual: Compara leituras entre dias
   */
  async processStatusUpdate(branchId: string) {
    const todayStart = startOfDay(new Date());

    // 1. Buscar todos os itens que ainda não estão finalizados na unidade
    const items = await prisma.barcodeItem.findMany({
      where: {
        branchId,
        status: { not: "FINISHED" },
      },
    });

    const updates = items.map(async (item) => {
      const lastRead = new Date(item.lastReadAt);
      const firstRead = new Date(item.firstReadAt);

      // REGRA: Lido hoje E ontem (ou antes) -> URGENTE
      if (lastRead >= todayStart && firstRead < todayStart) {
        return prisma.barcodeItem.update({
          where: { id: item.id },
          data: { status: "URGENT" },
        });
      }

      // REGRA: Última leitura ANTES de hoje (não bipado hoje) -> FINALIZADO
      if (lastRead < todayStart) {
        return prisma.barcodeItem.update({
          where: { id: item.id },
          data: { status: "FINISHED" },
        });
      }

      // REGRA: Primeira leitura HOJE e única -> ATIVO (PENDING)
      if (firstRead >= todayStart && item.readCount === 1) {
        return prisma.barcodeItem.update({
          where: { id: item.id },
          data: { status: "PENDING" },
        });
      }
    });

    return await Promise.all(updates);
  }
}
