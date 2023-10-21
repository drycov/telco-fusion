"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const firebaseConfig_1 = require("../utils/firebaseConfig");
const getUsers = async (req, res) => {
    try {
        const usersSnapshot = await firebaseConfig_1.db.collection('users').get();
        const users = [];
        usersSnapshot.forEach((doc) => {
            const user = {
                id: doc.id,
                username: doc.data().username,
                email: doc.data().email,
                post: doc.data().post,
                fname: doc.data().fname,
                lname: doc.data().lname,
                password: doc.data().password,
                role: doc.data().role
            };
            users.push(user);
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const userDoc = await firebaseConfig_1.db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = {
            id: userDoc.id,
            username: userDoc.data().username,
            email: userDoc.data().email,
            post: userDoc.data().post,
            lname: userDoc.data().lname,
            fname: userDoc.data().fname,
            password: userDoc.data().password,
            role: userDoc.data().role
        };
        res.json(userData);
    }
    catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    const { username, email, post, lname, fname, password, role } = req.body;
    try {
        const userRef = await firebaseConfig_1.db.collection('users').add({
            username,
            email,
            post, lname, fname,
            password,
            role
        });
        const createdUser = {
            id: userRef.id,
            username,
            email,
            post, lname, fname,
            password,
            role
        };
        res.json(createdUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, post, lname, fname, password, role } = req.body;
    try {
        await firebaseConfig_1.db.collection('users').doc(userId).update({
            username,
            email,
            post, lname, fname,
            password, role
        });
        res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await firebaseConfig_1.db.collection('users').doc(userId).delete();
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
