import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuConfigService } from './menu-config.service';
import { MenuConfigController } from './menu-config.controller';
import { MenuConfig, MenuConfigSchema } from './schemas/menu-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuConfig.name, schema: MenuConfigSchema },
    ]),
  ],
  controllers: [MenuConfigController],
  providers: [MenuConfigService],
  exports: [MenuConfigService],
})
export class MenuConfigModule {}
