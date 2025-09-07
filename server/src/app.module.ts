import { AuthModule } from '@core/auth/auth.module';
import { JwtGuard } from '@core/auth/guards/jwt.guard';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { UsersModule } from '@modules/users/users.module';
import { WalletsModule } from '@modules/wallets/wallets.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillPaymentsModule } from './modules/bill-payments/bill-payments.module';
import { ServiceProvidersModule } from './modules/service-providers/service-providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}.local`],
      expandVariables: true,
    }),
    AuthModule,
    UsersModule,
    WalletsModule,
    TransactionsModule,
    BillPaymentsModule,
    ServiceProvidersModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
