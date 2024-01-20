const expenseModel = require('../models/expense.js');


const add = async (req, res) => {
    try {
        const result = await expenseModel.add(req.body);
        res.status(200).json({ message: "Expense added", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const update = async (req, res) => {
    try {
        const result = await expenseModel.update(req.params.id, req.body);
        res.status(200).json({ message: "Expense updated", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const remove = async (req, res) => {
    try {
        const result = await expenseModel.remove(req.params.id);
        res.status(200).json({ message: "Expense deleted", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const get = async (req, res) => {
    try {
        const result = await expenseModel.expenseById(req.params.id);
        res.status(200).json({ message: "Expense retrieved", expense: result, status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const getByUserId = async (req, res) => {
    try {
        const result = await expenseModel.expenseByUserId(req.params.userId, req.query.startDate);
        res.status(200).json({ message: "Expenses retrieved for current user", expenses: result, status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    add,
    update,
    get,
    remove,
    getByUserId
};