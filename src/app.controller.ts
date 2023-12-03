// app.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/get-leads')
  async getLeads(@Query('query') query?: string) {
    let leads = await this.apiService.getAmoCRMLeads();

    if (query && query.length >= 3) {
      leads = leads.filter((lead: { name: string }) =>
        lead.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return { leads };
  }
}
