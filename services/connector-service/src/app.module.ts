import { Module } from '@nestjs/common';
import { ConnectorController } from './connector/connector.controller';
import { ConnectorService } from './connector/connector.service';
import { ConnectorModule } from './connector/connector.module';

@Module({
  imports: [ConnectorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
