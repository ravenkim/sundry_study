import { BadRequestException, Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            //todo smtp 메일서버 제한 없는거로 변경
            service: 'gmail',
            auth: {
                user: 'tingdevteam@gmail.com', // 발송자 이메일
                pass: process.env.EMAIL_SMTP_PASSWORD,
            },
        })
    }

    async sendMail(to: string, subject: string, text: string) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Ting" <tingdevteam@gmail.com>', // 발송자 정보
                to, // 수신자
                subject, // 이메일 제목
                text, // 이메일 내용
                // todo 랜덤 문자열 생성 이메일 보내는 형식 만들기
                // html: "<b>Hello world?</b>" // HTML 내용이 필요하면 추가
            })
            return info.messageId
        } catch (error) {
            console.error('Error sending email', error)
            throw new BadRequestException(error)
        }
    }
}
