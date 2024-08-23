export type WordHierarchyThree = Record<string, string[] | object>;

export type WordHierarchyThreeResult = Record<string | number, string[]>;
export type WordHierarchyThreeResultWithChildren = Record<
  string | number,
  { key: string; children: string[] }[]
>;
