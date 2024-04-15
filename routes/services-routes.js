import express from "express";
import {
  getAllServices,
  addServices,
  updateService,
  deleteService,
} from "../controllers/service-controller";

import { isAuthenticated } from "../middlewares/authentication";

const serviceRouter = express.Router();

serviceRouter.get("/", isAuthenticated, getAllServices);
serviceRouter.post("/add", isAuthenticated, addServices);
serviceRouter.put("/update/:id", isAuthenticated, updateService);
serviceRouter.delete("/:id", isAuthenticated, deleteService);

export default serviceRouter;
