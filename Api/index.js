import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import UserRouter from "./routes/user.routes.js"
import AuthRouter from "./routes/auth.routes.js"
import ListingRouter from "./routes/listing.routes.js"
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config()


mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected")
}).catch(err => {
    console.log(err)
})

const app = express()
const __dirname = path.resolve();


app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
    console.log("listening on port 3000")
})

app.use("/api/user", UserRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/listing", ListingRouter)

app.use(express.static(path.join(__dirname, "/client/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Client", "dist", "index.html"))
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    })
})




