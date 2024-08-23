import { WordHierarchyAnalizer } from "../src/features";
import {
  WordHierarchyMaker,
  WordHierarchyThree,
  WordHierarchyThreeResult,
} from "../src/types";
import { extenseText } from "./mocks/extense-text";

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
  const wordHierarchyStub = new WordHierarchyMakerStub();
  const sut = new WordHierarchyAnalizer(wordHierarchyStub);

  return {
    sut,
    wordHierarchyStub,
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
  it("should return all children data", () => {
    const { sut } = makeSut();
    const result = sut.getChildrenData({
      values: {
        some: { data: ["value_1", "value_2"] },
        anotherValue: {
          internal: ["someInternalValue"],
        },
      },
      secondValues: ["all"],
    });
    expect(result).toEqual(
      expect.arrayContaining([
        "values",
        "some",
        "anotherValue",
        "secondValues",
        "all",
        "internal",
        "someInternalValue",
        "value_1",
        "value_2",
      ])
    );
  });
  it("should return all children data", () => {
    const { sut } = makeSut();
    const result = sut.getChildrenData({
      values: ["alguns", "valores"],
    });
    expect(result).toEqual(
      expect.arrayContaining(["values", "alguns", "valores"])
    );
  });
  it("should return all levels with correct keys and children values", () => {
    const { sut } = makeSut();
    const result = sut.getLevels({
      animais: {
        felinos: ["gatos", "leões"],
      },
      construcoes: ["casas", "edificios"],
    }) as object;
    expect(result[1][0].children).toEqual(
      expect.arrayContaining(["animais", "gatos", "leões", "felinos"])
    );
    expect(result[1][1].children).toEqual(
      expect.arrayContaining(["casas", "edificios", "construcoes"])
    );
    expect(result[2][0].children).toEqual(
      expect.arrayContaining(["gatos", "leões", "felinos"])
    );
  });
  it("should go deep and get correct values", () => {
    const { sut } = makeSut();
    const result = sut.getLevels({
      animais: {
        felinos: {
          carnivoros: {
            selvagens: ["leões"],
            doceis: ["gatos"],
          },
        },
      },
    }) as object;
    expect(result[3][0].children).toEqual(
      expect.arrayContaining(["carnivoros", "gatos", "leões", "selvagens"])
    );
    expect(result[4][0].children).toEqual(
      expect.arrayContaining(["leões", "selvagens"])
    );
    expect(result[4][1].children).toEqual(
      expect.arrayContaining(["gatos", "doceis"])
    );
  });
  it("should go very deep and get correct values", () => {
    const { sut } = makeSut();
    const result = sut.getLevels({
      some: {
        very: {
          deep: {
            values: {
              internal: {
                very: {
                  internal: ["values"],
                },
              },
            },
          },
        },
      },
    }) as object;
    expect(result[7][0].children).toEqual(
      expect.arrayContaining(["internal", "values"])
    );
  });
  it("should return undefined if a level does not exits", () => {
    const { sut } = makeSut();
    const result = sut.getLevels({
      some: {
        very: {
          deep: {
            values: {
              internal: {
                very: {
                  internal: ["values"],
                },
              },
            },
          },
        },
      },
    }) as object;
    expect(result[8]).toBe(undefined);
  });

  it("should return correct level", async () => {
    const { sut, wordHierarchyStub } = makeSut();
    jest.spyOn(wordHierarchyStub, "make").mockResolvedValue(
      new Promise((res) => {
        res({
          animais: {
            felinos: {
              carnivoros: {
                selvagens: ["leões"],
                doceis: ["gatos"],
              },
            },
          },
        });
      })
    );
    expect(await sut.getDepth(3)).toEqual([
      {
        key: "carnivoros",
        children: expect.arrayContaining([
          "carnivoros",
          "selvagens",
          "doceis",
          "leões",
          "gatos",
        ]),
      },
    ]);
    expect(await sut.getDepth(4)).toEqual([
      {
        key: "selvagens",
        children: expect.arrayContaining(["selvagens", "leões"]),
      },
      {
        key: "doceis",
        children: expect.arrayContaining(["doceis", "gatos"]),
      },
    ]);
  });

  it("should analyze text and return correct values", async () => {
    const { sut } = makeSut();
    expect(await sut.analyze({ text: "Eu amo papagaios", depth: 2 })).toEqual([
      { value: "Aves", amount: 1 },
    ]);
    expect(
      await sut.analyze({
        text: "Eu tenho preferência por animais carnívoros",
        depth: 5,
      })
    ).toEqual([]);
    expect(
      await sut.analyze({ text: "Eu vi gorilas e papagaios", depth: 3 })
    ).toEqual(
      expect.arrayContaining([
        { value: "Pássaros", amount: 1 },
        { value: "Primatas", amount: 1 },
      ])
    );
  });
});
