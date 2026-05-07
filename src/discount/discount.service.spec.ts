import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, MoreThan, IsNull } from "typeorm";
import { DiscountService } from "./discount.service";
import { DiscountCode } from "../db/entities/DiscountCode.entity";
import { messages } from "../common/helpers/message";

describe("DiscountService", () => {
  let service: DiscountService;
  let repository: Repository<DiscountCode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        {
          provide: getRepositoryToken(DiscountCode),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
    repository = module.get<Repository<DiscountCode>>(getRepositoryToken(DiscountCode));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllAvailable", () => {
    it("should return all active discount codes", async () => {
      const mockDiscounts = [
        { id: "1", code: "SAVE10", isActive: true },
        { id: "2", code: "SAVE20", isActive: true },
      ];
      jest.spyOn(repository, "find").mockResolvedValue(mockDiscounts as any);

      const result = await service.findAllAvailable();

      expect(result.success).toBe(true);
      expect(result.message).toBe(messages.FETCH_SUCCESS);
      expect(result.data).toEqual(mockDiscounts);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: [
            { isActive: true, expiresAt: expect.any(Object) },
            { isActive: true, expiresAt: IsNull() },
          ],
        }),
      );
    });

    it("should handle errors", async () => {
      jest.spyOn(repository, "find").mockRejectedValue(new Error("DB Error"));

      const result = await service.findAllAvailable();

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB Error");
    });
  });
});
