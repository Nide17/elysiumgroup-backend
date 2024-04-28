import express from "express"
import mongoose from "mongoose"
import session from "express-session"
import dotenv from "dotenv"
import cors from "cors"

import usersRouter from "./routes/users-routes.js"
import projectsRouter from "./routes/projects-routes.js"
import clientsRouter from "./routes/clients-routes.js"
import servicesRouter from "./routes/services-routes.js"
import projectsTypesRouter from "./routes/projectTypes-routes.js"
import contactsRouter from "./routes/contacts-routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 },
  })
)

app.use("/api/users", usersRouter)
app.use("/api/projects", projectsRouter)
app.use("/api/clients", clientsRouter)
app.use("/api/project_types", projectsTypesRouter)
app.use("/api/services", servicesRouter)
app.use("/api/contacts", contactsRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected to a database and listening to localhost 5000")
  )
  .catch((err) => console.log(err))
