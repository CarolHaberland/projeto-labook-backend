import z from "zod";

export interface editPostDTO {
  idToEdit: string;
  content: string,
  token: string
}

export type EditPostOutDTO = undefined

export const EditPostSchema = z
  .object({
    idToEdit: z.string().min(4),
    content: z.string().min(4),
    token: z.string().min(4)
  })
  .transform((data) => data as editPostDTO);