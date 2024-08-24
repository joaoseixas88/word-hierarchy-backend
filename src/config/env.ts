import { z } from "zod";
import { config } from "dotenv";
config();

const validateEnv = () => {
  try {
    const schema = z
      .object({
        PORT: z.coerce.number({
          message: "ENV(PORT) - Required",
        }),
      })
      .parse(process.env);
    return schema;
  } catch (error: any) {
    const [err] = error.issues;
    console.error(err.message);
    process.exit(1);
  }
};

export const env = validateEnv();
