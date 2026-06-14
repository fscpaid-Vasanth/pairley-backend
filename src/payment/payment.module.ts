import { Module } from '@nestjs/common';
import { PaymentModuleService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentController],
  providers: [PaymentModuleService],
  exports: [PaymentModuleService],
})
export class PaymentModule {}
