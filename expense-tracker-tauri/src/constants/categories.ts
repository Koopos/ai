// 支出分类定义 - 包含宝宝相关分类
export const categories = [
    {
        id: 'food',
        name: '餐饮',
        icon: '🍽️',
        color: '#f6ad55',
    },
    {
        id: 'transport',
        name: '交通',
        icon: '🚗',
        color: '#63b3ed',
    },
    {
        id: 'shopping',
        name: '购物',
        icon: '🛒',
        color: '#fc8181',
    },
    {
        id: 'entertainment',
        name: '娱乐',
        icon: '🎮',
        color: '#b794f4',
    },
    {
        id: 'housing',
        name: '住房',
        icon: '🏠',
        color: '#68d391',
    },
    {
        id: 'medical',
        name: '医疗',
        icon: '💊',
        color: '#f687b3',
    },
    {
        id: 'baby_formula',
        name: '奶粉',
        icon: '🍼',
        color: '#faf089',
    },
    {
        id: 'baby_toys',
        name: '玩具',
        icon: '🧸',
        color: '#90cdf4',
    },
    {
        id: 'baby_clothes',
        name: '童装',
        icon: '👕',
        color: '#fbb6ce',
    },
    {
        id: 'education',
        name: '教育',
        icon: '📚',
        color: '#9ae6b4',
    },
    {
        id: 'salary',
        name: '工资',
        icon: '💵',
        color: '#48bb78',
    },
    {
        id: 'bonus',
        name: '奖金',
        icon: '🎁',
        color: '#38a169',
    },
    {
        id: 'other',
        name: '其他',
        icon: '📌',
        color: '#a0aec0',
    },
];

export const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id) || categories[categories.length - 1];
};

export default categories;
