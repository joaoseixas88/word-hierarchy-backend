import { WordHierarchyMakerByFile } from "../src/services/word-hierarchy-maker-by-file";
import { WordThreeValidator } from "../src/validator";

const expectedValue = {
  Animais: {
    Aves: {
      Pássaros: ["Canários", "Papagaios", "Pardais", "Rouxinóis"],
      Rapinas: ["Águias", "Falcões", "Corujas", "Milhafres"],
    },
    Mamíferos: {
      Carnívoros: { Felinos: ["Leões", "Tigres", "Jaguares", "Leopardos"] },
      Herbívoros: {
        Bovídeos: ["Bois", "Búfalos", "Antílopes", "Cabras"],
        Equídeos: ["Cavalos", "Zebras", "Asnos"],
      },
      Primatas: ["Gorilas", "Chimpanzés", "Orangotangos"],
    },
  },
  Construções: {
    Edifícios: {
      Comerciais: ["Escritórios", "Lojas", "Shopping Centers"],
      Industriais: ["Fábricas", "Armazéns", "Galpões"],
      Residenciais: ["Casas", "Apartamentos", "Sobrados"],
    },
    Infraestrutura: {
      Energia: ["Usinas", "Subestações", "Linhas de Transmissão"],
      Hidráulica: ["Barragens", "Canalizações", "Reservatórios"],
      Transportes: ["Rodovias", "Ferrovias", "Aeroportos"],
    },
    Monumentos: ["Estátuas", "Praças", "Memoriais"],
  },
};

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
    const sut = new WordHierarchyMakerByFile(
      validator,
      "any_invalid_directory"
    );
    const promise = sut.make();
    await expect(promise).rejects.toEqual(new Error("Error reading file"));
  });
  it("it should throws an error if validator fails", async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, "isValid").mockReturnValueOnce(false);
    const promise = sut.make();

    await expect(promise).rejects.toEqual(
      new Error(
        "Object readed is not in valid format, the object example and type is in README.md"
      )
    );
  });
  it("it parse data correctly if file exists and is in correct format", async () => {
    const { sut } = makeSut();
    const result = await sut.make();
    expect(result).toEqual(expectedValue);
  });
});
