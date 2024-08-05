import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'

@Injectable()
export class AuthService {

    constructor(private readonly databaseService: DatabaseService) {
    }

    async login() {
        //토큰 만들어서 넘겨주기
        const accessToken = ''
        const refreshToken = ''

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    async logout() {
    }


}