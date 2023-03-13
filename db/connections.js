const mongoose = require('mongoose')
const DB = process.env.DATABASE_URL


mongoose.connect(DB, {

    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('database connected')).catch((error) => console.log("error", error.message))



