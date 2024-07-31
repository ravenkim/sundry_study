import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../../database/database.service'

@Injectable()
export class CommonCodeManagementService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getCommonCodes() {
        const query = 'SELECT * FROM common_code'
        const result = await this.databaseService.query(query)
        // 실제 데이터 로직을 여기에 추가합니다.
        return await { message: result }
    }
}
