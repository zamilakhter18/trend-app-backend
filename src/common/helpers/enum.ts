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
