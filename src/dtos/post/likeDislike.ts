import z from "zod"

export interface likeDislikeDTO{
    idPost: string,
    token:string,
    like: boolean
}

export type LikeDislikeOutDTO = undefined

export const LikeDislikeSchema = z.object({
    idPost: z.string().min(2),
    token: z.string().min(2),
    like: z.boolean()
}).transform(data => data as likeDislikeDTO)