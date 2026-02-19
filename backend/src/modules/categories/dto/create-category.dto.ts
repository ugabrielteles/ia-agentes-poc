import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryType } from '../schemas/category.schema';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O ícone é obrigatório' })
  @IsString()
  icon: string;

  @IsNotEmpty({ message: 'A cor é obrigatória' })
  @IsString()
  color: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'Tipo inválido' })
  type?: CategoryType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
