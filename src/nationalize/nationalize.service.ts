import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppBadRequestException, AppInternalServerErrorException, AppNotFoundException } from '../common/exceptions/custom-http-exceptions.js';
import { ErrorCode } from '../common/constants/error-codes.js';
import { HttpResponseWrapper } from '../common/dto/http-response-wrapper.js';
import type { NationalizePredictionDto } from './dto/nationalize-prediction.dto.js';

interface CountryCodeData {
  accepted_countries: { code: string; name: string }[];
  restricted_countries: { code: string; name: string }[];
}

interface NationalizeApiPrediction {
  count: number;
  name: string;
  country: { country_id: string; probability: number }[];
}

const countryCodeData = JSON.parse(
  readFileSync(
    process.env.VERCEL
      ? join(process.cwd(), 'data/ssl_country_codes.json')
      : new URL('../../data/ssl_country_codes.json', import.meta.url),
    'utf8',
  ),
) as CountryCodeData;
const countryNames = new Map(
  [...countryCodeData.accepted_countries, ...countryCodeData.restricted_countries]
    .map(({ code, name }) => [code, code === 'US' ? 'Amerika Serikat' : name]),
);

@Injectable()
export class NationalizeService {
    private readonly logger = new Logger(NationalizeService.name);

  async getAll(name: string): Promise<HttpResponseWrapper<NationalizePredictionDto>> {
    if (typeof name !== 'string' || !name.trim()) {
      throw new AppBadRequestException('Query name wajib diisi dengan satu nama yang tidak kosong.');
    }

    try {
      const params = new URLSearchParams({ name: name.trim() });
      const getNationalizeApi = await fetch(`https://api.nationalize.io/?${params.toString()}`);
      if (!getNationalizeApi.ok) {
        throw new Error(`Nationalize API returned HTTP ${getNationalizeApi.status}`);
      }
      const prediction = await getNationalizeApi.json() as NationalizeApiPrediction;
      const enrichedPrediction: NationalizePredictionDto = {
        ...prediction,
        country: prediction.country.map((country) => ({
          ...country,
          country_name: countryNames.get(country.country_id) ?? country.country_id,
          probability_percent: Number((country.probability * 100).toFixed(2)),
        })),
      };

      return new HttpResponseWrapper({
        data: enrichedPrediction,
        message: 'Get Nationalize Successfully',
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof AppNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed get list nationalize successfully: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new AppInternalServerErrorException(
        'Failed get list nationalize successfully',
        ErrorCode.NATIONALIZE_API_FETCH_FAILED,
      );
    }
  }
}
