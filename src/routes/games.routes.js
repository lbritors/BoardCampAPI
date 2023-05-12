import { Router } from "express";
import { getGames, insertGames } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validationSchema.js";
import { gamesSchema } from "../schemas/games.schema.js";


const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gamesSchema), insertGames);

export default gamesRouter;