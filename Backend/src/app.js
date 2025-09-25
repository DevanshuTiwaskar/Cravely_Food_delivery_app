import express from "express"
import authRouter from "./Routers/auth.routes.js"
import cookieParser from "cookie-parser"


const app = express()



app.use(cookieParser())
app.use(express.json());

// Parse URL-encoded bodies (optional, for forms)
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRouter)



export default app