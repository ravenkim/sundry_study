import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'

export type User = any;


@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) {}

    async getUser() {}

    async getUserDetail() {

    }

    async createUserDetail() {

    }

    async updateUserDetail() {

    }


    async deleteUserDetail() {

    }


}