import { inject, injectable } from "tsyringe";
import { HttpContextContract } from "../../types/http";
import { SchemaValidator } from "../../validator/schema-validator";
import { z } from "zod";
import { WordHierarchyReaderByFile } from "../../services";
import { WordHierarchyAnalizer } from "../../features";

const schema = z.object({
  depth: z.coerce.number(),
  text: z.string(),
  fileName: z.string(),
});

@injectable()
export class WordController {
  constructor(
    @inject("basepath")
    private readonly basepath: string,
    private readonly fileMaker: WordHierarchyReaderByFile,
    private readonly wordAnalyzer: WordHierarchyAnalizer
  ) {}

  private getFilePath(path: string) {
    return `${this.basepath}/${path}`;
  }

  async getFileData({ request, response }: HttpContextContract) {
    const params = SchemaValidator.validateSchema(schema, request.allParams());
    const data = await this.fileMaker.getFileData(this.getFilePath(params.fileName));
    const result = await this.wordAnalyzer.analyze({ ...params, data } as any);
    return response.ok(result);
  }
}
