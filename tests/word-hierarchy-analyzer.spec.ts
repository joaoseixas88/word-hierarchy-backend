import {
  WordHierarchyMaker,
  WordHierarchyThree,
  WordHierarchyThreeResult,
} from "../src/types";
import { WordHierarchyAnalizer } from "../src/word-hierarchy-analyzer";

const threeExample = {
  Animais: {
    Mamíferos: {
      Carnívoros: {
        Felinos: ["Leões", "Tigres", "Jaguares", "Leopardos"],
      },
      Herbívoros: {
        Equídeos: ["Cavalos", "Zebras", "Asnos"],
        Bovídeos: ["Bois", "Búfalos", "Antílopes", "Cabras"],
      },
      Primatas: ["Gorilas", "Chimpanzés", "Orangotangos"],
    },
    Aves: {
      Rapinas: ["Águias", "Falcões", "Corujas", "Milhafres"],
      Pássaros: ["Canários", "Papagaios", "Pardais", "Rouxinóis"],
    },
  },
};

const makeSut = () => {
  class WordHierarchyMakerStub implements WordHierarchyMaker {
    make(): Promise<WordHierarchyThree> {
      return new Promise((res) => res(threeExample));
    }
  }

  const sut = new WordHierarchyAnalizer(new WordHierarchyMakerStub());

  return {
    sut,
  };
};

const {
  Animais: {
    Aves: { Pássaros, Rapinas },
    Mamíferos: {
      Carnívoros: { Felinos },
      Herbívoros: { Bovídeos, Equídeos },
      Primatas,
    },
  },
} = threeExample;
const expected = {
  "0": ["Animais"],
  "1": ["Mamíferos", "Aves"],
  "2": ["Carnívoros", "Herbívoros", "Primatas", "Rapinas", "Pássaros"],
  "3": [
    "Felinos",
    "Equídeos",
    "Bovídeos",
    ...Pássaros,
    ...Rapinas,
    ...Primatas,
  ],
  "4": [...Felinos, ...Bovídeos, ...Equídeos],
};

const sortData = (val: WordHierarchyThreeResult) =>
  Object.entries(val).map(([key, value]) => [key, value.sort()]);

describe("WordHierarchyAnalizer", () => {
  it("it shoult get the depth three correctly", () => {
    const { sut } = makeSut();
    const result = sut["recursionAnalyze"](threeExample);

    expect(sortData(result)).toEqual(sortData(expected));
  });

  it("should get values correctly by depth", async () => {
    const { sut } = makeSut();
    const getValues = (depth: number) => sut["getValuesByDepth"](depth);
    expect(await getValues(0)).toEqual(["Animais"]);
    expect(await getValues(1)).toEqual(["Mamíferos", "Aves"]);
    expect(await getValues(2).then((res) => res.sort())).toEqual(
      expected["2"].sort()
    );
  });

  it("should get values correctly by depth", async () => {
    const { sut } = makeSut();
    const result = await sut.analize({
      depth: 3,
      text: "os felinos, geralmente, são carnívoros",
    });
    const result_2 = await sut.analize({
      depth: 2,
      text: "os felinos, geralmente, são carnívoros",
    });
    const result_3 = await sut.analize({
      depth: 3,
      text: "Os pardais, os papagaios e os canários são pássaros lindíssimos, porém dentre eles, o canário é o mais belo de todos e são ainda mais belos os canários encontrados livres na natureza. ",
    });
    expect(result).toEqual([{ value: "Felinos", amount: 1 }]);
    expect(result_2).toEqual([{ value: "Carnívoros", amount: 1 }]);
    expect(result_3).toEqual([
      { value: "Canários", amount: 2 },
      { value: "Papagaios", amount: 1 },
      { value: "Pardais", amount: 1 },
    ]);
  });
});
