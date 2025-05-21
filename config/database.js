const mongoose = require('mongoose')
require('dotenv').config()

const DB = process.env.DATABASE_URL

mongoose.connect(DB)
.then(()=>{
    console.log('datasse connected successfully')
})
.catch((error)=>{
    console.log('Error connecting to database'+error.message)
})