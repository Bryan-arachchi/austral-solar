import { forwardRef, Module } from '@nestjs/common';
import { PayhereService } from './payhere.service';
import { PayhereController } from './payhere.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { EmailModule } from 'src/email/email.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => OrdersModule), EmailModule, ProductsModule],
  controllers: [PayhereController],
  providers: [PayhereService],
  exports: [PayhereService],
})
export class PayhereModule {}
