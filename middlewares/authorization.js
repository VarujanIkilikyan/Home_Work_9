import HttpErrors from 'http-errors';
import usersModel from '../models/usersModel.js';
import moment from 'moment';


export  default  async (req,res,next)=>{
    try {
        const token = req.headers?.authorization || null;

        if (!token) {
            next(HttpErrors(401));
        }

        const data =usersModel.decrypt(token);
        if (!data || !data?.userID || !data?.expiresIn) {
            next(HttpErrors(401));
        }
        if(await  usersModel.findMemberById(data.userID).length === 0) {
            next(HttpErrors(401));
        }
        if(moment().isAfter(moment(data.expiresIn))){
            next(HttpErrors(401),'token expired!');
        }
        req.userId = data.userID;
        next();
    }catch (e){
        next(HttpErrors(401));
    }

}