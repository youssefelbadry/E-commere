export interface ICreateCoupon {
  code?: string;
  discountPercent: number;
  maxUses: number;
  usedCount?: number;
  isActive?: boolean;
  expiresAt: Date;
}