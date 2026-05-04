import {v4 as uuidV4} from 'uuid'

import {
    pathCreate,
    pathExists,
    findMemberByParamJsonFile,
    addMemberJsonFile,
    deleteMemberJsonFile

} from './baseModel.js';

const path = pathCreate('Data','posts.json')

export async function initializePostsFile(){
 return  pathExists(path);
}


export async function getAllPosts(postId = true){
  return  findMemberByParamJsonFile(path,'id',postId )
}

// Get a single post by ID
export async function getPostById(postId){
    return  findMemberByParamJsonFile(path,'id',postId)
}

// Get posts by user ID
export async function getPostsByUserId(userId){
    return  findMemberByParamJsonFile(path,'userId',userId)
}

// Create a new post
export async function createPost(data){
    return addMemberJsonFile(path,{...data, id: uuidV4(),createdAt: new Date().toISOString()})
}

// Update a post
export async function updatePost(postId, updates){
    const post = await findMemberByParamJsonFile(path,'id',postId)
    await deleteMemberJsonFile(path,'id',postId);
    return addMemberJsonFile(path,{...post[0],...updates,updatedAt: new Date().toISOString()})
}

// Delete a post
export async function deletePost(postId){
    return  deleteMemberJsonFile(path,'id',postId);
}

export default {
    initializePostsFile,
    getAllPosts,
    getPostById,
    getPostsByUserId,
    createPost,
    updatePost,
    deletePost,
}