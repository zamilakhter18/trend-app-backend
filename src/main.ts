import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { ExecutionTimeInterceptor } from "./common/interceptors/execution-time.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Interceptors: Execution Time Logging
  app.useGlobalInterceptors(new ExecutionTimeInterceptor());

  // Security: Helmet
  app.use(helmet());

  // Security: CORS
  app.enableCors();

  // Validation: Global Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger: API Documentation
  const config = new DocumentBuilder()
    .setTitle("Trend App API")
    .setDescription("The Trend App Backend API documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Hides the Schemas section completely
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
