import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ResponseHandler } from "./common/helpers/response-handler";
import { messages } from "./common/helpers/message";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;
  let responseHandler: ResponseHandler;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(),
          },
        },
        {
          provide: ResponseHandler,
          useValue: {
            successResponseWithData: jest.fn(),
            errorResponse: jest.fn(),
            catchErrorResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    responseHandler = app.get<ResponseHandler>(ResponseHandler);
  });

  describe("getHello", () => {
    it('should return "Hello World!" via successResponseWithData', async () => {
      const mockResult = { success: true, message: messages.FETCH_SUCCESS, data: "Hello World!" };
      jest.spyOn(appService, "getHello").mockResolvedValue(mockResult);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await appController.getHello(res);

      expect(appService.getHello).toHaveBeenCalled();
      expect(responseHandler.successResponseWithData).toHaveBeenCalledWith(res, mockResult.message, mockResult.data);
    });

    it("should return errorResponse on failure", async () => {
      const mockResult = { success: false, message: "Error" };
      jest.spyOn(appService, "getHello").mockResolvedValue(mockResult);

      const res = {} as any;

      await appController.getHello(res);

      expect(responseHandler.errorResponse).toHaveBeenCalledWith(res, mockResult.message);
    });
  });
});
