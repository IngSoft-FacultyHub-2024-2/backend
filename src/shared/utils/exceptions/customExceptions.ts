class DataBaseError extends Error {
    constructor(message: string) {
        super(message)
    }
}

class ResourceNotFound extends Error {
    constructor(message: string) {
        super(message)
    }
}

export { DataBaseError, ResourceNotFound }