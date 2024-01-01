// if its a middleware function then express send us three parameters
import { NextFunction,Request,Response } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken"

declare global{
    namespace Express{
        interface Request {
            userId:string;
        }
    }
}

export const verifyToken = (req:Request,res:Response, next:NextFunction)=>{
    const token = req.cookies["auth_token"];

    if(!token){
        res.status(401).json({message:"unauthorized"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string)
        // we are adding this userId to req because it will get forward to next function and then we will pass this to our front end
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        res.status(401).json({message:"unauthorized"});
    }
}