import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuConfig, MenuConfigDocument } from './schemas/menu-config.schema';
import { CreateMenuConfigDto } from './dto/create-menu-config.dto';
import { UpdateMenuConfigDto } from './dto/update-menu-config.dto';

@Injectable()
export class MenuConfigService {
  constructor(
    @InjectModel(MenuConfig.name)
    private menuConfigModel: Model<MenuConfigDocument>,
  ) {}

  async create(createDto: CreateMenuConfigDto): Promise<MenuConfigDocument> {
    const menu = new this.menuConfigModel(createDto);
    return menu.save();
  }

  async findAll(): Promise<MenuConfigDocument[]> {
    return this.menuConfigModel
      .find()
      .populate('parentMenu', 'label icon route')
      .sort({ order: 1 })
      .exec();
  }

  async findByRole(role: string): Promise<MenuConfigDocument[]> {
    return this.menuConfigModel
      .find({
        roles: { $in: [role] },
        isActive: true,
        isVisible: true,
      })
      .populate('parentMenu', 'label icon route')
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string): Promise<MenuConfigDocument> {
    const menu = await this.menuConfigModel
      .findById(id)
      .populate('parentMenu', 'label icon route')
      .exec();

    if (!menu) {
      throw new NotFoundException('Menu não encontrado');
    }

    return menu;
  }

  async update(
    id: string,
    updateDto: UpdateMenuConfigDto,
  ): Promise<MenuConfigDocument> {
    const menu = await this.menuConfigModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('parentMenu', 'label icon route')
      .exec();

    if (!menu) {
      throw new NotFoundException('Menu não encontrado');
    }

    return menu;
  }

  async remove(id: string): Promise<void> {
    const result = await this.menuConfigModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Menu não encontrado');
    }
  }

  async reorder(
    items: Array<{ id: string; order: number }>,
  ): Promise<void> {
    const operations = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await this.menuConfigModel.bulkWrite(operations);
  }
}
