import { inject, injectable } from "tsyringe";
import { WordHierarchyAnalizer } from "../../features";
import { WordHierarchyMaker } from "../../types";
import { HttpContextContract } from "../../types/http";


// const schema = z.object({
// 	depth: z.coerce.number(),
// 	text: z.string(),
// 	fileName: z.string(),
// });

injectable();
export class WordHierarchyController {
  constructor(
    private readonly wordAnalyzer: WordHierarchyAnalizer,
		@inject('WordHierarchyMaker')
    private readonly fileMaker: WordHierarchyMaker
  ) {}
  private getFilePath(filename: string): string {
    const path = `${process.cwd()}/dicts/`;
    return path + filename;
  }

  async getFileData({ request, response }: HttpContextContract) {
    // const params = SchemaValidator.validateSchema(schema, request.allParams());
    // const data = await this.fileMaker.make(this.getFilePath(params.fileName));
    // const result = await this.wordAnalyzer.analyze({ ...params, data } as any);
    return response.ok('');
  }
}
