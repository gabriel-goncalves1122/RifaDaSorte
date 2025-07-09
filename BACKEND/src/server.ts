import express from "express";
import cors from "cors";
import routes from "./routes/index";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Seu frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
