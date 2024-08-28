import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DB_HOST"),
        port: parseInt(config.get<string>("DB_PORT") || "5432"),
        database: config.get<string>("DB_NAME"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrations: [],
        subscribers: [],
        synchronize: true,
        charset: "utf8_general_ci",
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
