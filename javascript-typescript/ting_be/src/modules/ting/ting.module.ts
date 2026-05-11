import { Module } from '@nestjs/common'
import { PartyModule } from './party/party.module'
import { RoomModule } from './room/room.module'

@Module({
    imports: [PartyModule, RoomModule],
})
export class TingModule {}
