import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cteRoutes from "./routes/cteRoutes";
import clientRoutes from "./routes/clientRoutes";
import barcodeRoutes from "./routes/barcodeRoutes";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://trans-log-frontend.vercel.app", // Adicione a URL da Vercel aqui
      "https://translogapp.com.br", // Já adicione o seu domínio novo também
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/ctes", cteRoutes);
app.use("/clients", clientRoutes);
app.use("/barcode", barcodeRoutes);

app.listen(3333, () => {
  console.log("-----------------------------------------");
  console.log("🚀 Servidor iniciado com sucesso!");
  console.log("📡 Ouvindo na porta: 3333");
  console.log("-----------------------------------------");
});
