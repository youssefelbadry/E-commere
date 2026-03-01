export interface ICoupon {
  code?: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt: Date;
  usageCount: number;
  maxUsage: number;
}
