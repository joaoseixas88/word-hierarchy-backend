export type HttpResponse<T = any> = {
  statusCode: number;
  data?: T;
};

export type HttpContextContract = {
  request: {
    allParams(): any;
    headers(): Record<string, string>;
  };
  response: {
    ok(data: any): HttpResponse;
    badRequest(data: any): HttpResponse;
    noContent(data: any): HttpResponse;
    internalServerError(): HttpResponse;
    notFound(data?: any): HttpResponse;
    created(): HttpResponse;
    sendFile(filePath: string, fileName?: string): void;
  };
};
