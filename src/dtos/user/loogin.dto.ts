import z from "zod"

export interface loginInputDTO {
  email: string,
  password: string
}

export interface LoginOutputDTO {
  message: string,
  token: string
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
}).transform(data => data as loginInputDTO)