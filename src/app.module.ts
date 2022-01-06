import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ThreadsModule } from './threads/threads.module';
import { SectionModule } from './section/section.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        cors: {
          origin: configService.get('CLIENT_HOST'),
          credentials: true,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DB_URL'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB'),
        autoLoadEntities: configService.get('DB_AUTOLOADENTITIES'),
        //synchronize: configService.get('DB_SYNCHRONIZE'), // disable on production
      }),
    }),
    UsersModule,
    CategoriesModule,
    ThreadsModule,
    SectionModule,
    PostsModule,
  ],
})
export class AppModule {}
