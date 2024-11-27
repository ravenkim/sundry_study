import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './utils/response.interceptor'
import { AllExceptionsFilter } from './utils/exceptions.filter'
import { ValidationPipe } from '@nestjs/common'
import { validationExceptionFactory } from './utils/exceptions/validation-exception.factory'
import * as cookieParser from 'cookie-parser'
import { Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // at 가 없으면 반사
    const reflector = app.get(Reflector)
    app.useGlobalGuards(new JwtAuthGuard(reflector))

    app.use(cookieParser())


    // 에러 발생시 가로챔
    app.useGlobalFilters(new AllExceptionsFilter())


    //형식 검증
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: validationExceptionFactory,
        }),
    )


    //성공시 원하는 형식으로 데이터를 만들어줌
    app.useGlobalInterceptors(new ResponseInterceptor())

    // cors 열어줄곳
    app.enableCors({
        origin: ['http://localhost:8619', 'http://localhost:8620'],
        methods: ['GET', 'POST'],
        credentials: true, //자격 증명(예: 쿠키, 인증 헤더 또는 TLS 클라이언트 인증서)을 포함하는 설정
    })

    const config = new DocumentBuilder()
        .setTitle('Ting')
        .setDescription('API 명세서 입니다')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    //포트번호
    await app.listen(7312, () => {
        //yarn dev 시에만 로그
        if (process.env.NODE_ENV === 'development') {
            console.log('➜  Local:   http://localhost:7312/api')
        }
    })
}

bootstrap().catch((err) => {
    console.error('An error occurred during the bootstrap process:', err)
})
