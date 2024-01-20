const bcrypt = require('bcryptjs');
const db = require('../config/database');


const _encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const _comparePassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}

const _getUserBy = async (key, value) => {
    const result = await db.promise().query(
        'SELECT * FROM users WHERE ?? = ?',
        [key, value],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result[0];
};

const userById = async (id) => {
    id = parseInt(id);

    if (isNaN(id)) {
        throw new Error('Invalid user id');
    } 

    const result = await _getUserBy('id', id);
    return result;
}

const verifyUser = async (user) => {
    const { email, password } = user;
    const msg = 'Invalid email or password';

    const existingUser = await _getUserBy('email', email);

    if (!existingUser[0]) {
        throw new Error(msg);
    }

    // if the database password is not hashed, hash it and update the database
    // this is to ensure that all passwords are hashed and to handle the case
    // of manually adding or updating users directly into the database
    if (existingUser[0].password.length < 60) {
        existingUser[0].password = await _encryptPassword(existingUser[0].password);
        await updateUser(existingUser[0]);
    }
    
    const match = await _comparePassword(password, existingUser[0].password);
    if (!match) {
        throw new Error(msg);
    }
    
    return existingUser[0];
}

const userExists = async (user) => {
    const { email, username } = user;
    const existingUser = await _getUserBy('email', email);
    if (existingUser[0]) {
        return true;
    }
    const existingUsername = await _getUserBy('username', username);
    if (existingUsername[0]) {
        return true;
    }
    return false;
}

const createUser = async (user) => {
    let { username, email, password } = user;
    
    // check if user already exists by email
    let exists = await userExists(user);
    if (exists) {
        throw new Error('User already exists');
    }

    // hash password
    password = await _encryptPassword(password);

    // create user
    const result = await db.promise().query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result;
};

const updateUser = async (user) => {
    const { id, username, email, password } = user;
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await db.promise().query(
        'UPDATE users SET username = ?, email = ?, password = ?, updatedAt = ? WHERE id = ?',
        [username, email, password, updatedAt, id],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result;
};

const deleteUser = async (id) => {
    const result = await db.promise().query(
        'DELETE FROM users WHERE id = ?',
        [id],
        (err, rows) => {
            if (err) {
                throw err;
            }
            return rows;
        }
    );
    return result;
};


module.exports = {
    verifyUser,
    createUser,
    updateUser,
    deleteUser,
    userById
};