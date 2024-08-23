import express, { json } from "express";
import { env } from "../../config/env";

const { PORT } = env;
const app = express();

app.use(json());
app.listen(PORT, () => console.log(`Server started on: ${PORT}`));
