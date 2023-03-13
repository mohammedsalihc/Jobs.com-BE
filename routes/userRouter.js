const express = require('express');
const User = require('../Models/User');
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Jobs = require('../Models/Jobs');
const { application } = require('express');

const now = moment();
const jobDate = now.format("DD-MM-YYYY");

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}






router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const preuser = await User.findOne({ email: email })
        if (preuser) {
            res.status(422).json("user already exist")
        } else {
            userDoc = await User.create({ name, email, password: bcrypt.hashSync(password, 10) })
            res.status(200).json(userDoc)
        }

    } catch (error) {
        res.json(error)
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userValid = await User.findOne({ email: email })
    if (userValid) {
        const passOk = await bcrypt.compare(password, userValid.password)
        if (passOk) {
            jwt.sign({ email, id: userValid._id }, process.env.SECRET, { expiresIn: "30d" }, (err, token) => {
                if (err) throw err
                res.cookie("token", token).json({ id: userValid._id, email })
            })
        } else {
            res.status(400).json("invalid Credintials")
        }
    } else {
        res.status(400).json("user not found")
    }
})



router.get('/profile', verifyToken, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
});




router.post("/logout", (req, res) => {
    res.cookie("token", "").json("ok")
})



router.post('/jobpost', verifyToken, async (req, res) => {
    try {
        const { title, salary, openings } = req.body;
        const jobDoc = await Jobs.create({ title, salary, openings, date: jobDate, userId: req.user.id });
        res.status(200).json({ message: 'Job posted successfully' });
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});;


router.get('/jobs', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userJobs = await Jobs.find({ userId });
        res.status(200).json(userJobs);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.delete('/deletejob/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id
        const deleteJob = await Jobs.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: 'Job deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router