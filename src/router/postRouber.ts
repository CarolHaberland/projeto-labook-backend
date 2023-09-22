import express from "express";
import { PostsController } from "../controller/postConstroller";
import { PostsBusiness } from "../business/postBusiness";
import { idGenerator } from "../service/idGenerator";
import { tokenManager } from "../service/tokenManager";
import { userDatabase } from "../database/userDataBase";
import { postDataBase } from "../database/postDatabase";

export const postsRouter = express.Router();
const postsController = new PostsController(
  new PostsBusiness(
    new postDataBase(),
    new idGenerator(),
    new tokenManager(),
    new userDatabase()
  )
);
postsRouter.post("/", postsController.createPost);
postsRouter.get("/", postsController.getPosts);
postsRouter.put("/:id", postsController.editPosts);
postsRouter.delete("/:id", postsController.deletePost);
postsRouter.put("/:id/like", postsController.likeDislike)