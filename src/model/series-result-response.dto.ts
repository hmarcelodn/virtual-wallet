export interface SeriesResultResponseDto {
  payments_received: Array<number>;
  payments_made: Array<number>;
  withdrawn: Array<number>;
  filled: Array<number>;
  dates: Array<string>;
}
