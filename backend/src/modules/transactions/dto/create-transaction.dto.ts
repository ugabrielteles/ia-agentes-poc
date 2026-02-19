import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from '../schemas/transaction.schema';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  description: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0, { message: 'O valor não pode ser negativo' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Tipo inválido. Use: income ou expense' })
  type: TransactionType;

  @IsMongoId({ message: 'ID de categoria inválido' })
  category: string;

  @IsDateString({}, { message: 'Data inválida' })
  date: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPersonal?: boolean;
}
