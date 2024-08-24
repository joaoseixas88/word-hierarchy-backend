import { readFile, writeFile } from "fs/promises";
import { injectable } from "tsyringe";
import { WordHierarchyThree } from "../types";
import { WordThreeValidator } from "../validator";

@injectable()
export class WordHierarchyFileService {
  constructor(private readonly validator: WordThreeValidator) {}
  private _timeLapsed = 0;

  async saveFile(data: WordHierarchyThree, filepath: string) {
    const isValidData = this.validator.isValid(data);
    if (!isValidData) {
      return false;
    } else {
      try {
        await writeFile(filepath, JSON.stringify(data));
        return true;
      } catch (error) {
        return false;
      }
    }
  }
  async read(filepath: string): Promise<string | undefined> {
    const start = new Date();
    try {
      const file = await readFile(filepath, { encoding: "utf-8" });
      return file;
    } catch (error) {
      return undefined;
    } finally {
      const end = new Date();
      this._timeLapsed = end.getMilliseconds() - start.getMilliseconds();
    }
  }
  get timeLapsed() {
    return this._timeLapsed;
  }

  async getFileData(filepath: string): Promise<WordHierarchyThree | undefined> {
    const readedFile = await this.read(filepath);
    if (!readedFile) {
      return undefined;
    }
    const parsedData = JSON.parse(readedFile) as WordHierarchyThree;
    const isValid = this.validator.isValid(parsedData);
    if (!isValid) {
      throw new Error(
        "Object readed is not in valid format, the object example and type is in README.md"
      );
    }

    return parsedData;
  }
}
