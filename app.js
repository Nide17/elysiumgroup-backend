import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import router from "./routes/user-routes";
import projectRouter from "./routes/project-routes";

const app = express();

app.use(express.json());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 300000}
}));

app.use("/api/users",router);
app.use("/api/projects",projectRouter);
mongoose
  .connect(
    "mongodb+srv://admin:QFKwtHdFkYEQtFa9@cluster0.uztuqy6.mongodb.net/elysium?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected to a database and listening to localhost 5000")
  )
  .catch((err) => console.log(err));
