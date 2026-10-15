import { Module } from '@nestjs/common';
import { NationalizeController } from './nationalize.controller.js';
import { NationalizeService } from './nationalize.service.js';

@Module({
  controllers: [NationalizeController],
  providers: [NationalizeService]
})
export class NationalizeModule {}
