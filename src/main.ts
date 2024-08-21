import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './utils/response.interceptor'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalInterceptors(new ResponseInterceptor())

    // cors 열어줄곳
    app.enableCors({
        origin: 'http://localhost:8619',
        methods: 'GET,POST',
        credentials: true, //자격 증명(예: 쿠키, 인증 헤더 또는 TLS 클라이언트 인증서)을 포함하는 설정
    })

    const config = new DocumentBuilder()
        .setTitle('Ting')
        .setDescription('API 명세서 입니다')
        .setVersion('1.0')
        .addTag('admin')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(7312)
}

bootstrap().catch((err) => {
    console.error('An error occurred during the bootstrap process:', err)
})
