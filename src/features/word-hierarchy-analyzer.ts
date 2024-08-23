import {
  WordHierarchyMaker,
  WordHierarchyThree,
  WordHierarchyThreeResult,
  WordHierarchyThreeResultWithChildren,
} from "../types";

type ResultType = {
  key: string;
  children: string[];
};

export class WordHierarchyAnalizer {
  constructor(private readonly wordHierarchyMaker: WordHierarchyMaker) {}

  getChildrenData(
    obj: Record<string, object | string[]>,
    words: string[] = []
  ): string[] {
    for (const key in obj) {
      const currentNode = obj[key];
      words.push(key);
      if (Array.isArray(currentNode)) {
        words.push(...currentNode);
        continue;
      }
      if (!Array.isArray(currentNode) && typeof currentNode === "object") {
        const currentNodesChildren = this.getChildrenData(
          currentNode as Record<string, object | string[]>
        );
        words.push(...currentNodesChildren);
        continue;
      }
    }
    return words;
  }

  getLevels(
    obj: Record<string, object | string[]>,
    currenctDepth: number = 1,
    result: Record<string | number, ResultType[]> = {}
  ) {
    if (!result[currenctDepth]) {
      result[currenctDepth] = [];
    }
    for (const key in obj) {
      const currentNode = obj[key];
      if (Array.isArray(currentNode)) {
        result[currenctDepth].push({ key, children: currentNode.concat(key) });
        continue;
      }
      if (!Array.isArray(currentNode) && typeof currentNode === "object") {
        const children = this.getChildrenData(
          currentNode as Record<string, object | string[]>
        );
        result[currenctDepth].push({ key, children: [key].concat(children) });
        this.getLevels(
          currentNode as Record<string, object | string[]>,
          currenctDepth + 1,
          result
        );
        continue;
      }
    }
    return result;
  }
  async getDepth(depth: number) {
    const data = await this.wordHierarchyMaker.make();
    const allLevels = this.getLevels(data);
    return allLevels[depth];
  }

  async analyze({
    depth,
    text,
  }: WordHierarchyAnalizer.Input): Promise<WordHierarchyAnalizer.Output> {
    const depthData = await this.getDepth(depth);
		if(!depthData) return []
    const result: WordHierarchyAnalizer.Output = Object.values(depthData).map(
      ({ children, key }) => {
        let amount = 0;
        for (const value of children) {
          const regex = new RegExp(`\\b${value}\\b`, "gi");
          const matches = text.match(regex);
          if (matches?.length) {
            amount += matches.length;
          }
        }
        return {
          amount,
          value: key,
        };
      }
    );
		return result.filter(val => val.amount)
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
