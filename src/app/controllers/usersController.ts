import { Request, Response } from 'express';
import { db } from '../utils/firebaseConfig';
import UserModel from '../models/UserModel';

const getUsers = async (req: Request, res: Response) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users: UserModel[] = [];

        usersSnapshot.forEach((doc) => {
            const user: UserModel = {
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
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData: UserModel = {
            id: userDoc.id,
            username: userDoc.data()!.username,
            email: userDoc.data()!.email,
            post: userDoc.data()!.post,
            lname: userDoc.data()!.lname,
            fname: userDoc.data()!.fname,
            password: userDoc.data()!.password,
            role: userDoc.data()!.role
        };

        res.json(userData);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createUser = async (req: Request, res: Response) => {
    const { username,
        email,
        post, lname, fname,
        password, role } = req.body;

    try {
        const userRef = await db.collection('users').add({
            username,
            email,
            post, lname, fname,
            password,
            role
        });

        const createdUser: UserModel = {
            id: userRef.id,
            username,
            email,
            post, lname, fname,
            password,
            role
        };

        res.json(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { username,
        email,
        post, lname, fname,
        password, role } = req.body;

    try {
        await db.collection('users').doc(userId).update({
            username,
            email,
            post, lname, fname,
            password, role
        });
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        await db.collection('users').doc(userId).delete();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };

