import { BadRequestException } from '@nestjs/common'
import { DatabaseService } from '../../../database/database.service'

export async function checkEmailDuplicate(
    userEmail: string,
    databaseService: DatabaseService,
): Promise<void> {
    class DuplicateEmailException extends BadRequestException {
        constructor() {
            super('중복된 이메일입니다.')
        }
    }


    // todo 이메일 중복채쿠 하는 쿼리문 작성

    const emailCheckResult = userEmail === 'user@example.com' ? 1 : 0

    //     await databaseService.query(
    //     'SELECT COUNT(*) as count FROM users WHERE userEmail = ?',
    //     [userEmail],
    // )

    if (
        emailCheckResult
        // emailCheckResult[0].count > 0
    ) {
        throw new DuplicateEmailException()
    }
}
