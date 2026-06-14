import { Controller, Get, Put, Post, Body, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BusinessService } from './business.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    // Map /business/register directly to the general registration handler with Business role
    return this.authService.register({ ...body, role: 'Business' });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.businessService.getProfile(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.businessService.updateProfile(user.sub, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Post('upload-documents')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'shop_photo', maxCount: 1 },
      { name: 'aadhaar', maxCount: 1 },
      { name: 'pan', maxCount: 1 },
      { name: 'gst', maxCount: 1 },
    ])
  )
  async uploadDocuments(
    @CurrentUser() user: any,
    @UploadedFiles()
    files: {
      shop_photo?: Express.Multer.File[];
      aadhaar?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      gst?: Express.Multer.File[];
    }
  ) {
    return this.businessService.uploadDocuments(user.sub, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Get('subscription')
  async getSubscription(@CurrentUser() user: any) {
    return this.businessService.getSubscription(user.sub);
  }
}
