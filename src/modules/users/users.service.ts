import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import { CreateAccountRequestDto } from './dto/createAccount.dto'
import * as bcrypt from 'bcrypt'
import { checkEmailDuplicate } from './exceptions/duplicate-email.exception'

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

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
    async getUser() {
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
        const { userLoginId, userEmail, userPassword } = request

        //이메일 중복 확인
        await checkEmailDuplicate(userEmail, this.databaseService)

        const hashedPassword = await bcrypt.hash(userPassword, 10)

        const result = await this.databaseService.query(
            'src/modules/users/sql/create_account.sql',
            [userLoginId, hashedPassword, userEmail, 'normal'],
        )
        console.log(result)
        return result
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
