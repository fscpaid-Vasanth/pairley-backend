import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupportStatus } from '@prisma/client';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, data: { subject: string; description: string }) {
    return this.prisma.supportTicket.create({
      data: {
        user_id: userId,
        subject: data.subject,
        description: data.description,
        status: SupportStatus.OPEN,
      },
    });
  }

  async getTickets(userId: string, role: string) {
    if (role === 'Admin') {
      return this.prisma.supportTicket.findMany({
        orderBy: { created_at: 'desc' },
      });
    }

    return this.prisma.supportTicket.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateTicketStatus(userId: string, role: string, ticketId: string, status: string, replyMessage?: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    // Non-admins can only modify their own tickets
    if (role !== 'Admin' && ticket.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to modify this ticket');
    }

    const updatedData: any = {
      status: status as SupportStatus,
    };

    if (replyMessage) {
      // In a real application, we would have a ticket_replies table.
      // For this spec schema, we append the reply directly to the description or update it.
      // Let's append the reply message to the description to store it within the existing schema.
      updatedData.description = `${ticket.description}\n\n[Reply from ${role} at ${new Date().toLocaleString()}]: ${replyMessage}`;
    }

    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: updatedData,
    });
  }
}
