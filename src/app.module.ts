import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NationalizeModule } from './nationalize/nationalize.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();
export const observeEnabled = Boolean(
  process.env.OBSERVE_APP_KEY && process.env.OBSERVE_APP_SECRET,
);

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ...(observeEnabled ? [ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: process.env.OBSERVE_SERVICE_ID ?? 'be-test-javan',
    })] : []),
    NationalizeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
