import express,{Request,Response} from 'express'
import cors from 'cors'
import "dotenv/config" //loads the env 
import mongoose from 'mongoose'
import userRoutes from "./routes/users"
import authRoutes from "./routes/auth"
import cookieParser from "cookie-parser"
import path from 'path'

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

const app = express(); // initializing
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

// serve our static assests on backend. and because of this we are noe able to access out front end on port 7000, which is of backend endpoint
// now we only need to host / deployee the backend.
app.use(express.static(path.join(__dirname,"../../frontend/dist")))

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(7000,()=>{
    console.log("listning on port 7000")
})
