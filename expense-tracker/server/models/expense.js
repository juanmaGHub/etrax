const db = require('../config/database');


const expenseById = async (id) => {
    const result = await db.promise().query(
        'SELECT * FROM expenses WHERE id = ?',
        [id],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
}

const expenseByUserId = async (userId, dateStart = null) => {
    // I am using a more complex query since I would need the category name instead of the id for the frontend,
    // I also want to filter by date, order the results and set a limit of 1000 records
    if (!dateStart) {
        // last month by default
        const date = new Date();
        dateStart = `${date.getFullYear()}-${date.getMonth()-1}-${date.getDate()}`;
    }
    const result = await db.promise().query(
        "SELECT e.id id, e.userId userId, e.amount amount, e.description description, c.name category,"
        +" e.createdAt createdAt, e.updatedAt updatedAt FROM expenses AS e JOIN categories AS c"
        +" ON c.id = e.categoryId WHERE e.userId = ? AND e.createdAt >= ?"
        +" ORDER BY e.createdAt DESC LIMIT 1000",
        [userId, dateStart],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
}

const add = async (expense) => {
    const result = await db.promise().query(
        'INSERT INTO expenses (userId, categoryId, amount, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [expense.userId, expense.categoryId, expense.amount, expense.description, expense.createdAt, expense.createdAt],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
}

const update = async (id, expense) => {
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await db.promise().query(
        'UPDATE expenses SET categoryId = ?, amount = ?, description = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
        [expense.categoryId, expense.amount, expense.description, expense.createdAt, updatedAt, id],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
}

const remove = async (id) => {
    const result = await db.promise().query(
        'DELETE FROM expenses WHERE id = ?',
        [id],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
}
module.exports = {
    add,
    update,
    remove,
    expenseById,
    expenseByUserId
};