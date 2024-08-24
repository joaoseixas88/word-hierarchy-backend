import { z } from "zod";

export class GetFilesSchema {
	static saveFile(){
		return z.object({
			data: z.any(),
			filename: z.string()
		})
	}
}