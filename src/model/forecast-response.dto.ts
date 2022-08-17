export interface ForecastResponseDto {
  payment_received?: Array<number>;
  payment_made?: Array<number>;
  payment_fill?: Array<number>;
  payment_withdraw?: Array<number>;
  dates?: Array<string>;
}
