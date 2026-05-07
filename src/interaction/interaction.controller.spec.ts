import { Test, TestingModule } from "@nestjs/testing";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";
import { ResponseHandler } from "../common/helpers/response-handler";

describe("InteractionController", () => {
  let controller: InteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionController],
      providers: [
        {
          provide: InteractionService,
          useValue: {},
        },
        {
          provide: ResponseHandler,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InteractionController>(InteractionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
