const db = require('../config/database');


const getAllCategories = async () => {
    // No pagination for now, just return the first 30 categories
    // otherwise, we can use LIMIT and OFFSET to implement pagination
    const result = await db.promise().query(
        'SELECT * FROM categories LIMIT 30',
        [],
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
    getAllCategories
};