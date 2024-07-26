import { Injectable } from '@nestjs/common'
import { CommonCodeDto } from '../dto/common-code.dto'

@Injectable()
export class CommonCodeService {
    private commonCodes: CommonCodeDto[] = [
        {
            high_common_code: 'HIGH_1',
            common_code: 'CODE_1',
            common_code_name: 'Name for code 1',
        },
        {
            high_common_code: 'HIGH_2',
            common_code: 'CODE_2',
            common_code_name: 'Name for code 2',
        },
    ]

    getCommonCodes(): CommonCodeDto[] {
        return this.commonCodes
    }
}