const manageRouter = require('express').Router()
const DeptStudent = require("../models/deptstudent");
//student/

manageRouter.get('/student/',async(req,res) =>{

    const allStudents =  await DeptStudent.find({});

    return res.status(200).json(allStudents).send();
})

/*
Add Student
dept = string
rollno = int
*/
manageRouter.post('/student/', async(req,res) => {

    const givendept = req.body.dept;
    const grollno = parseInt(req.body.rollno);

    var getDept = await DeptStudent.find({dept: givendept});
    console.log(getDept.length);
    console.log(grollno);
    var rs = null;
    if (getDept.length < 1){
        const newdept = new DeptStudent({
            dept: givendept,
            total: 1,
            rollnos: [grollno]
        })

        var rs = await newdept.save();
    }else{
        getDept = getDept[0];
        getDept.total += 1;

        if (getDept.rollnos.includes(grollno)){
            return res.status(200).json({"err":"Already present"}).send()
        }

        getDept.rollnos.push(grollno);

        var rs = await getDept.save();

    }
    console.log(rs);
    return res.status(200).json(rs).send();
})

/**
 * delete student rollno
 * dept = string
 * rollno = int
 */

manageRouter.delete('/student/',async(req,res)=>{

    var getDept = await DeptStudent.find({dept: req.body.dept})
    var ret = null;
    if (getDept.length < 1){
        return res.status(200).json({"err":"Invalid Dept"}).send();
    }else{
        getDept = getDept[0]
        const ind = getDept.rollnos.indexOf(parseInt(req.body.rollno));

        if(ind == -1){
            return res.status(200).json({"err":"Rollno does not exist"}).send();
        }
        
        getDept.total -= 1;
        getDept.rollnos.splice(ind,1)

        ret = await getDept.save();
    }

    return res.status(200).json(ret).send();
})


module.exports =  manageRouter