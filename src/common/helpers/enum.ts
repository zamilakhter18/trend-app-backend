/**
 * Centralized enum definitions for the application.
 */

export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
  CREATOR = "creator",
  BRAND = "brand",
}

export enum BadgeTypeEnum {
  EARLY_SPOTTER = "EARLY_SPOTTER",
  STREETWEAR_EXPERT = "STREETWEAR_EXPERT",
  LUXURY_CURATOR = "LUXURY_CURATOR",
  TREND_HUNTER = "TREND_HUNTER",
}

export enum TrendPhaseEnum {
  EMERGING = "emerging",
  RISING = "rising",
  PEAK = "peak",
  FADING = "fading",
}

export enum ScoreReasonEnum {
  EARLY_DISCOVERY = "EARLY_DISCOVERY",
  SAVE_BONUS = "SAVE_BONUS",
  SHARE_BONUS = "SHARE_BONUS",
  TREND_SPOTTED = "TREND_SPOTTED",
  ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
}

export enum ScoreSourceTypeEnum {
  TREND = "TREND",
  PRODUCT = "PRODUCT",
  SYSTEM = "SYSTEM",
}

export enum SignalTypeEnum {
  VELOCITY = "velocity",
  SAVES = "saves",
  GROWTH = "growth",
  MOMENTUM = "momentum",
}

export enum RewardTypeEnum {
  POINTS = "POINTS",
  BADGE = "BADGE",
  PERK = "PERK",
}

export enum PlatformEnum {
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
  X = "x",
  PINTEREST = "pinterest",
  OTHER = "other",
}

export enum StorageBucketEnum {
  TREND_MEDIA = "trend-media",
  PROFILE_IMAGES = "profile-images",
  PRODUCT_MEDIA = "product-media",
}

export enum ClickSourceType {
  ORGANIC_FEED = "ORGANIC_FEED",
  SPONSORED_FEED = "SPONSORED_FEED",
  CREATOR_PROFILE = "CREATOR_PROFILE",
  SEARCH = "SEARCH",
  RECOMMENDED = "RECOMMENDED",
}

export enum InteractionTypeEnum {
  VIEW = "VIEW",
  SAVE = "SAVE",
  CLICK = "CLICK",
  SHARE = "SHARE",
}

export enum InteractionSourceTypeEnum {
  FEED = "FEED",
  ORGANIC_FEED = "ORGANIC_FEED",
  SPONSORED_FEED = "SPONSORED_FEED",
  SEARCH = "SEARCH",
  DISCOVERY = "DISCOVERY",
  PROFILE = "PROFILE",
  CREATOR_PROFILE = "CREATOR_PROFILE",
  TREND_DETAIL = "TREND_DETAIL",
  RECOMMENDED = "RECOMMENDED",
  SYSTEM = "SYSTEM",
}

export enum TrendStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  FLAGGED = "FLAGGED",
}

export enum TrendContentTypeEnum {
  ORGANIC = "ORGANIC",
  SPONSORED = "SPONSORED",
}

export enum TrendContentMediaTypeEnum {
  VIDEO = "video",
  IMAGE = "image",
  LINK = "link",
}

export enum CreatorCampaignStatusEnum {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
