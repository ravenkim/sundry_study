import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAccountRequestDto } from './dto/createAccount.dto'
import * as bcrypt from 'bcrypt'
import { getUserInfoRequestDto } from './dto/user.dto'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from '../email/email.service'

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {}

    // 중복 로그인 아이디 체크
    async checkLoginIdDuplicate(userId: string) {
        const userExists = await this.prisma.user.findUnique({
            where: {
                login_id: userId,
            },
        })
        if (userExists) {
            throw new BadRequestException('중복된 아이디 입니다.')
        }
    }

    // 중복 이메일 체크
    async checkEmailDuplicate(email: string) {
        const is_duplicate = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (is_duplicate) {
            throw new BadRequestException('중복된 이메일입니다.')
        }
    }

    // 비밀번호 형식이 올바른지 확인
    //ttt 이러면 어찌됬는 비밀번호가 서버측에서 남는거 아닌가? 프런트 에서 부터 암호화 해서 들고 와야 하는지 그렇다면 어찌 비밀번호 형식을 검증하는지
    async checkValidPassword(password: string) {
        const minLength = 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        if (
            password.length < minLength ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasNumber ||
            !hasSpecialChar
        ) {
            throw new BadRequestException('잘못된 비번입니다.')
        }
    }

    //
    /* todo
    본인인증
    3. 이름, 이메일, 이메일 광고 수신여부, 생년월일 , 전화번호 입력받음
     */

    //}

    // 계정 만들기
    async createAccount(props: CreateAccountRequestDto) {
        const { loginId, email, password } = props

        //중복 여부 확인
        //ttt 아래의 두개의 검증은 디비를 두번 탑니다. 한번에 타게끔 하는 함수를 따로 만들어야 할까요?
        //ttt 아래의 두개의 함수는 컨트롤로 옴기는게 맞나요?
        await this.checkLoginIdDuplicate(loginId)
        await this.checkEmailDuplicate(email)

        // 아이디 생성
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.prisma.user.create({
            data: {
                login_id: loginId,
                email: email,
                password: hashedPassword,
            },
            //todo 만들어진 타입 노말 추가
        })

        console.log(newUser)
        // todo newUser.id 를 리턴해주고 나중에 id 업데이트

        return '성공적으로 만들어짐'
    }

    async cancelCreateUser() {
        // 본인인증 완료가 안된 아이디 로 가입하다가 나간경우 아이디 삭제
    }

    //로그인시 유저 정보 확인
    async getUser(request: getUserInfoRequestDto) {
        const { userId } = request

        // const userInfo = await this.databaseService.query(
        //     'src/modules/users/sql/get_user_info_by_id.sql',
        //     [userId],
        // )

        const userInfo = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!userInfo || Object.keys(userInfo).length === 0) {
            throw new BadRequestException('없는 유저 ID 입니다.')
        }

        return userInfo
        //들고올 유저정보 (프로필 처럼 보일 정보)
        //유저아이디, 유저 프로필, 유저 닉네임, 유저 권한, 유저 재화,
    }

    //유저 상세 정보 가져오기
    async getUserDetail() {
        //들고올 유저정보 (프로필 처럼 보일 정보)
        // getUser() 정보 + 기타 학교|| 회사 정보
    }

    //유저 인증

    // 전화번호 인증
    async generateRandomPhoneVerificationCode() {
        // 1. 전화번호 받음
        // 2. 전화번호에 해당하는 랜덤 6자리 생성후 디비에 저장
        // 3. 랜덤 코드 전송
    }

    //***************************************회원가입****************************************************//

    // 아이디 중복 확인

    async checkUserAuthentication() {
        //todo 전화번호 인증으로 변경 예정
        /** 전화번호 인증으로 받아올 값들 {
         //이름
         //성별
         //유저 생일
         //유저 국가
         //유저 전화번호
         **/
        // }
        // 본인인증여부 변경
        //현시간으로 회원가입 날짜
        // 유저 정보 들고옴
        //본인인증 안하고 나간경우 임시로 만들어둔 계정 삭제
    }

    //회원가입 최종 확정
    async createUser() {
        // 본인인증 되었으면 가입 확정
    }

    // 여러개로 나눌지 논의 필요 >> 항목별
    async updateUser() {}

    async deleteUser() {
        // 탈퇴된 사용자로 면동
    }

    async sendTestEmail() {
        await this.emailService.sendMail(
            'ravenkim97@naver.com',
            'Test Subject',
            'Test Email Body',
        )
        return '발송완료'
    }
}
