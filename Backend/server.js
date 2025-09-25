import "dotenv/config"
console.log("JWT_SECRET:", process.env.JWT_SECRET);

import app from './src/app.js'
import connectDB from "./src/db/db.js"



connectDB()



const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`server is running on PORT : ${PORT}`)
})