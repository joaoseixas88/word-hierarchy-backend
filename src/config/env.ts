import { z } from "zod";
import { config } from "dotenv";
config();

const validateEnv = () => {
  const schema = z
    .object({
      PORT: z.coerce.number(),
    })
    .parse(process.env);
  return schema;
};

export const env = validateEnv();
