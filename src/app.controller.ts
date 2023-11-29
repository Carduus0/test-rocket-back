import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/leads')
  getLeads(): string {
    return this.appService.getLeads();
  }
}
