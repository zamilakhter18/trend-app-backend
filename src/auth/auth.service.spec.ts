import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { SupabaseService } from "../supabase/supabase.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserProfile } from "../db/entities/UserProfile.entity";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              auth: {
                signUp: jest.fn(),
                signInWithPassword: jest.fn(),
                refreshSession: jest.fn(),
                signOut: jest.fn(),
              },
            }),
          },
        },
        {
          provide: getRepositoryToken(UserProfile),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

