import { Injectable, Inject } from '@nestjs/common'
import { Pool } from 'mysql2/promise'

@Injectable()
export class DatabaseService {
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly connection: Pool,
    ) {}
    async query(query: string, params: any[] = []) {
        const [results] = await this.connection.execute(query, params)
        return results
    }
}