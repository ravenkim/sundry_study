import { BadRequestException } from '@nestjs/common'
import { DatabaseService } from '../../../database/database.service'

export async function checkEmailDuplicate(
    userEmail: string,
    databaseService: DatabaseService,
): Promise<void> {
    const { is_duplicate } = (
        await databaseService.query(
            'src/modules/users/sql/duplicate_email_check.sql',
            [userEmail],
        )
    )[0]

    if (is_duplicate) {
        throw new BadRequestException('중복된 이메일입니다.')
    }

    // const result = await databaseService.query(
    //     'src/modules/users/sql/duplicate_email_check.sql',
    //     [userEmail],
    // )
    //
    // if (result[0].is_duplicate) {
    //     throw new BadRequestException('중복된 이메일입니다.')
    // }
}
