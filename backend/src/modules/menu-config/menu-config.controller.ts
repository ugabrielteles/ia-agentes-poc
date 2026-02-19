import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MenuConfigService } from './menu-config.service';
import { CreateMenuConfigDto } from './dto/create-menu-config.dto';
import { UpdateMenuConfigDto } from './dto/update-menu-config.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('menu-config')
@UseGuards(JwtAuthGuard)
export class MenuConfigController {
  constructor(private readonly menuConfigService: MenuConfigService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createMenuConfigDto: CreateMenuConfigDto) {
    return this.menuConfigService.create(createMenuConfigDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.menuConfigService.findAll();
  }

  @Get('my-menus')
  findMyMenus(@Request() req) {
    return this.menuConfigService.findByRole(req.user.role);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.menuConfigService.findOne(id);
  }

  @Patch('reorder')
  @UseGuards(RolesGuard)
  @Roles('admin')
  reorder(@Body() body: Array<{ id: string; order: number }>) {
    return this.menuConfigService.reorder(body);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateMenuConfigDto: UpdateMenuConfigDto,
  ) {
    return this.menuConfigService.update(id, updateMenuConfigDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.menuConfigService.remove(id);
  }
}
