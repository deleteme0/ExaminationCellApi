const seatingRouter = require('express').Router()
//seat/
seatingRouter.get('/',async(req,res) =>{

    return res.status(200).json({'yea':'hi'}).send();
}
)

module.exports =  seatingRouter