import { Module } from '@nestjs/common';
import { SampleController } from './sample.controller';

@Module({
  providers: [SampleController],
})
export class SampleModule {}
