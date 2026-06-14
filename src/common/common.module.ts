import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpService } from './services/otp.service';
import { StorageService } from './services/storage.service';
import { PaymentService } from './services/payment.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    OtpService,
    StorageService,
    PaymentService,
    NotificationService,
  ],
  exports: [
    OtpService,
    StorageService,
    PaymentService,
    NotificationService,
  ],
})
export class CommonModule {}
