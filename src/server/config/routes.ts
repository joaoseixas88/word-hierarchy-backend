import { Express, Router } from "express";
import { GetFilesController } from "../../presentation/controllers";
import { WordController } from "../../presentation/controllers/word-controller";
import { adaptMethod } from "./controller-adapter";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  router.get("/words", adaptMethod(WordController, "getFileData"));
  router.get(
    "/files/:filename",
    adaptMethod(GetFilesController, "getFileDataByName")
  );
  router.get("/files", adaptMethod(GetFilesController, "listFiles"));
};
