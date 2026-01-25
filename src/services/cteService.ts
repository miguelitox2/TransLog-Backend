import { prisma } from "../config/prisma";

export const cteService = {
  formatCteNumber(input: string): string {
    const clean = input.replace(/[-\s]/g, "");
    const rawPattern = /^(\d{1,6})([a-zA-Z])(\d{3})$/;
    const match = clean.match(rawPattern);

    if (!match) {
      throw new Error(
        "O valor digitado não corresponde aos 10 caracteres do padrão (6 números, 1 letra, 3 números).",
      );
    }

    const [_, nums1, letter, nums2] = match;
    return `${nums1}-${letter.toLowerCase()}-${nums2}`;
  },

  validateDescription(description?: string) {
    const MAX_CHARS = 300; // O limite que definimos anteriormente
    if (description && description.length > MAX_CHARS) {
      throw new Error(
        `A descrição é muito longa! Máximo de ${MAX_CHARS} caracteres.`,
      );
    }
  },

  async create(data: any) {
    // 1. Formatações iniciais
    if (data.numberCte) data.numberCte = this.formatCteNumber(data.numberCte);
    if (data.description) this.validateDescription(data.description);

    // 2. Extraímos apenas o que o Prisma realmente precisa
    const {
      numberCte,
      shipperName,
      clientName,
      cause,
      description,
      status,
      ro,
      value,
      branchId,
      accountable,
    } = data;

    // 3. Verificação de segurança para o vínculo obrigatório
    if (!branchId) {
      throw new Error("Erro interno: branchId não fornecido pelo sistema.");
    }

    // 4. Criação com dados limpos
    return await prisma.cte.create({
      data: {
        numberCte,
        shipperName,
        clientName,
        cause,
        description,
        accountable,
        status: status || "Pendente",
        // Usamos uma lógica mais segura para números
        ro: ro !== undefined && ro !== "" ? Number(ro) : undefined,
        value: value !== undefined ? Number(value) : 0,
        branch: {
          connect: { id: branchId },
        },
      },
    });
  },

  async getAll(branchId: string) {
    return await prisma.cte.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
    });
  },

  async update(id: string, data: any, branchId: string) {
    // 1. Validamos se o CTE pertence à unidade
    const currentCte = await prisma.cte.findFirst({
      where: { id, branchId },
    });

    if (!currentCte) {
      throw new Error("CTE não encontrado nesta unidade.");
    }

    // 2. Preparamos o objeto de atualização com valores novos ou mantendo os antigos
    const dataToUpdate: any = {
      cause: data.cause !== undefined ? data.cause : currentCte.cause,
      value: data.value !== undefined ? Number(data.value) : currentCte.value,
      description:
        data.description !== undefined
          ? data.description
          : currentCte.description,
      accountable:
        data.accountable !== undefined
          ? data.accountable
          : currentCte.accountable,
      status: data.status !== undefined ? data.status : currentCte.status,
    };

    // 3. Lógica Centralizada: Se a causa mudar para Indenização
    if (data.cause === "Indenização") {
      // Se mudou para indenização, garantimos que o valor seja o enviado ou o que já existia
      dataToUpdate.value =
        data.value !== undefined ? Number(data.value) : currentCte.value;

      // Se você quiser que ao marcar Indenização o status vá para Finalizado:
      // dataToUpdate.status = "Finalizado";
    }

    // 4. Tratamento do R.O
    if (data.ro !== undefined) {
      dataToUpdate.ro = data.ro !== "" ? Number(data.ro) : null;
    }

    // 5. Executa o update único
    return await prisma.cte.update({
      where: { id },
      data: dataToUpdate,
    });
  },

  async delete(id: string, branchId: string) {
    const cte = await prisma.cte.findFirst({ where: { id, branchId } });
    if (!cte) throw new Error("Acesso negado ou registro inexistente.");
    return await prisma.cte.delete({ where: { id } });
  },

  async getFinancialReport(year: number, month?: number, branchId?: string) {
    let startDate: Date;
    let endDate: Date;

    if (month && month > 0) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    return await prisma.cte.groupBy({
      by: ["accountable"],
      where: {
        branchId,
        cause: "Indenização", // O gráfico financeiro olha apenas para esta causa
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { value: true },
      _count: { id: true },
    });
  },
};
