import { WordHierarchyFileService } from "../src/services/word-hierarchy-file-service";
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
  const sut = new WordHierarchyFileService(validator);

  return {
    sut,
    filepath,
    validator,
  };
};

describe("WordHierarchyMakerByFile", () => {
  it("it should throws an error if filepath is not correct", async () => {
    const { validator } = makeSut();
    const sut = new WordHierarchyFileService(validator);
    const promise = await sut.getFileData("any_invalid");
    expect(promise).toBe(undefined);
  });
  it("it should throws an error if validator fails", async () => {
    const { sut, validator, filepath } = makeSut();
    jest.spyOn(validator, "isValid").mockReturnValueOnce(false);
    const promise = sut.getFileData(filepath);

    await expect(promise).rejects.toEqual(
      new Error(
        "Object readed is not in valid format, the object example and type is in README.md"
      )
    );
  });
  it("it parse data correctly if file exists and is in correct format", async () => {
    const { sut, filepath } = makeSut();
    const result = await sut.getFileData(filepath);
    expect(result).toEqual(expectedValue);
  });
});
