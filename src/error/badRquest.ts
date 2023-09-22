import { baseError } from "./Error";

export class badRequest extends baseError{
    constructor(
        message: string = 'Pedido Inválido.'
    ){
        super(400, message)
    }
}