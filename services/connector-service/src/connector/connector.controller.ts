import { Controller, Get } from '@nestjs/common';
import { ConnectorService } from './connector.service';

@Controller('connector')
export class ConnectorController {
  constructor(private readonly connectorService: ConnectorService) {}

  @Get()
  getHello(): string {
    return this.connectorService.getHello();
  }
}
