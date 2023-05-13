import { Router } from "express";
import { getCustomerById, getCustomers, insertCustomer, updateCustomerById } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validationSchema.js";
import { customersSchema, customersSchemaUpdate } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customersSchema), insertCustomer);
customersRouter.put("/customers/:id", validateSchema(customersSchemaUpdate), updateCustomerById);


export default customersRouter;