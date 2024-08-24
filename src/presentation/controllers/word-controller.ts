import { inject, injectable } from "tsyringe";
import { HttpContextContract } from "../../types/http";
import { SchemaValidator } from "../../validator/schema-validator";
import { z } from "zod";
import { WordHierarchyFileService } from "../../services";
import { WordHierarchyAnalizer } from "../../features";
import { WordControllerSchema } from "../../schemas";


@injectable()
export class WordController {
  constructor(
    @inject("basepath")
    private readonly basepath: string,
    private readonly fileMaker: WordHierarchyFileService,
    private readonly wordAnalyzer: WordHierarchyAnalizer
  ) {}

  private getFilePath(path: string) {
    return `${this.basepath}/${path}`;
  }

  async getFileData({ request, response }: HttpContextContract) {
    const params = SchemaValidator.validateSchema(
      WordControllerSchema.analize(),
      request.allParams()
    );
    const data = await this.fileMaker.getFileData(
      this.getFilePath(params.fileName)
    );
    const result = await this.wordAnalyzer.analyze({ ...params, data } as any);
    return response.ok(result);
  }
}
