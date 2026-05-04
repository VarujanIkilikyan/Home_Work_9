import HttpErrors from 'http-errors';
import postsModel from '../models/postsModel.js';
import  {checkMemberById} from "../models/usersModel.js";

export default {
    async getAllPosts(req, res, next){
        try {
            const objQuery = req.query;

            if(Object.keys(objQuery).length === 0){
                 const posts = await postsModel.getAllPosts();
                res.json({
                    message: 'we get all posts',
                    posts
                })
            }else if (objQuery.id){
                 const posts = await postsModel.getAllPosts(objQuery.id);

                res.json({
                    message: 'we get post by query',
                    posts
                })
            }else {

                throw  new HttpErrors(422,{
                    errors:{
                        message: 'wrong url',}
                })

            }



        }catch (e) {
            next(e);
        }

    },

// GET /posts/:id - Get a single post by ID
    async getPost(req, res, next){
        try {
            const paramId = req.params.id;
            if(!paramId){
                throw  new HttpErrors(422,{
                    errors:{
                        message: 'wrong id',}
                })

            }
            const post = await postsModel.getPostById(paramId);

            res.json({
                message: 'we get post by params',
                post
            })

        }catch (e){
            next(e);
        }

    },

// POST /posts - Create a new post (requires authentication)
    async createPost(req, res, next){
        try {
            const{userId} = req
            if( !await checkMemberById(userId)){
                throw  new HttpErrors(422,{
                    errors:{
                        message: 'User not found',}
                })
            }

          const post =  await postsModel.createPost({...req.body,userId});

            res.json({
                message: 'posts created',
                Headers: { "Authorization": req.headers.authorization },
                Body:post
            })

        }catch (e){
            next(e);
        }
    },

// PUT /posts/:id - Update a post (requires authentication + ownership)
    async updatePost(req, res, next){
        const{userId} = req
        const paramId = req.params.id;

        const oldpost = await postsModel.getPostById(paramId);

        if( !await checkMemberById(userId) || !paramId || oldpost.length === 0){
            throw  new HttpErrors(422,{
                errors:{
                    message: 'incorect data',}
            })

        }
        const post = await  postsModel.updatePost(paramId,req.body);
        res.json({
            message: 'posts updated',
            Headers: { "Authorization": req.headers.authorization },
            oldPost: oldpost,
            newPost: post
        })
    },

// DELETE /posts/:id - Delete a post (requires authentication + ownership)
    async deletePost(req, res, next){
        const{userId} = req
        const paramId = req.params.id;

        const oldpost = await postsModel.getPostById(paramId);

        if( !await checkMemberById(userId) || !paramId || oldpost.length === 0){
            throw  new HttpErrors(422,{
                errors:{
                    message: 'incorect data',}
            })

        }

        await  postsModel.deletePost(paramId);

        res.json({
            message: 'posts deleted',
            Headers: { "Authorization": req.headers.authorization },
            deletedPost: oldpost
        })

    }
}