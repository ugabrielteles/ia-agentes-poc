import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export interface TransactionFilter {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  isPersonal?: boolean;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionDocument> {
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      user: userId,
    });
    return transaction.save();
  }

  async findAll(
    userId: string,
    filter: TransactionFilter = {},
  ): Promise<TransactionDocument[]> {
    const query: any = { user: userId };

    if (filter.type) query.type = filter.type;
    if (filter.category) query.category = filter.category;
    if (filter.isPersonal !== undefined) query.isPersonal = filter.isPersonal;
    if (filter.startDate || filter.endDate) {
      query.date = {};
      if (filter.startDate) query.date.$gte = new Date(filter.startDate);
      if (filter.endDate) query.date.$lte = new Date(filter.endDate);
    }

    return this.transactionModel
      .find(query)
      .populate('category', 'name icon color')
      .sort({ date: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findOne({ _id: id, user: userId })
      .populate('category', 'name icon color')
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        updateTransactionDto,
        { new: true },
      )
      .populate('category', 'name icon color')
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.transactionModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }
  }

  async getSummary(userId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage: any = { user: { $toString: userId } };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.date = dateFilter;
    }

    const result = await this.transactionModel.aggregate([
      {
        $match: {
          user: { $toString: userId },
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { income: 0, expense: 0, balance: 0 };
    result.forEach((item) => {
      if (item._id === 'income') summary.income = item.total;
      if (item._id === 'expense') summary.expense = item.total;
    });
    summary.balance = summary.income - summary.expense;

    return summary;
  }
}
