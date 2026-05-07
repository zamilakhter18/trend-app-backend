import { Test, TestingModule } from "@nestjs/testing";
import { TrendController } from "./trend.controller";
import { TrendService } from "./trend.service";
import { AiService } from "../ai/ai.service";
import { ResponseHandler } from "../common/helpers/response-handler";

describe("TrendController", () => {
  let controller: TrendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendController],
      providers: [
        { provide: TrendService, useValue: {} },
        { provide: AiService, useValue: {} },
        { provide: ResponseHandler, useValue: {} },
      ],
    }).compile();

    controller = module.get<TrendController>(TrendController);
  });
...

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
