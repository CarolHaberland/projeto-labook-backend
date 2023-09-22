import z from "zod";

export interface deletePostDTO {
  idToDelete: string;
  token: string
}

export type DeletePostOutDTO = undefined

export const deletePostSchema = z
  .object({
    idToDelete: z.string().min(2),
    token: z.string().min(2)
  })
  .transform((data) => data as deletePostDTO);