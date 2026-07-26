import dotenv from "dotenv";
import express, { type Express } from "express";
import teacherRouter from "./routes/teacher.routes.ts";
import classRouter from "./routes/class.routes.ts";
import cors from "cors";
import { corsOptions } from "./config/corsConfig.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import subjectRouter from "./routes/subject.routes.ts";
import { requestLogger } from "./middlewares/requestLogger.ts";
import { traceContextMiddleware } from "./middlewares/traceContext.ts";
import levelRouter from "./routes/level.routes.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use(traceContextMiddleware);

app.use("/api", classRouter);
app.use("/api", levelRouter);
app.use("/api", subjectRouter);
app.use("/api", teacherRouter);

app.use(errorHandler);

function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
