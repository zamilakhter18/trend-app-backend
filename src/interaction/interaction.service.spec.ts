import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { InteractionService } from "./interaction.service";
import { Interaction } from "../db/entities/Interaction.entity";
import { Save } from "../db/entities/Save.entity";
import { Clickout } from "../db/entities/Clickout.entity";

describe("InteractionService", () => {
  let service: InteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        {
          provide: getRepositoryToken(Interaction),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Save),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Clickout),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
