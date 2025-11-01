import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectorService {
  getHello(): string {
    return 'Hello from Connector Service!';
  }
}
