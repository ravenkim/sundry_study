import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database/database.service'
import { Request } from 'express'

@Injectable()
export class CommonCodeManagementService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getCommonCodes(req: Request) {
        const cookies = Object.assign({}, req.cookies)
        console.log(cookies)
        const result = await this.databaseService.query(
            'src/modules/admin/common-code-management/sql/get-common-code.sql',
        )
        return result
    }
}

// async getUserById(userId: number) {
//     const query = 'SELECT * FROM users WHERE id = ?';
//     const params = [userId];
//     return await this.databaseService.query(query, params);
// }
//
// async getUsersByStatus(status: string) {
//     const query = 'SELECT * FROM users WHERE status = ?';
//     const params = [status];
//     return await this.databaseService.query(query, params);
// }
//
// async createUser(name: string, email: string, status: string) {
//     const query = 'INSERT INTO users (name, email, status) VALUES (?, ?, ?)';
//     const params = [name, email, status];
//     return await this.databaseService.query(query, params);
// }
