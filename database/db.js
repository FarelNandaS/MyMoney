import Dexie from 'dexie';

export const db = new Dexie('MyMoneyDB');

db.version(1).stores({
    transactions: '++id, date, category, amount, type, note, dateStr'
});