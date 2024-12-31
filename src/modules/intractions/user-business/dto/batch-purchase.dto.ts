import { IsNumber, Min } from 'class-validator';

export class BatchPurchaseDto {
  @IsNumber()
  business_id: number;
  @IsNumber()
  @Min(1)
  purchase_amount: number;
  @IsNumber()
  total_cost: number;
}