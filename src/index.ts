import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { userRouter } from './router/userRouter'
import { postsRouter } from './router/postRouber'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT || 3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.use("/user", userRouter)
app.use("/post", postsRouter)