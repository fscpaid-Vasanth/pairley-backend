import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

class VerifyBusinessDto {
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
}

class ModerateOfferDto {
  @IsString()
  @IsNotEmpty()
  status: 'ACTIVE' | 'REJECTED' | 'CLOSED' | 'DRAFT' | 'PENDING_APPROVAL';
}

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ==========================================
  // BUSINESS PORTAL ENDPOINTS
  // ==========================================
  @Get('business/dashboard')
  @Roles(Role.BUSINESS)
  async getBusinessDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getBusinessMetrics(user.sub);
  }

  // ==========================================
  // ADMIN PORTAL ENDPOINTS
  // ==========================================
  @Get('admin/dashboard')
  @Roles(Role.ADMIN)
  async getAdminDashboard() {
    return this.dashboardService.getAdminMetrics();
  }

  @Get('admin/businesses')
  @Roles(Role.ADMIN)
  async getBusinesses(@Query('status') status?: string) {
    return this.dashboardService.listBusinesses(status);
  }

  @Put('admin/business/verify/:id')
  @Roles(Role.ADMIN)
  async verifyBusiness(@Param('id') id: string, @Body() body: VerifyBusinessDto) {
    return this.dashboardService.verifyBusiness(id, body.status);
  }

  @Get('admin/customers')
  @Roles(Role.ADMIN)
  async getCustomers() {
    return this.dashboardService.listCustomers();
  }

  @Put('admin/offers/moderate/:id')
  @Roles(Role.ADMIN)
  async moderateOffer(@Param('id') id: string, @Body() body: ModerateOfferDto) {
    return this.dashboardService.moderateOffer(id, body.status);
  }

  @Get('admin/subscriptions')
  @Roles(Role.ADMIN)
  async getSubscriptions() {
    return this.dashboardService.listSubscriptions();
  }

  @Get('admin/tickets')
  @Roles(Role.ADMIN)
  async getSupportTickets(@Query('status') status?: string) {
    return this.dashboardService.listSupportTickets(status);
  }

  @Get('admin/categories')
  @Roles(Role.ADMIN)
  async getCategories() {
    return this.dashboardService.getCategories();
  }
}
