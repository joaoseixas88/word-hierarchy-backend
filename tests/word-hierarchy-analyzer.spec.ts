import { WordHierarchyThreeResult } from "../src/types";
import { WordHierarchyAnalizer } from "../src/word-hierarchy-analyzer";

const makeSut = () => {
  const sut = new WordHierarchyAnalizer();

  return {
    sut,
  };
};

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
    const result = sut.recursionAnalyze(threeExample);

    expect(sortData(result)).toEqual(sortData(expected));
  });
});
