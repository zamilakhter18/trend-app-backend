import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { Roles } from "../common/decorators/role.decorator";
import { UserRoleEnum } from "../common/helpers/enum";

@ApiTags("Brands")
@ApiBearerAuth("JWT-auth")
@Controller("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: "Create a new brand (Admin only)" })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all brands" })
  findAll() {
    return this.brandService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a brand by ID" })
  findOne(@Param("id") id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: "Update a brand (Admin only)" })
  update(@Param("id") id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(":id")
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: "Delete a brand (Admin only)" })
  remove(@Param("id") id: string) {
    return this.brandService.remove(id);
  }
}
