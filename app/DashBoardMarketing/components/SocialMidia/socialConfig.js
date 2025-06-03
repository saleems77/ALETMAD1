// config/socialConfig.js
export const SOCIAL_PLATFORMS = {
  facebook: {
    apiVersion: "v18.0",
    scopes: ["pages_manage_posts", "pages_read_engagement"],
  },
  tiktok: {
    apiVersion: "v2",
    scopes: ["video.upload"],
  },
  instagram: {
    apiVersion: "v18.0",
    scopes: ["instagram_content_publish"],
  },
};

export const AI_CONFIG = {
  contentGeneration: {
    model: "gpt-4",
    maxLength: 500,
    creativity: 0.7,
  },
  analytics: {
    predictionModel: "prophet",
    realTimeUpdate: true,
  },
};
