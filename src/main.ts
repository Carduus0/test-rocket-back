import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Добавить middleware для обработки CORS
  app.use(cors());

  const target = 'https://scarduus.amocrm.ru/leads';
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/api`]: '',
    },
  };
  app.use('/api', createProxyMiddleware(proxyOptions));
  // app.use((req, res, next) =&gt; {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   next();
  // });
  // порт process.env.SERVER_PORT || 3001;
  const port = '3000';
  await app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
  });
}
bootstrap();
