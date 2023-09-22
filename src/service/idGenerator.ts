import { v4 } from 'uuid'

export class idGenerator {
    public generatorId(): string {
        return v4()
    }
}