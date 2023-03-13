const express = require('express')
const app = express()
const cors = require('cors')
const userRouter = require('./routes/userRouter')
const port = process.env.PORT || 4000
const FRONT_URL = "https://fabulous-manatee-15ce10.netlify.app"
const cookieParser = require("cookie-parser")
require('dotenv').config();
require('./db/connections')
app.use(cors({ credentials: true, origin: `${FRONT_URL}` }))
app.use(express.json())
app.use(cookieParser())
app.use("/", userRouter)



app.listen(port, () => {
    console.log(`server running on port ${port}`)
})