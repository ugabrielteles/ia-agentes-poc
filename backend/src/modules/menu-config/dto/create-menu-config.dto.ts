import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMenuConfigDto {
  @IsNotEmpty({ message: 'O rótulo é obrigatório' })
  @IsString()
  label: string;

  @IsNotEmpty({ message: 'O ícone é obrigatório' })
  @IsString()
  icon: string;

  @IsNotEmpty({ message: 'A rota é obrigatória' })
  @IsString()
  route: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsMongoId({ message: 'ID de menu pai inválido' })
  parentMenu?: string;

  @IsOptional()
  @IsObject()
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
  };
}
