import z from "zod";


export interface createPostDTO {
  content: string;
  token: string;
  likes: number;
  deslikes: number;
}

export type CreatePostOutputDTO = undefined

export const createPostSchema = z.object({
  content: z.string(),
  token: z.string(),
}).transform(data => data as createPostDTO)

