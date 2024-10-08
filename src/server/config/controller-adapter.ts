import { Request, Response } from "express";
import { container } from "tsyringe";
import { ValidationException } from "../../presentation/errors/validation";
import { HttpContextContract, HttpResponse } from "../../types/http";

export const httpCtx = (req: Request, res: Response): HttpContextContract => ({
  request: {
    allParams: () => ({
      ...(req.params || {}),
      ...(req.query || {}),
      ...(req.body || {}),
    }),
    headers: () => req.headers as Record<string, string>,
  },
  response: {
    ok: (data: any) => ({ data, statusCode: 200 }),
    badRequest: (error: any) => ({ data: error, statusCode: 400 }),
    noContent: () => ({ statusCode: 200 }),
    notFound: (data?: any) => ({
      statusCode: 404,
      data: data ? data : "Not found",
    }),
    internalServerError: () => ({
      statusCode: 500,
      data: "Internal server error",
    }),
    created: () => ({ statusCode: 201 }),
    sendFile: (filePath: string, fileName?: string) => {
      const options = fileName
        ? {
            headers: {
              "Content-Disposition": `attachment; filename=${fileName}`,
            },
          }
        : {};
      return res.sendFile(filePath, options, (err: any) => {
        if (err) {
          if(err.code === 'ENOENT'){
						res.status(404).send("File not found");
						return
					}

          res.status(500).send("Internal server error");
        }
      });
    },
  },
});

export const adaptMethod =
  <T>(controller: new (...args: any[]) => T, method: keyof T) =>
  async (req: Request, res: Response) => {
    try {
      const instance = container.resolve(controller);
      const ctx = httpCtx(req, res);
      if (typeof instance[method] === "function") {
        const httpResponse: HttpResponse = await instance[method](ctx);
        if (httpResponse === undefined) {
          return;
        }
        if (!res.headersSent) {
          res.status(httpResponse.statusCode).json(httpResponse.data);
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (error instanceof ValidationException) {
        return res.status(error.statusCode).json(error.issues);
      }
      return res.status(500).send("Internal server error");
    }
  };
