import cookieParser from "cookie-parser";
import jsonServer from "json-server";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

export const db = router.db;

server.use(
  cors({
    origin: "https://jobly-flame.vercel.app/",
    credentials: true,
  })
);
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cookieParser());

const PORT = process.env.PORT || 3000;

server.use("/api/auth", authRoutes);
server.use("/api/jobs", jobRoutes);
server.use("/api/users", authenticateToken, userRoutes);

server.use("/api", router);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
