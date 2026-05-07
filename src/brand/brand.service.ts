import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../db/entities/Brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto): Promise<ServiceResponse> {
    try {
      const existing = await this.brandRepository.findOne({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException('Brand with this name already exists');
      }

      const brand = this.brandRepository.create({
        name: dto.name,
        verified: dto.verified,
        billingMetadata: dto.billing_metadata,
        websiteUrl: dto.website_url,
        logoUrl: dto.logo_url,
        ownerId: dto.owner_id,
      });
      const saved = await this.brandRepository.save(brand);

      return {
        success: true,
        message: messages.CREATE_SUCCESS,
        data: saved,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async findAll(): Promise<ServiceResponse> {
    try {
      const brands = await this.brandRepository.find({ relations: ['owner'] });
      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: brands,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async findOne(id: string): Promise<ServiceResponse> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id },
        relations: ['owner', 'sponsoredContents'],
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: brand,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async update(id: string, dto: UpdateBrandDto): Promise<ServiceResponse> {
    try {
      const brand = await this.brandRepository.findOne({ where: { id } });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      if (dto.name) brand.name = dto.name;
      if (dto.verified !== undefined) brand.verified = dto.verified;
      if (dto.billing_metadata) brand.billingMetadata = dto.billing_metadata;
      if (dto.website_url) brand.websiteUrl = dto.website_url;
      if (dto.logo_url) brand.logoUrl = dto.logo_url;
      if (dto.owner_id) brand.ownerId = dto.owner_id;

      const updated = await this.brandRepository.save(brand);

      return {
        success: true,
        message: messages.UPDATE_SUCCESS,
        data: updated,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async remove(id: string): Promise<ServiceResponse> {
    try {
      const result = await this.brandRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Brand not found');
      }
      return {
        success: true,
        message: messages.DELETE_SUCCESS,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
