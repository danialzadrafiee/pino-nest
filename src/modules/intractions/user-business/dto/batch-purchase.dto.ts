import { IsNumber, Min } from 'class-validator';

export class BatchPurchaseDto {
  @IsNumber()
  businessId: number;
  @IsNumber()
  @Min(1)
  purchaseAmount: number;
  @IsNumber()
  totalCost: number;
}