class HTTPError extends Error{
    constructor(messege,statusCode) {
        super(messege);
        this.name = 'HTTP_ERROR'
        this.statusCode = statusCode
        this.messege = messege
    }
    
}

export default HTTPError