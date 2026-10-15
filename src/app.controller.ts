import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Menampilkan pesan sambutan API' })
  @ApiOkResponse({ description: 'API aktif.', type: String, example: 'Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
