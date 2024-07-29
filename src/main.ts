import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

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
