/**
 * Centralized enum definitions for the application.
 */

export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
  CREATOR = "creator",
}

export enum BadgeTypeEnum {
  EARLY_SPOTTER = "EARLY_SPOTTER",
  STREETWEAR_EXPERT = "STREETWEAR_EXPERT",
  LUXURY_CURATOR = "LUXURY_CURATOR",
  TREND_HUNTER = "TREND_HUNTER",
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
