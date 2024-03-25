import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import UserRouter from "./routes/user.routes.js"
import AuthRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";


dotenv.config()


mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected")
}).catch(err => {
    console.log(err)
})

const app = express()

app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
    console.log("listening on port 3000")
})

app.use("/api/user", UserRouter)
app.use("/api/auth", AuthRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    })
})


