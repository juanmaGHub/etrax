const categoryModel = require('../models/category');


const fetchAll = async (req, res) => {
    try {
        const result = await categoryModel.getAllCategories();
        res.status(200).json({ message: "Categories retrieved successfully", categories: result, status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    fetchAll
};