import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cteRoutes from "./routes/cteRoutes";
import clientRoutes from "./routes/clientRoutes";

const app = express();
app.use(cors({
  origin: "http://localhost:5173" // URL do seu Vite
}));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/ctes", cteRoutes);
app.use("/clients", clientRoutes);

app.listen(3333, () => {
  console.log("-----------------------------------------");
  console.log("🚀 Servidor iniciado com sucesso!");
  console.log("📡 Ouvindo na porta: 3333");
  console.log("-----------------------------------------");
});
