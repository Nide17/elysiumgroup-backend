import express from "express";
import {
  getAllClients,
  addClient,
  updateClient,
  getOneClient,
  deleteClient,
} from "../controllers/projectClient-controller";

import { isAuthenticated } from "../middlewares/authentication";

const clientRouter = express.Router();

clientRouter.get("/", isAuthenticated, getAllClients);
clientRouter.post("/add", isAuthenticated, addClient);
clientRouter.put("/update/:id", isAuthenticated, updateClient);
clientRouter.get("/:id", isAuthenticated, getOneClient);
clientRouter.delete("/:id", deleteClient);

export default clientRouter;
