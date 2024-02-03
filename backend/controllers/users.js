const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
        return res.status(401).json({ message: "Missing username, name, or password." });
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            name,
            passwordHash 
        });

        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        next(error);
    }
})

userRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ message: "Missing username or password." });
    }

    try {
        const user = await User.findOne({ username });

        if (user) {
            if ('passwordHash' in user && user.passwordHash) {
                const samePassword = await bcrypt.compare(password, user.passwordHash);

                if (samePassword) {
                    const userToken = {
                        username: user.username,
                        id: user._id
                    };

                    const signedToken = jwt.sign(userToken, process.env.SECRET);

                    return res.status(200).json({
                        username: user.username,
                        name: user.name,
                        token: signedToken
                    });
                }
            }
        }

        return res.status(401).json({ message: "Username or password is incorrect." });
    } catch (error) {
        next(error);
    }
})

module.exports = userRouter