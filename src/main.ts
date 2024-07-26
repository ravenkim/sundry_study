import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(7312)
}

bootstrap().catch((err) => {
    console.error('An error occurred during the bootstrap process:', err)
})
