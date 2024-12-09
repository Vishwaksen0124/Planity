const routeNotFound = (req,res,next)=>{
    const error = new Error(`Route not found :${req.originalUrl}`);
    res.status(404);
    next(error);

};

const errorHandler = (err,req,res,next)=>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if(err.name === "CastError" && err.kind ==="ObjectId"){
        statusCode = 404;
        err.message = "Resource not found";
    }
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

export {routeNotFound, errorHandler};