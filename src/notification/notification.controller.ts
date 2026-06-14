import { Controller, Get, Put, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { NotificationModuleService } from './notification.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsOptional, IsString } from 'class-validator';

class ReadNotificationDto {
  @IsString()
  @IsOptional()
  id?: string;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationModuleService: NotificationModuleService) {}

  @Get()
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationModuleService.getUserNotifications(user.sub);
  }

  @Put('read')
  async markAsRead(@CurrentUser() user: any, @Body() body: ReadNotificationDto) {
    return this.notificationModuleService.markAsRead(user.sub, body.id);
  }

  @Delete('delete')
  async deleteNotification(@CurrentUser() user: any, @Query('id') id: string) {
    return this.notificationModuleService.deleteNotification(user.sub, id);
  }
}
