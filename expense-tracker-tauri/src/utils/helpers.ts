// 格式化金额显示
export const formatAmount = (amount: number): string => {
    return `¥${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// 格式化日期
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return '今天';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return '昨天';
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
};

// 格式化完整日期
export const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
};

// 获取指定月份开始日期
export const getMonthStart = (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// 获取指定月份结束日期
export const getMonthEnd = (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
};

// 获取指定年份开始日期
export const getYearStart = (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), 0, 1);
};

// 获取指定年份结束日期
export const getYearEnd = (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
};

// 获取本周开始日期
export const getWeekStart = (): Date => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
};

export interface Expense {
    id: string;
    amount: number;
    categoryId: string;
    note?: string;
    date: string;
    type: 'income' | 'expense';
    createdAt: string;
    updatedAt?: string;
}

export interface ExpenseGroup {
    date: string;
    items: Expense[];
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
}

// 按日期分组
export const groupByDate = (expenses: Expense[]): ExpenseGroup[] => {
    const groups: Record<string, ExpenseGroup> = {};
    expenses.forEach(exp => {
        const dateKey = new Date(exp.date).toDateString();
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: exp.date,
                items: [],
                totalIncome: 0,
                totalExpense: 0,
                netBalance: 0,
            };
        }
        groups[dateKey].items.push(exp);
        if (exp.type === 'income') {
            groups[dateKey].totalIncome += exp.amount;
        } else {
            groups[dateKey].totalExpense += exp.amount;
        }
        groups[dateKey].netBalance = groups[dateKey].totalIncome - groups[dateKey].totalExpense;
    });
    return Object.values(groups).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
