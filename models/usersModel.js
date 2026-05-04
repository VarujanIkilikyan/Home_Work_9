import {v4 as uuidV4} from 'uuid'
import md5 from 'md5';
import CryptoJS from 'crypto-js';
import {
    pathCreate,
    pathExists,
    readJsonFile,
    writeJsonFile,
    addMemberJsonFile,
    checkMemberByParamJsonFile,
    findMemberByParamJsonFile,
    deleteMemberJsonFile
} from './baseModel.js';

const path = pathCreate('Data', 'users.json')
const {PASSWORD_SECRET, TOKEN_SECRET} = process.env;

export function hashPassword(password) {
    return md5(md5(password) + PASSWORD_SECRET);
}

export function encrypt(data) {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data), TOKEN_SECRET).toString();
}

export function decrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, TOKEN_SECRET);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        return null;
    }


}

export async function createUser(data) {
    return await addMemberJsonFile(path, {...data, id: uuidV4()});

}

export async function checkMemberByEmail(email) {
    return await checkMemberByParamJsonFile(path, 'email', email);
}

export async function checkMemberById(id) {
    return await checkMemberByParamJsonFile(path, 'id', id);
}

export async function findMemberByEmail(email) {
     const find = await findMemberByParamJsonFile(path, 'email', email);
    return find[0];
}
export async function findMemberById(id) {
    const find = await findMemberByParamJsonFile(path, 'id', id);
    return find[0];
}

export default {
    createUser,
    hashPassword,
    checkMemberByEmail,
    checkMemberById,
    findMemberByEmail,
    findMemberById,
    encrypt,
    decrypt,
}