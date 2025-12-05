import 'reflect-metadata';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppModule', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should import AuthModule, UsersModule and PokemonsModule', () => {
    const imports = Reflect.getMetadata('imports', AppModule) || [];
    expect(imports).toEqual(
      expect.arrayContaining([AuthModule, UsersModule, PokemonsModule]),
    );
  });

  it('should register AppController and AppService', () => {
    const controllers = Reflect.getMetadata('controllers', AppModule) || [];
    const providers = Reflect.getMetadata('providers', AppModule) || [];

    expect(controllers).toEqual(expect.arrayContaining([AppController]));
    expect(providers).toEqual(expect.arrayContaining([AppService]));
  });
});
