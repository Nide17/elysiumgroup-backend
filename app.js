import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import router from "./routes/user-routes";
import projectRouter from "./routes/project-routes";
import dotenv from "dotenv";
import clientRouter from "./routes/clients-routes";
import serviceRouter from "./routes/services-routes";
import projectTypeRouter from "./routes/project-type";

dotenv.config();

const app = express();
const mongodbURI = process.env.MONGODB_URI;

app.use(express.json());
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 },
  })
);

app.use("/api/users", router);
app.use("/api/projects", projectRouter);
app.use("/api/clients", clientRouter);
app.use("/api/project_type", projectTypeRouter);
app.use("/api/services", serviceRouter);
mongoose
  .connect(mongodbURI)
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected to a database and listening to localhost 5000")
  )
  .catch((err) => console.log(err));
