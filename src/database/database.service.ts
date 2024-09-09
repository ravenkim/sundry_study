import { Inject, Injectable } from '@nestjs/common'
import { Pool } from 'mysql2/promise'
import * as fs from 'fs'
import * as path from 'path'
import { ResultSetHeader } from 'mysql2'

@Injectable()
export class DatabaseService {
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly connection: Pool,
    ) {}

    async query(queryUrl: string, params: any[] = []) {
        // todo 여기 애러 처리 해야할지 고민중입니다
        const queryPath = path.resolve(queryUrl)
        const query = fs.readFileSync(queryPath, 'utf8')

        try {
            const [results] = await this.connection.execute(query, params)
            return results
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                throw new Error('디비 죽음')
            } else {
                throw new Error(`디비에서 쿼리실행에 실패`)
            }
        }
    }
}
