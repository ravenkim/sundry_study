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

    //회원가입
    async createUser() {
        // 로그인아이디, 비밀번호, 이름, 생일,

    }

    // 여러개로 나눌지 논의 필요 >> 항목별
    async updateUser() {

    }


    async deleteUser() {
        // 탈퇴된 사용자로 면동

    }


}