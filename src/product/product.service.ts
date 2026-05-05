import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .insert(createProductDto)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.CREATE_SUCCESS, data };
  }

  async findAllByTrend(trendId: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('trend_id', trendId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }

  async findOne(id: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: error?.message || messages.NOT_FOUND,
      };
    }

    return { success: true, message: messages.FETCH_SUCCESS, data };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.UPDATE_SUCCESS, data };
  }

  async remove(id: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();

    const { error } = await client.from('products').delete().eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.DELETE_SUCCESS };
  }
}
