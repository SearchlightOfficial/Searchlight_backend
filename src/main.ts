import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";

function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("SearchLight REST API Gateway")
    .setDescription("SearchLight project REST API description")
    .setVersion("1.0")
    .addTag("REST")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>("FRONTEND_URL"),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization, Accept",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: config.get<string>("NODE_ENV") !== "development",
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new IoAdapter(app));

  if (config.get<string>("NODE_ENV") === "development") {
    swagger(app);
  }

  await app.listen(config.get<number>("PORT") || 3000);

  Logger.log(
    `Server running on ${config.get<string>("NODE_ENV")} mode`,
    "Bootstrap",
  );
  Logger.log(
    `Server running on http://localhost:${config.get<number>("PORT")}`,
    "Bootstrap",
  );
}
bootstrap();
