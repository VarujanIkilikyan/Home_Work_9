import HttpErrors from 'http-errors';
import usersModel from '../models/usersModel.js';
import {log} from "debug";

export  default (req,res,next)=>{
    try {
        const token = req.headers?.authorization || null;

        if (!token) {
            next(HttpErrors(401));
        }

        const data =usersModel.decrypt(token);
        if (!data || !data?.userID) {
            next(HttpErrors(401));
        }
        req.userId = data.userID;
        next();
    }catch (e){
        next(HttpErrors(401));
    }

}