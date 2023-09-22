import { postDataBase } from "../database/postDatabase";
import { userDatabase } from "../database/userDataBase";
import { CreatePostOutputDTO, createPostDTO } from "../dtos/post/create";
import { DeletePostOutDTO, deletePostDTO } from "../dtos/post/delete";
import { EditPostOutDTO, editPostDTO } from "../dtos/post/edit";
import { GetPostDTO, getPostDTO } from "../dtos/post/get";
import { LikeDislikeOutDTO, likeDislikeDTO } from "../dtos/post/likeDislike";
import { badRequest } from "../error/badRquest";
import { notFound } from "../error/notFound";
import { POST_LIKE, Posts, likeDislikeDB } from "../models/post";
import { USER_ROLES } from "../models/users";
import { idGenerator } from "../service/idGenerator";
import { tokenManager } from "../service/tokenManager";

export class PostsBusiness {
    constructor(
      public postsDatabase: postDataBase,
      private idGenerator: idGenerator,
      private tokenManager: tokenManager,
      public userDatabase: userDatabase
    ) {}
    public createPost = async (
      input: createPostDTO
    ): Promise<CreatePostOutputDTO> => {
      const { content, token } = input;
      const payload = this.tokenManager.getPayLoad(token);
      if (!payload) {
        throw new badRequest("token inválido");
      }
  
      const id = this.idGenerator.generatorId();
  
      const newPost = new Posts(
        id,
        payload.id,
        content,
        0,
        0,
        new Date().toISOString(),
        new Date().toISOString(),
      );
  
      const newPostToDB = newPost.toDBModel();
  
      await this.postsDatabase.addPost(newPostToDB);
  
      const output: CreatePostOutputDTO = undefined;
  
      return output;
    };
  
    public getPost = async (
      input: getPostDTO
    ): Promise<GetPostDTO> => {
      const { token } = input;
  
      const payload = this.tokenManager.getPayLoad(token);
  
      if (!payload) {
        throw new badRequest("token inválido");
      }
  
      const postsDB = await this.postsDatabase.getPost();
  
      const getPosts = postsDB.map((postsDB) => {
        const post = new Posts(
          postsDB.id,
          postsDB.creator_id,
          postsDB.content,
          postsDB.likes,
          postsDB.dislikes,
          postsDB.created_at,
          postsDB.updated_at
        );
        return post.toBusinessModel();
      });
  
      const getPostCreatorId = getPosts.map((post) => post.creatorId);
  
      const userName: any = [];
  
      for (let i = 0; i < getPostCreatorId.length; i++) {
        const result = await this.userDatabase.returnUserName(
          getPostCreatorId[i]
        );
  
        userName.push(result);
      }
  
      const post = getPosts.map((post, index) => {
        const postModel = {
          id: post.id,
          content: post.content,
          likes: post.likes,
          dislikes: post.dislike,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          creator: {
            id: post.creatorId,
            name: userName[index],
          },
        };
        return postModel;
      });
  
      const output: GetPostDTO = post;
  
      return output;
    };
  
    public editPosts = async (
      input: editPostDTO
    ): Promise<EditPostOutDTO> => {
      const { idToEdit, content, token } = input;
  
      const payload = this.tokenManager.getPayLoad(token);
      if (!payload) {
        throw new badRequest("token inválido");
      }
  
      const postToEditDB = await this.postsDatabase.findPostById(idToEdit);
  
      if (!postToEditDB) {
        throw new notFound("'id' não encontrado");
      }
  
      console.log(postToEditDB.creator_id)
      const updated_at = new Date().toISOString();
      const postsDB = await this.postsDatabase.getPost();
      const post = new Posts(
        postToEditDB.id,
        postToEditDB.creator_id,
        content,
        postToEditDB.likes,
        postToEditDB.dislikes,
        postToEditDB.created_at,
        updated_at
      );
      const updatePost = post.toDBModel();
  
     
  
      if (payload.id !== postToEditDB.creator_id) {
        throw new badRequest(
          "Você não tem permissão para editar esse post."
        );
      }
  
      await this.postsDatabase.updatePost(updatePost);
  
      const output: EditPostOutDTO = undefined;
      return output;
    };
  
  
  
  
    public deletePost = async (
      input: deletePostDTO
    ): Promise<DeletePostOutDTO> => {
      const { idToDelete, token } = input;
  
      const payload = this.tokenManager.getPayLoad(token);
      if (!payload) {
        throw new badRequest("token inválido");
      }
  
      const postsDBFindById = await this.postsDatabase.findPostById(idToDelete);
  
      if (!postsDBFindById) {
        throw new badRequest("id não encontrado para deleção");
      }
  
      const postsDB = await this.postsDatabase.getPost();
  
      const postToDeleteDB = await this.postsDatabase.findPostById(idToDelete);
  
      if (!postToDeleteDB) {
        throw new notFound("id não encontrado");
      }
  
      const getPosts = postsDB.map((postsDB) => {
        const post = new Posts(
          postsDB.id,
          postsDB.creator_id,
          postsDB.content,
          postsDB.likes,
          postsDB.dislikes,
          postsDB.created_at,
          postsDB.updated_at
        );
        return post.toBusinessModel();
      });
  
      
  
      if (payload.id !== postToDeleteDB.creator_id) {
        if (payload.role !== USER_ROLES.ADMIN) {
          throw new badRequest(
            "Você não tem permissão para postar."
          );
        }
      }
      
      await this.postsDatabase.deletePostById(idToDelete);
  
      const output: DeletePostOutDTO = undefined;
  
      return output;
    };
  
     public likeDislikePost = async (input:likeDislikeDTO):Promise<LikeDislikeOutDTO>=>{
      const {idPost, token , like}= input
  
      const payLoad = this.tokenManager.getPayLoad(token)
  
      if(!payLoad) {
        throw new badRequest('Token inválido')
      }
      const postDB =  await this.postsDatabase.findPostById(idPost)
  
      if(!postDB){
        throw new notFound('Post não encontrado')
      }
    
  
      const post = new Posts(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at
      )
      
      const likeSQlite = like ? 1 : 0;
  
      const likeDislikeDB: likeDislikeDB= {
        user_id: payLoad.id,
        post_id: idPost,
        like: likeSQlite,
      };
    
      const likeDislikeExists =
        await this.postsDatabase.findLikeDislike(likeDislikeDB);
    
      if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
        if (like) {
          await this.postsDatabase.removeLikeDislike(likeDislikeDB);
          post.removeLike();
        } else {
          await this.postsDatabase.updateLikeDislike(likeDislikeDB);
          post.removeLike();
          post.addDislikes();
        }
      } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
        if (like === false) {
          await this.postsDatabase.removeLikeDislike(likeDislikeDB);
          post.removeDislikes();
        } else {
          await this.postsDatabase.updateLikeDislike(likeDislikeDB);
          post.removeDislikes();
          post.addLike();
        }
      } else {
        await this.postsDatabase.insertLikeDislike(likeDislikeDB);
        like ? post.addLike() : post.addDislikes();
      }
    
      const updatedPostDB = post.toDBModel();
      await this.postsDatabase.updatePost(updatedPostDB);
    
      const output: LikeDislikeOutDTO= undefined;
    
      return output;
  
    } 
  
    
  }