import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../transactions/schemas/transaction.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async getMonthlySummary(userId: string, year: number) {
    return this.transactionModel.aggregate([
      {
        $match: {
          user: { $toString: userId },
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);
  }

  async getCategoryReport(userId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    return this.transactionModel.aggregate([
      {
        $match: {
          user: { $toString: userId },
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          category: '$categoryInfo.name',
          icon: '$categoryInfo.icon',
          color: '$categoryInfo.color',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getDashboardSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [currentMonth, lastTransactions] = await Promise.all([
      this.transactionModel.aggregate([
        {
          $match: {
            user: { $toString: userId },
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]),
      this.transactionModel
        .find({ user: userId })
        .populate('category', 'name icon color')
        .sort({ date: -1 })
        .limit(5)
        .exec(),
    ]);

    const summary = { income: 0, expense: 0, balance: 0 };
    currentMonth.forEach((item) => {
      if (item._id === 'income') summary.income = item.total;
      if (item._id === 'expense') summary.expense = item.total;
    });
    summary.balance = summary.income - summary.expense;

    return {
      currentMonth: summary,
      lastTransactions,
    };
  }
}
