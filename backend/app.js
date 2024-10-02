import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes Imports
import usersRouter from "./routes/user.routes.js";
import postsRouter from "./routes/post.routes.js";
import messagesRouter from "./routes/message.routes.js";
// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/messages", messagesRouter);

export { app };
