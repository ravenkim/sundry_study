import { BadRequestException } from '@nestjs/common'
import { DatabaseService } from '../../../database/database.service'

export async function checkIdDuplicate(
    userId: string,
    databaseService: DatabaseService,
): Promise<void> {
    const { is_duplicate } = (
        await databaseService.query(
            'src/modules/users/sql/duplicate_id_check.sql',
            [userId],
        )
    )[0]

    if (is_duplicate) {
        throw new BadRequestException('중복된 아이디 입니다.')
    }
}
