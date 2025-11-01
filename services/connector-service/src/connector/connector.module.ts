import { Module } from '@nestjs/common';
import { ConnectorController } from './connector.controller';
import { ConnectorService } from './connector.service';

@Module({
  controllers: [ConnectorController],
  providers: [ConnectorService],
})
export class ConnectorModule {}
