

import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TapGateway } from './tap.gateway';

@Module({
    imports: [UserModule],
    providers: [TapGateway],
})
export class TapModule {}
