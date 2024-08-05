import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'

@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) {
    }

    async getUser() {
    }

    async getUserDetail() {

    }

    async createUser() {

    }

    async updateUser() {

    }


    async deleteUser() {
        // 탈퇴된 사용자로 면동

    }


}