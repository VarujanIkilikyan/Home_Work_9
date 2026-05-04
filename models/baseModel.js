import fs from 'fs/promises';
import path from 'path';

export function pathCreate(...FileName) {
    return path.resolve(...FileName);
}

export async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

export async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading file: ${error.message}`);
    }
}

export async function writeJsonFile(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (error) {
        throw new Error(`Error writing file: ${error.message}`);
    }
} 

export async function addMemberJsonFile(filePath, newData) {
    try {
        const currentData = await readJsonFile(filePath);
        const updatedData = [...currentData, newData];
        await writeJsonFile(filePath, updatedData);
        return newData;
    } catch (error) {
        throw new Error(`Error appending to file: ${error.message}`);
    }
}

export async function checkMemberByParamJsonFile(filePath, keyName, searchValue) {
    try {
        const currentData = await readJsonFile(filePath);

        if (!Array.isArray(currentData)) {
            throw new Error('Data in file is not an array');
        }

      return !!(currentData.find(Member => Member[keyName] === searchValue));
    } catch (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}

export async function findMemberByParamJsonFile(filePath, keyName, searchValue) {
    try {
        const currentData = await readJsonFile(filePath);

        if (!Array.isArray(currentData)) {
            throw new Error('Data in file is not an array');
        }
        if(searchValue === true){
            return currentData;
        }

        const filteredMembers = currentData.filter(member =>

            member.hasOwnProperty(keyName) && member[keyName] === searchValue
        );

        return filteredMembers;
    } catch (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}

export async function deleteMemberJsonFile(filePath, keyName, searchValue) {
    try {
        const currentData = await readJsonFile(filePath);

        if (!Array.isArray(currentData)) {
            throw new Error('Data in file is not an array');
        }

        const filteredMembers = currentData.filter(member =>
            !member.hasOwnProperty(keyName) || member[keyName] !== searchValue
        );
        await writeJsonFile(filePath, filteredMembers);


    } catch (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}



