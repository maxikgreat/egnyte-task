import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckboxGateway } from './checkbox.gateway';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, CheckboxGateway],
})
export class AppModule {}
