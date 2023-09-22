import { Request, Response } from "express";
import { PostsBusiness } from "../business/postBusiness";
import { createPostSchema } from "../dtos/post/create";
import { ZodError } from "zod";
import { baseError } from "../error/Error";
import { GetPostsSchema } from "../dtos/post/get";
import { EditPostSchema } from "../dtos/post/edit";
import { deletePostSchema } from "../dtos/post/delete";
import { LikeDislikeSchema } from "../dtos/post/likeDislike";




export class PostsController {
    constructor(private postsBusiness: PostsBusiness) {}
    public createPost = async (req: Request, res: Response): Promise<void> => {
      try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Token de autorização ausente");
        }
        const token = authorizationHeader;
    
        const input = createPostSchema.parse({
          content: req.body.content,
          token: token 
        });
    
        const result = await this.postsBusiness.createPost(input);
        res.status(200).send(result);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message);
        } else {
          res.status(500).send("Erro Inesperado");
        }
      }
    };
    public getPosts = async (req: Request, res: Response): Promise<void> => {
      try {
        
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Token de autorização ausente");
        }
        const token = authorizationHeader;
    
        const input = GetPostsSchema.parse({
          token: token 
        });
    
        const output = await this.postsBusiness.getPost(input);
        res.status(200).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message);
        } else {
          res.status(500).send("Erro Inesperado");
        }
      }
    };
    public editPosts = async (req: Request, res: Response): Promise<void> => {
      try {
       
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Token de autorização ausente");
        }
    
     
        const token = authorizationHeader;
    
        const input = EditPostSchema.parse({
          idToEdit: req.params.id,
          content: req.body.content,
          token: token 
        });
    
        const output = await this.postsBusiness.editPosts(input);
    
        res.status(200).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message);
        } else {
          res.status(500).send("Erro Inesperado");
        }
      }
    };
  
    public deletePost = async (req: Request, res: Response): Promise<void> => {
      try {
  
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Token de autorização ausente");
        }
        const token = authorizationHeader

        const input = deletePostSchema.parse({
          idToDelete: req.params.id,
          token: token 
        });
    
        const output = await this.postsBusiness.deletePost(input);
    
        res.status(200).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message);
        } else {
          res.status(500).send("Erro Inesperado");
        }
      }
    };
  
    public likeDislike = async (req: Request, res: Response): Promise<void> => {
      try {
        
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          throw new Error("Token de autorização ausente");
        }
    
        
        const token = authorizationHeader.split(" ")[1];
    
        const input = LikeDislikeSchema.parse({
          idPost: req.params.id,
          token: token, 
          like: req.body.like
        });
    
        const output = await this.postsBusiness.likeDislikePost(input);
    
        res.status(201).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message);
        } else {
          res.status(500).send("Erro Inesperado");
        }
      }
    }
}