import { Injectable, Inject } from '@nestjs/common'
import { Pool } from 'mysql2/promise'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class DatabaseService {
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly connection: Pool,
    ) {}

    async query(queryUrl: string, params: any[] = []) {
        const queryPath = path.resolve(queryUrl)
        const query = fs.readFileSync(queryPath, 'utf8')
        const [results] = await this.connection.execute(query, params)
        return results
    }
}