import { WordHierarchyThree, WordHierarchyThreeResult } from "./types";

export class WordHierarchyAnalizer {
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
  analize() {}
}
