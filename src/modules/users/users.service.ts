import { BadRequestException, Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import { CreateAccountRequestDto } from './dto/createAccount.dto'
import * as bcrypt from 'bcrypt'
import { getUserInfoRequestDto } from './dto/user.dto'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private prisma: PrismaService,
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

    //
    /* todo

    1. id 중복 체크
    
    
    
    


    2. id 와 비밀번호를 저장
    -id 중복체크
    -비밀번호 해쉬화
    저장


    본인인증
    3. 이름, 이메일, 이메일 광고 수신여부, 생년월일 , 전화번호 입력받음



     */

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

    // 계정 만들기
    async createAccount(request: CreateAccountRequestDto) {
        const { loginId, email, password } = request

        //중복 여부 확인
        //ttt 아래의 두개의 검증은 디비를 두번 탑니다. 한번에 타게끔 하는 함수를 따로 만들어야 할까요?
        await this.checkLoginIdDuplicate(loginId)
        await this.checkEmailDuplicate(email)

        // 아이디 생성
        // const hashedPassword = await bcrypt.hash(userPassword, 10)
        //
        // const result = await this.databaseService.query(
        //     'src/modules/users/sql/create_account.sql',
        //     [userLoginId, hashedPassword, userEmail, 'normal'],
        // )

        return '성공적으로 만들어짐'
    }

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
}
