import { WordHierarchyThree } from "./word-hierarchy-three";

export interface WordHierarchyMaker {
  make(): Promise<WordHierarchyThree>;
}