import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createProductDto: CreateProductDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .insert(createProductDto)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async findAllByTrend(trendId: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('trend_id', trendId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found');
    }

    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async remove(id: string) {
    const client = this.supabaseService.getClient();

    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }
}
