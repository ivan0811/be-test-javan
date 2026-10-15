import { ApiProperty } from '@nestjs/swagger';

export class NationalizeCountryDto {
  @ApiProperty({ type: String, example: 'ID' })
  country_id: string;

  @ApiProperty({ type: Number, example: 0.859415 })
  probability: number;

  @ApiProperty({ type: String, example: 'Indonesia' })
  country_name: string;

  @ApiProperty({ type: Number, example: 85.94 })
  probability_percent: number;
}

export class NationalizePredictionDto {
  @ApiProperty({ type: Number, example: 25095 })
  count: number;

  @ApiProperty({ type: String, example: 'budi' })
  name: string;

  @ApiProperty({ type: [NationalizeCountryDto] })
  country: NationalizeCountryDto[];
}
