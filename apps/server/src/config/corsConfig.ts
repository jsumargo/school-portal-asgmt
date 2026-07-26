import type { CorsOptions } from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [
  "http://localhost:5173",
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
