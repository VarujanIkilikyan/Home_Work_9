import HttpErrors from 'http-errors';
import usersModel from '../models/usersModel.js';
import moment from 'moment';


export default {


    async registration (req, res, next) {
        try {

            const {name,email,password,age} = req.body;
            if(await usersModel.checkMemberByEmail(email)) {

                throw  new HttpErrors(422,{
                    message: 'Validation error',
                    errors:{
                        email: 'почта уже сушествует',
                    }
                })
            }
            const user = await usersModel.createUser({
                name,
                email,
                password: usersModel.hashPassword(password),
                age
            })

            delete user.password;



            res.json({
                message: 'User created successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    },

    async login(req, res, next) {
        try {
            const {email,password} = req.body;

            const user = await usersModel.findMemberByEmail(email)
            if(!user || (user.password !== usersModel.hashPassword(password))) {
                throw new HttpErrors(401, {
                    errors:{
                        email: 'неправильный email или пароль',
                        password: 'неправильный email или пароль',
                    }
                })
            }

            const token = usersModel.encrypt(
                {userID: user.id,
                      expiresIn: moment().add(30, 'minutes').toISOString(),
            });
            delete user.password;
            res.json({
                token,
                user
            })

        } catch (e) {
            next(e);
        }
    },

    async profile(req, res, next) {
        try {
            const{userId} = req
            const user = await usersModel.findMemberById(userId);
            delete user.password;

            res.json({
                user,
            })

        } catch (e) {
            next(e);
        }
    },

}