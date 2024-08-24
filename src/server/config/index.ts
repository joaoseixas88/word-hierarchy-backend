import '../../../setup'
import express, { json } from "express";
import { env } from "../../config/env";
import installRoutes from "./routes";

const { PORT } = env;
const app = express();
app.use(json());
installRoutes(app);
app.listen(PORT, () => console.log(`Server started on: ${PORT}`));
