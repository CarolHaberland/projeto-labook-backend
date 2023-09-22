
export abstract class baseError extends Error {
    statusCode(statusCode: any) {
        throw new Error("Method not implemented.");
    }
    constructor(
        public status:number,
        message: string = 'Pedido Inválido'
    ){
        super(message)
    }
}