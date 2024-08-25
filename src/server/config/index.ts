import '../../../setup'
import express, { json } from "express";
import { env } from "../../config/env";
import installRoutes from "./routes";
import cors from 'cors'

const { PORT } = env;
const app = express();
app.use(json());
app.use(cors());
installRoutes(app);
app.listen(PORT, () => console.log(`Server started on: ${PORT}`));
