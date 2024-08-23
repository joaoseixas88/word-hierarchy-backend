import {
  WordHierarchyMaker,
  WordHierarchyThree,
  WordHierarchyThreeResult,
} from "../types";

export class WordHierarchyAnalizer {
  constructor(private readonly wordHierarchyMaker: WordHierarchyMaker) {}
  private recursionAnalyze(
    objectThree: WordHierarchyThree,
    depth: number = 0,
    result: WordHierarchyThreeResult = {}
  ): WordHierarchyThreeResult {
    if (!result[depth]) {
      result[depth] = [];
    }

    for (const key in objectThree) {
      result[depth].push(key);

      const isObject =
        typeof objectThree[key] === "object" &&
        !Array.isArray(objectThree[key]);
      if (isObject) {
        this.recursionAnalyze(
          objectThree[key] as WordHierarchyThree,
          depth + 1,
          result
        );
      }
      if (Array.isArray(objectThree[key])) {
        if (!result[depth + 1]) {
          result[depth + 1] = [];
        }
        result[depth + 1].push(...objectThree[key]);
      }
    }

    return result;
  }

  private async getValuesByDepth(depth: number) {
    const wordThree = await this.wordHierarchyMaker.make();
    const result = this.recursionAnalyze(wordThree);
    return result[depth];
  }
  async analize(
    input: WordHierarchyAnalizer.Input
  ): Promise<WordHierarchyAnalizer.Output> {
    const { depth, text } = input;
    const valuesToCheck = await this.getValuesByDepth(depth);
    const result = valuesToCheck.reduce((acc, keyToCheck) => {
      const regex = new RegExp(`\\b${keyToCheck}\\b`, "gi");
      const matches = text.match(regex);
      if (matches?.length) {
        acc.push({
          value: keyToCheck,
          amount: matches.length,
        });
      }
      return acc;
    }, [] as WordHierarchyAnalizer.Output);

    return result;
  }
}

export namespace WordHierarchyAnalizer {
  export type Input = {
    depth: number;
    text: string;
  };
  export type Output = {
    value: string;
    amount: number;
  }[];
}
