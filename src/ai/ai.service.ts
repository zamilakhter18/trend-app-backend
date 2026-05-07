import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SupabaseService } from "../supabase/supabase.service";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";
import { AiAnalysis } from "../db/entities/AiAnalysis.entity";
import { AnalyzeTrendDto } from "./dto/analyze-trend.dto";
import { ClassifyImageDto } from "./dto/classify-image.dto";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
    @InjectRepository(AiAnalysis)
    private aiAnalysisRepository: Repository<AiAnalysis>,
  ) {}

  /**
   * Existing method to fetch trend explanation from DB
   */
  async getTrendExplanation(trendId: string): Promise<ServiceResponse> {
    try {
      const analysis = await this.aiAnalysisRepository.findOne({
        where: { trendId },
      });

      if (!analysis) {
        return {
          success: false,
          message: messages.NOT_FOUND,
        };
      }

      return {
        success: true,
        message: messages.FETCH_SUCCESS,
        data: analysis,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Analyzes trend content using an LLM (Placeholder for OpenAI/Gemini/Claude)
   */
  async analyzeTrend(dto: AnalyzeTrendDto): Promise<ServiceResponse> {
    const { trend_id, content } = dto;
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");

    this.logger.log(`Analyzing trend ${trend_id} with LLM...`);

    // Placeholder for LLM API call
    const llmResult = {
      summary: "This trend highlights the growing intersection of AI and sustainable fashion.",
      tags: ["AI", "Sustainability", "Fashion Tech"],
      sentiment: "positive",
      category: "Tech/Lifestyle",
      provider: "openai-gpt-4",
    };

    try {
      // Upsert into ai_analysis table
      const analysis = this.aiAnalysisRepository.create({
        trendId: trend_id,
        refinedSummary: llmResult.summary,
        keywords: llmResult.tags,
        rawAnalysis: {
          sentiment: llmResult.sentiment,
          category: llmResult.category,
          provider: llmResult.provider,
          raw_content: content,
        },
      });

      await this.aiAnalysisRepository.save(analysis);

      return {
        success: true,
        message: messages.CREATE_SUCCESS,
        data: llmResult,
      };
    } catch (error) {
      return {
        success: false,
        message: `DB Error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Classifies an image using a Vision API (Placeholder)
   */
  async classifyImage(dto: ClassifyImageDto): Promise<ServiceResponse> {
    const { image_url } = dto;
    const visionKey = this.configService.get<string>("VISION_API_KEY");

    this.logger.log(`Classifying image at ${image_url}...`);

    // Placeholder for Vision API call result
    const visionResult = {
      labels: ["apparel", "sneakers", "urban", "blue"],
      category: "fashion",
      aesthetic: "minimalist",
      isSafe: true,
      provider: "google-vision-ai",
    };

    return {
      success: true,
      message: "Image classification complete",
      data: visionResult,
    };
  }
}
