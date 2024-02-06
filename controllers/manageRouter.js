const manageRouter = require('express').Router()
const DeptStudent = require("../models/deptstudent");
const Examhall = require("../models/examhall")
const Exam = require("../models/exam")
//student/

manageRouter.get('/student/',async(req,res) =>{

    const allStudents =  await DeptStudent.find({});

    return res.status(200).json(allStudents).send();
})

/*
Add Student
dept = string
rollno = int
sem = int
*/
manageRouter.post('/student/', async(req,res) => {

    const givendept = req.body.dept;
    const givensem = parseInt(req.body.sem);
    const grollno = parseInt(req.body.rollno);

    var getDept = await DeptStudent.find({dept: givendept,sem: givensem});
    console.log(getDept.length);
    console.log(grollno);
    var rs = null;
    if (getDept.length < 1){
        const newdept = new DeptStudent({
            dept: givendept,
            sem: givensem,
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
 * sem : int
 * rollno = int
 */

manageRouter.delete('/student/',async(req,res)=>{

    var getDept = await DeptStudent.find({dept: req.body.dept, sem: req.body.sem})
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


/**
 * Exam Halls
 */

manageRouter.get("/hall/", async(req,res)=>{

    const ret = await Examhall.find({});

    return res.status(200).json(ret).send();
})

/**
 * Add halls
 * roomno: string
 * capacity: int
 */
manageRouter.post("/hall/", async(req,res)=>{

    const checkHalls = await Examhall.find({roomnumber: req.body.roomno})

    if (checkHalls.length > 0){
        return res.status(400).json({"err":"Hall Already exists"}).send()
    }

    const newHall = new Examhall({
        roomnumber: req.body.roomno,
        capacity: parseInt(req.body.capacity),
        bookedon: null
    })

    const ret = await newHall.save();

    return res.status(200).json(ret).send()
})

/**
 * Delete halls
 * roomno: string
 */
manageRouter.delete("/hall/", async(req,res)=>{

    const checkHalls = await Examhall.find({roomnumber: req.body.roomno})

    if (checkHalls.length == 0){
        return res.status(400).json({"err":"Hall does not exist"}).send()
    }

    const ret = await Examhall.findOneAndDelete({roomnumber: req.body.roomno})

    return res.status(200).json(ret).send();
})

/**
 * Examination
 */

manageRouter.get("/exam/", async(req,res)=>{

    const checkExams = await Exam.find({});

    return res.status(200).json(checkExams).send();
})

/**
 * Add Examination
 * subject : string
 * sem : int
 * dept : string
 */

manageRouter.post("/exam/", async(req,res)=>{

    const g_sub = req.body.subject;
    const g_sem = parseInt(req.body.sem)
    const g_dept = req.body.dept;

    const checkExams = await Exam.find({subject: g_sub, sem: g_sem, dept: g_dept})

    if (checkExams.length > 0){
        return res.status(400).json({"err":"Exam already registered"}).send()
    }

    const newExam = new Exam({
        subject: g_sub,
        sem: g_sem,
        dept: g_dept
    })

    const ret = await newExam.save();
  return res.status(200).json(ret).send()
})

/**
 * Delete Exam
 * subject: string
 * sem: int
 * dept: string
 */

manageRouter.delete("/exam/", async(req,res)=>{

    const ret = await Exam.findOneAndDelete({subject: req.body.subject, sem: parseInt(req.body.sem), dept: req.body.dept})

    if (ret == null){
        return res.status(400).json({"err":"Exam does not exist"}).send()
    }

    return res.status(200).json(ret).send()
})

module.exports =  manageRouter