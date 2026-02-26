import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RechargeController } from './infrastructure/controllers/recharge.controller';
import { BuyRechargeUseCase } from './application/use-cases/buy-recharge.use-case';
import { TransactionModel } from './infrastructure/persistence/models/transaction.model';
import { RechargeOrmRepository } from './infrastructure/persistence/repositories/recharge-orm.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserInMemoryRepository } from './infrastructure/persistence/repositories/user-in-memory.repository';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { GetRechargeHistoryUseCase } from './application/use-cases/get-recharge-history.use-case';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [TransactionModel],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') ?? 'localhost',
          port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
          username: configService.get<string>('DB_USER') ?? 'postgres',
          password: configService.get<string>('DB_PASSWORD') ?? 'root',
          database: configService.get<string>('DB_NAME') ?? 'recharges_db',
          entities: [TransactionModel],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([TransactionModel])
  ],
  controllers: [AppController, RechargeController, AuthController],
  providers: [
    AppService, 
    BuyRechargeUseCase,
    GetRechargeHistoryUseCase, 
    {
      provide: 'IRechargeRepository',
      useClass: RechargeOrmRepository,
    },
    LoginUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
