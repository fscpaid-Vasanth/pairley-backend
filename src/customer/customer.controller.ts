import { Controller, Get, Put, Post, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

class SaveOfferDto {
  @IsString()
  @IsNotEmpty()
  offerId: string;
}

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.customerService.getProfile(user.sub);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.customerService.updateProfile(user.sub, body);
  }

  @Get('history')
  async getHistory(@CurrentUser() user: any) {
    return this.customerService.getHistory(user.sub);
  }

  @Get('saved-offers')
  async getSavedOffers(@CurrentUser() user: any) {
    return this.customerService.getSavedOffers(user.sub);
  }

  @Post('save-offer')
  async saveOffer(@CurrentUser() user: any, @Body() body: SaveOfferDto) {
    return this.customerService.saveOffer(user.sub, body.offerId);
  }

  @Delete('save-offer')
  async unsaveOffer(@CurrentUser() user: any, @Query('offerId') offerId: string) {
    return this.customerService.unsaveOffer(user.sub, offerId);
  }
}
