import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configs } from './config';
import { PokemonsModule } from './pokemons/pokemons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    PokemonsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
