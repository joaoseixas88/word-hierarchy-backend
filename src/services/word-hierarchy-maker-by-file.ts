import { WordHierarchyMaker, WordHierarchyThree } from "../types";
import { readFile } from "fs/promises";
import { WordThreeValidator } from "../validator";

export class WordHierarchyMakerByFile implements WordHierarchyMaker {
  constructor(
    private readonly validator: WordThreeValidator,
    private readonly filepath: string
  ) {}

  private _timeLapsed = 0;

  async read(filepath: string): Promise<string> {
    try {
      const start = new Date();
      const file = await readFile(filepath, { encoding: "utf-8" });
      const end = new Date();
      this._timeLapsed = end.getMilliseconds() - start.getMilliseconds();
      return file;
    } catch (error) {
      throw new Error("Error reading file");
    }
  }

  get timeLapsed() {
    return this._timeLapsed;
  }

  async make(): Promise<WordHierarchyThree> {
    const readedFile = await this.read(this.filepath);
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
