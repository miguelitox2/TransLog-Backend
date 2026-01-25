import { prisma } from "../config/prisma";

export const clientService = {
  formatPhone(phone: string): string {
    const numbers = phone.replace(/\D/g, "");
    if (numbers.length !== 11) {
      throw new Error("O telefone deve conter 11 dígitos (DDD + número).");
    }
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  },

  async create(data: {
    name: string;
    phone: string;
    email: string;
    branchId: string;
  }) {
    // Verificação de segurança que você já implementou
    if (!data.branchId) {
      throw new Error(
        "ID da unidade não identificado. Não é possível cadastrar o cliente.",
      );
    }

    return await prisma.client.create({
      data: {
        name: data.name,
        phone: this.formatPhone(data.phone),
        email: data.email.toLowerCase().trim(),
        // Usando a chave estrangeira direta (mais simples se o connect falhar)
        branchId: data.branchId,
      },
    });
  },

  async getAll(branchId: string) {
    // Se o usuário for um DEV (Admin), talvez você queira que ele veja todos?
    // Se não, mantenha o filtro abaixo para isolamento total.
    return await prisma.client.findMany({
      where: {
        branchId: branchId,
      },
      orderBy: { name: "asc" },
    });
  },

  async getById(id: string) {
    return await prisma.client.findUnique({ where: { id } });
  },

  async update(
    id: string,
    data: {
      name?: string;
      email?: string | string[];
      phone?: string | string[];
    },
  ) {
    // Função auxiliar para sanitizar arrays ou strings
    const formatList = (input: string | string[] | undefined) => {
      if (!input) return "";
      if (Array.isArray(input)) {
        return input.filter((item) => item.trim() !== "").join(", ");
      }
      return input;
    };

    return await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: formatList(data.email),
        phone: formatList(data.phone),
      },
    });
  },

  async delete(id: string) {
    return await prisma.client.delete({ where: { id } });
  },
};
