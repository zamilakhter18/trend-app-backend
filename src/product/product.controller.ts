import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Add a new product integration' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    example: {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { id: 'uuid', name: 'Product Name' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: 'Bad request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try {
      const result = await this.productService.create(createProductDto);
      return this.responseHandler.successResponseWithData(res, messages.CREATE_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all products for a specific trend' })
  @ApiOkResponse({
    description: 'Products fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: [{ id: 'uuid', name: 'Product Name' }],
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async findAllByTrend(@Query('trend_id') trendId: string, @Res() res: Response) {
    try {
      const result = await this.productService.findAllByTrend(trendId);
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific product' })
  @ApiOkResponse({
    description: 'Product details fetched successfully',
    example: {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: { id: 'uuid', name: 'Product Name' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    example: {
      statusCode: 404,
      message: 'Resource not found',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.productService.findOne(id);
      if (!result) {
        return this.responseHandler.errorResponse(res, messages.NOT_FOUND);
      }
      return this.responseHandler.successResponseWithData(res, messages.FETCH_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update product information' })
  @ApiOkResponse({
    description: 'Product updated successfully',
    example: {
      statusCode: 200,
      message: 'Resource updated successfully',
      data: { id: 'uuid', name: 'Updated Product Name' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: 'Bad request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    try {
      const result = await this.productService.update(id, updateProductDto);
      return this.responseHandler.successResponseWithData(res, messages.UPDATE_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a product integration' })
  @ApiOkResponse({
    description: 'Product deleted successfully',
    example: {
      statusCode: 200,
      message: 'Resource deleted successfully',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.productService.remove(id);
      return this.responseHandler.successResponse(res, messages.DELETE_SUCCESS);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
