import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { HttpResponseWrapper } from '../common/dto/http-response-wrapper.js';
import { NationalizeService } from './nationalize.service.js';
import { NationalizePredictionDto } from './dto/nationalize-prediction.dto.js';

@ApiTags('Nationalize')
@ApiExtraModels(HttpResponseWrapper, NationalizePredictionDto)
@Controller('nationalize')
export class NationalizeController {
  constructor(private readonly nationalizeService: NationalizeService) {}

  @Get()
  @ApiOperation({ summary: 'Mengambil data Nationalize dari API eksternal' })
  @ApiQuery({ name: 'name', required: true, type: String, example: 'budi', description: 'Nama yang ingin dicari.' })
  @ApiBadRequestResponse({ description: 'Query name wajib diisi dengan satu nama yang tidak kosong.' })
  @ApiOkResponse({
    description: 'Data beserta nama negara dan persentase probabilitas berhasil diambil.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponseWrapper) },
        { properties: { data: { $ref: getSchemaPath(NationalizePredictionDto) } } },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Gagal mengambil data dari API eksternal.' })
  getAll(@Query('name') name: string) {
    return this.nationalizeService.getAll(name);
  }
}
