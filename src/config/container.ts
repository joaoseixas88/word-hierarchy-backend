import { container } from "tsyringe";
import { GetFilesController } from "../presentation/controllers";
import { WordController } from "../presentation/controllers/word-controller";
const path = `${process.cwd()}/dicts/`;
container.register("basepath", { useValue: path });
container.register(GetFilesController, GetFilesController);
container.register(WordController, WordController);
