import { Module } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

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
  ],
})
export class AppModule {}
