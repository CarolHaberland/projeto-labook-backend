import { POST_LIKE, PostsDB, likeDislikeDB } from "../models/post";
import { Database } from "./DataBase";



export class postDataBase extends Database {
    public static TABLE_NAME = 'posts';
    public static TABLE_LIKES_DISLIKES = 'likes_dislikes'
    public async addPost(newPost: PostsDB) {
        await Database.connection(postDataBase.TABLE_NAME).insert(newPost)
    }
    
    
    public async getPost () : Promise<PostsDB[]>{
        const data : PostsDB[] = await Database.connection(postDataBase.TABLE_NAME)
        return data
    }

    public async updatePost (postDB : PostsDB){
        await Database.connection(postDataBase.TABLE_NAME).update(postDB).where({id: postDB.id})
    }

    public async findPostById(idEdit: string): Promise <PostsDB | undefined>{
        const [PostsDB]: PostsDB[] | undefined[] = await Database.connection(postDataBase.TABLE_NAME).where({id: idEdit});
        return PostsDB
    }
    
    public async deletePostById(idDelete: string) {
        await Database
          .connection(postDataBase.TABLE_NAME)
          .delete()
          .where({ id: idDelete })
    }

    public findLikeDislike = async (
        likeDislikeDB: likeDislikeDB
      ): Promise<POST_LIKE | undefined> => {
    
        const [result]: Array<likeDislikeDB | undefined> = await Database
          .connection(postDataBase.TABLE_LIKES_DISLIKES)
          .select()
          .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id
          })
    
        if (result === undefined) {
          return undefined
    
        } else if (result.like === 1) {
          return POST_LIKE.ALREADY_LIKED
          
        } else {
          return POST_LIKE.ALREADY_DISLIKED
        }
      }

      public removeLikeDislike = async (
        likeDislikeDB: likeDislikeDB
      ): Promise<void> => {
        await Database
          .connection(postDataBase.TABLE_LIKES_DISLIKES)
          .delete()
          .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id
          })
      }

      public updateLikeDislike = async (
        likeDislikeDB: likeDislikeDB
      ): Promise<void> => {
        await Database
          .connection(postDataBase.TABLE_LIKES_DISLIKES)
          .update(likeDislikeDB)
          .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id
          })
      }

      public insertLikeDislike = async (
        likeDislikeDB: likeDislikeDB
      ): Promise<void> => {
        await Database
          .connection(postDataBase.TABLE_LIKES_DISLIKES)
          .insert(likeDislikeDB)
      }


   
}

