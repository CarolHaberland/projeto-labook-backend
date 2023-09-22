import { baseError } from "./Error";


export class notFound extends baseError{
    constructor(
        message: string = 'Nao encontrado'
    ){
        super(400, message)
    }
}