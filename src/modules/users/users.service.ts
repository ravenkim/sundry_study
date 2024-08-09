import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'

@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) {
    }

    //로그인시 유저 정보 확인
    async getUser() {

    }

    //유저 상세 정보 가져오기
    async getUserDetail() {

    }

    //회원가입
    async createUser() {

    }

    // 여러개로 나눌지 논의 필요 >> 항목별
    async updateUser() {

    }


    async deleteUser() {
        // 탈퇴된 사용자로 면동

    }


}