import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'

@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) {
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


    // 전화번호 인증
    async generateRandomPhoneVerificationCode() {
        // 1. 전화번호 받음
        // 2. 전화번호에 해당하는 랜덤 6자리 생성후 디비에 저장
        // 3. 랜덤 코드 전송

    }



    //회원가입
    async createUser() {


      //  1. 전화번호 인증 테이블에 코드 값과 일치하는지 확인



      /*
      * 1. 약관 동의 처리
      * 2. 비밀번호 암호화
      * 3. 아이디, 암호화된 비번, 이름, 전화번호, 전화번호 인증 번호
      *
      *
      *
      *
      * */




    }





    // 여러개로 나눌지 논의 필요 >> 항목별
    async updateUser() {

    }


    async deleteUser() {
        // 탈퇴된 사용자로 면동

    }


}