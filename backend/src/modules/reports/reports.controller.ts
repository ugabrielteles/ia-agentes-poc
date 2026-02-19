import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.reportsService.getDashboardSummary(req.user.sub);
  }

  @Get('monthly')
  getMonthlySummary(@Request() req, @Query('year') year?: string) {
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    return this.reportsService.getMonthlySummary(req.user.sub, currentYear);
  }

  @Get('by-category')
  getCategoryReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getCategoryReport(req.user.sub, startDate, endDate);
  }
}
