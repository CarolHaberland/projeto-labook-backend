import z from "zod"
import { GetPostsModel } from "../../models/post"


export interface getPostDTO {
  token:string
}

export type GetPostDTO = GetPostsModel[];

export const GetPostsSchema = z.object({
  token: z.string().min(2)
}).transform(data => data as getPostDTO)
