import { WordHierarchyMakerByFile } from "../src/services/word-hierarchy-maker-by-file";
import { WordThreeValidator } from "../src/validator";

const makeSut = () => {
  const filepath = process.cwd() + "/dicts/example.json";
  class Validator extends WordThreeValidator {
    override isValid(value: any): boolean {
      return true;
    }
  }

  const validator = new Validator();
  const sut = new WordHierarchyMakerByFile(validator, filepath);

  return {
    sut,
    filepath,
    validator,
  };
};

describe("WordHierarchyMakerByFile", () => {
  it("it should throws an error if filepath is not correct", async () => {
    const { validator } = makeSut();
    const sut = new WordHierarchyMakerByFile(validator, "any_invalid_directory");
    const promise = sut.make();
		await expect(promise).rejects.toEqual(new Error('Error reading file'))
  });
});
