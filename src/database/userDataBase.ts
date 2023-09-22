import { UserDB } from "../models/users";
import { Database } from "./DataBase";


export class userDatabase extends Database {
    public static TABLE_USERS = 'users'

    public async findUser(name: string | undefined) : Promise<UserDB[]> {
        let userDB
        if (name) {
            const result : UserDB[] = await Database
            .connection(userDatabase.TABLE_USERS)
            .where('name', 'LIKE', `%${name}%`)
            userDB = result
        }else {
        const result: UserDB[] = await Database
            .connection(userDatabase.TABLE_USERS)
        userDB = result
        } 
        return userDB
    }

    public async returnUserName(id: string) : Promise<string> {
        const[userDB]: UserDB[] = await Database.connection(
            userDatabase.TABLE_USERS
        ).where({id})
        return userDB.name
    }

    public async returnUserId(id: string): Promise <string> {
        const [userDB] : UserDB[] = await Database.connection(
            userDatabase.TABLE_USERS
        ).where({id})
        return userDB.id
    }

    public async findUserByEmail(email: string): Promise <UserDB | undefined> {
        const [userDB] : UserDB [] | undefined [] = await Database
        .connection(userDatabase.TABLE_USERS)
        .where({email})
        return userDB
    }

    public async addUser(newUserDb: UserDB): Promise <void>{
        await Database.connection(userDatabase.TABLE_USERS).insert(newUserDb)                    
    }

}