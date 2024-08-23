import { WordHierarchyMaker, WordHierarchyThree } from "../types";
import { readFile } from "fs/promises";
import { WordThreeValidator } from "../validator";



export class WordHierarchyMakerByFile implements WordHierarchyMaker {
  constructor(
    private readonly validator: WordThreeValidator,
    private readonly filepath: string
  ) {}

  async read(filepath: string): Promise<string> {
    try {
			const file = await readFile(filepath, { encoding: "utf-8" });
      return  file
    } catch (error) {
      throw new Error("Error reading file");
    }
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
