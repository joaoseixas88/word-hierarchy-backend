import { z } from "zod";

export class WordControllerSchema {
  static analize() {
    return z.object({
      depth: z.coerce.number(),
      text: z.string(),
      fileName: z.string(),
    });
  }
}
