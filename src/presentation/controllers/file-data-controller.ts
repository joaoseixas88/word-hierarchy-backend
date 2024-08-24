import { readdir } from "fs/promises";
import { inject, injectable } from "tsyringe";
import { WordHierarchyFileService } from "../../services";
import { HttpContextContract, HttpResponse } from "../../types/http";
import { SchemaValidator } from "../../validator/schema-validator";
import { GetFilesSchema } from "../../schemas/get-files-controller";

@injectable()
export class GetFilesController {
  constructor(
    private readonly fileMaker: WordHierarchyFileService,
    @inject("basepath")
    private basepath: string
  ) {}

  async getAllFilesData({ response }: HttpContextContract) {
    const files = await readdir(this.basepath);
    const data = await Promise.all(
      files.map(async (file) => {
        const fileData = await this.fileMaker.getFileData(this.basepath + file);
        return {
          filename: file,
          data: fileData,
        };
      })
    );
    return response.ok(data);
  }

  public async listFiles({
    response,
  }: HttpContextContract): Promise<HttpResponse> {
    const files = await readdir(this.basepath);
    return response.ok(files);
  }

  public async getFileDataByName({ request, response }: HttpContextContract) {
    try {
      const allParams = request.allParams();
      const fileData = await this.fileMaker.getFileData(
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

  async saveData({ request, response }: HttpContextContract) {
    const { filename, data } = SchemaValidator.validateSchema(
      GetFilesSchema.saveFile(),
      request.allParams()
    );
    const result = await this.fileMaker.saveFile(data, this.basepath + filename + '.json');
    if (result) {
      return response.created();
    } else {
      return response.internalServerError();
    }
  }
}
