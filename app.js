const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { createServer } = require("http");
const dotenv = require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const usersRouter = require('./routes/users-routes')
const projectsRouter = require('./routes/projects-routes')
const clientsRouter = require('./routes/clients-routes')
const servicesRouter = require('./routes/services-routes')
const projectsTypesRouter = require('./routes/projectTypes-routes')
const contactsRouter = require('./routes/contacts-routes')
const messagesRouter = require('./routes/messages-routes')
const chatroomsRouter = require('./routes/chatrooms-routes')
const { initialize } = require('./utils/socket')

dotenv.config()

const app = express()
const httpServer = createServer(app)

const allowList = [
  'http://localhost:5173',
  'http://localhost:5000',
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`)
  next()
})

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 48 },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
)

app.use("/api/users", usersRouter)
app.use("/api/projects", projectsRouter)
app.use("/api/clients", clientsRouter)
app.use("/api/project_types", projectsTypesRouter)
app.use("/api/services", servicesRouter)
app.use("/api/contacts", contactsRouter)
app.use("/api/messages", messagesRouter)
app.use("/api/chatrooms", chatroomsRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    httpServer.listen(5000, () => {
      console.log('Server is running on port 5000, and MongoDB is connected')
      initialize(httpServer)  // Initialize Socket.io after server starts
    })
  })
  .catch((err) => console.log(err))