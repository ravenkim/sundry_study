import { Injectable } from '@nestjs/common'
import { CommonCodeService } from './common-code-management/common-code.service'

@Injectable()
export class AdminService {
    constructor(private readonly commonCodeService: CommonCodeService) {
    }

    getCommonCode() {
        return this.commonCodeService.getCommonCodes()
    }
}