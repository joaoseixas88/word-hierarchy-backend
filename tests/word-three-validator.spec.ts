import { WordThreeValidator } from "../src/validator";
import { exmapleFormat } from "./mocks/example-format";

const makeSut = () => {
  const sut = new WordThreeValidator();

  return {
    sut,
  };
};

describe("WordThreeValidator", () => {
  it("it should return false if value is not valid", () => {
    const { sut } = makeSut();
    const invalidValue = [{ some: { values: [1, 2, 3, 4] } }];
    const result = sut.isValid(invalidValue);
    expect(result).toBe(false);
  });
  it("it should return false if value is not valid", () => {
    const { sut } = makeSut();
    const invalidValue = { some: { value:{} } };
    const result = sut.isValid(invalidValue);
    expect(result).toBe(false);
  });
  it("it should return false if value is not valid", () => {
    const { sut } = makeSut();
    const invalidValue = {
      some: {
        value: {
          is: {
            not: {
              valid: [{ 1: 2 }],
            },
          },
        },
      },
    };
    const result = sut.isValid(invalidValue);
    expect(result).toBe(false);
  });
  it("should validate a object that has correct format", () => {
    const { sut } = makeSut();
    const result = sut.isValid(exmapleFormat);
    expect(result).toBe(true);
  });
});
