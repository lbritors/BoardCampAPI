import { Router } from "express";
import { validateSchema } from "../middlewares/validationSchema.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";
import { getRentals, insertRentals } from "../controllers/rentals.controller.js";


const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalsSchema), insertRentals);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.get("/rentals/:id/return");
rentalsRouter.delete("/rentals/:id");

export default rentalsRouter;