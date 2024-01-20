const userModel = require("../models/user");

const login = async (req, res) => {
    try {
        const user = await userModel.verifyUser(req.body);
        res.status(200).json({ message: "Login successful", user: user, status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

const register = async (req, res) => {
    try {
        const result = await userModel.createUser(req.body);
        res.status(200).json({ message: "User created successfully", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const update = async (req, res) => {
    try {
        const result = await userModel.updateUser(req.body);
        res.status(200).json({ message: "User updated successfully", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const remove = async (req, res) => {
    try {
        const result = await userModel.deleteUser(req.params.id);
        res.status(200).json({ message: "User removed successfully", status: "success" });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

const get = async (req, res) => {
    try {
        const result = await userModel.userById(req.params.id);
        res.status(200).json({message: "User retrieved successfully", user: result});
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    login,
    update,
    register,
    get,
    remove
};