import { readdir } from "fs/promises";
import { inject, injectable } from "tsyringe";
import { WordHierarchyMakerByFile } from "../../services";
import { HttpContextContract, HttpResponse } from "../../types/http";

@injectable()
export class GetFilesController {
  constructor(
    private readonly fileMaker: WordHierarchyMakerByFile,
    @inject("basepath")
    private basepath: string
  ) {}

  public async listFiles({
    response,
  }: HttpContextContract): Promise<HttpResponse> {
    const files = await readdir(this.basepath);
    return response.ok(files);
  }

  public async getFileDataByName({ request, response }: HttpContextContract) {
    try {
      const allParams = request.allParams();
      const fileData = await this.fileMaker.make(
        this.basepath + allParams.filename
      );
      if (!fileData) {
        return response.notFound();
      }
      return response.ok(fileData);
    } catch (error) {
      console.log("error:", error);
      return response.internalServerError();
    }
  }
}
