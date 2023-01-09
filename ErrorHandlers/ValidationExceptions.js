class ValidationError extends Error{
    constructor(messege) {
        super(messege);
        this.name = 'VALIDATION_ERROR'
        this.messege = messege
        this.statusCode = 403
    }
    
}

export default ValidationError