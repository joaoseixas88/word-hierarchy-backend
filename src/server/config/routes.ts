import { Express, Router } from "express";
import { GetFilesController } from "../../presentation/controllers";
import { WordController } from "../../presentation/controllers/word-controller";
import { adaptMethod } from "./controller-adapter";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  router.post("/words", adaptMethod(WordController, "getFileData"));
  router.get(
    "/files/data/:filename",
    adaptMethod(GetFilesController, "getFileDataByName")
  );
  router.get("/files/data", adaptMethod(GetFilesController, "getAllFilesData"));
  router.get("/files", adaptMethod(GetFilesController, "listFiles"));   
  router.post("/files", adaptMethod(GetFilesController, "saveData"));   
};
