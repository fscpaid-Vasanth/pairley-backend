import { Controller, Post, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class ReplyTicketDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  replyMessage?: string;
}

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('create-ticket')
  async createTicket(@CurrentUser() user: any, @Body() body: CreateTicketDto) {
    return this.supportService.createTicket(user.sub, body);
  }

  @Get('tickets')
  async getTickets(@CurrentUser() user: any) {
    return this.supportService.getTickets(user.sub, user.role);
  }

  @Put('reply')
  async updateTicket(@CurrentUser() user: any, @Body() body: ReplyTicketDto) {
    return this.supportService.updateTicketStatus(user.sub, user.role, body.ticketId, body.status, body.replyMessage);
  }
}
