const manageRouter = require('express').Router()
const DeptStudent = require("../models/deptstudent");
const Examhall = require("../models/examhall")
const Exam = require("../models/exam")
const Examhallnew = require("../models/examhallnew")



const max = (a,b) =>{

    if (a>b){
        return a;
    }
    return b;
}


//student/
manageRouter.get('/user/',async(req,res)=>{
    const users = [
        {
            username:"abcd",
            password:"123"
        }
    ]
    return res.status(200).json(users).send()
})

manageRouter.post('/user/',async(req,res)=>{
    const users = [
        {
            username:'abcd',
            password:'123'
        }
    ]
    console.log(users[0].username == req.body.username);

    var crt = users.filter((each) =>{ return each.username == req.body.username && each.password == req.body.password})
    console.log(crt);
    if (crt.length >= 1){
        return res.status(200).json({login:true}).send();
    }
    return res.status(200).json({login:false}).send();
})

manageRouter.get('/student/',async(req,res) =>{

    const allStudents =  await DeptStudent.find({});

    return res.status(200).json(allStudents);
})

/*
Add Student
dept = string
rollno = string array
sem = int
*/
manageRouter.post('/student/', async(req,res) => {

    const givendept = req.body.dept;
    var givensem = req.body.sem;
    const grollno = req.body.rollnos;

    if (givensem){
        givensem = 1
    }

    var getDept = await DeptStudent.find({dept: givendept});
    console.log(getDept.length);
    console.log(grollno);
    var rs = null;
    if (getDept.length < 1){
        const newdept = new DeptStudent({
            dept: givendept,
            sem: givensem,
            total: 1,
            use: false,
            rollnos: grollno
        })

        var rs = await newdept.save();
    }else{
        getDept = getDept[0];
        
        getDept.rollnos = grollno;

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

    var getDept = await DeptStudent.find({dept: req.body.dept})
    var ret = null;
    if (getDept.length < 1){
        return res.status(200).json({"err":"Invalid Dept"}).send();
    }else{
        //const ind = getDept.rollnos.indexOf(parseInt(req.body.rollno));


        ret = await DeptStudent.findOneAndDelete({dept: req.body.dept});
    }

    return res.status(200).json(ret).send();
})


/**
 * Exam Halls
 */

manageRouter.get("/hall/", async(req,res)=>{

    var gpreset = parseInt(req.body.preset);

    if (gpreset == null){
        gpreset = 0;
    }

    const ret = await Examhall.find({});

    return res.status(200).json(ret);
})

manageRouter.get("/hallnew/", async(req,res)=>{

    var gpreset = parseInt(req.body.preset);

    if (gpreset == null){
        gpreset = 0;
    }

    const ret = await Examhallnew.find({});

    return res.status(200).json(ret);
})

/**
 * Add halls
 * roomno: string
 * single: Integer
 * doubel: Integer
 */
manageRouter.post("/hall/", async(req,res)=>{

    const checkHalls = await Examhall.find({roomno: req.body.roomno})

    if (checkHalls.length > 0){
        return res.status(400).json({"err":"Hall Already exists"}).send()
    }

    var newbenches = [];

    for(var i=0;i<parseInt(req.body.single); i++ ){
        newbenches.push([{dept:"",rollno:"",selected:false}])
    }
    for(var i=0;i<parseInt(req.body.double);i++){
        newbenches.push([{dept:"",rollno:"",selected:false},{dept:"",rollno:"",selected:false}])
    }

    const newHall = new Examhall({
        roomno: req.body.roomno,
        capacity: 1,
        preset: null,
        single: parseInt(req.body.single),
        double: parseInt(req.body.double),
        use: false,
        benches: newbenches
    })

    const ret = await newHall.save();

    return res.status(200).json(ret).send()
})

manageRouter.post("/hallnew/", async(req,res)=>{

    const checkHalls = await Examhallnew.find({roomno: req.body.roomno})

    if (checkHalls.length > 0){
        //return res.status(400).json({"err":"Hall Already exists"}).send()
        const trash = await Examhallnew.findOneAndDelete({roomno: req.body.roomno})
    }

    var cnt = 0;
    var col = 0;
    var lims = 0;
    
    var newbenches = req.body.benches.slice

    newbenches.forEach((each)=>{
        col = max(col,each.length)
        each.forEach((bench)=>{
            lims = max(lims,bench.length)
            if (bench.length > 0){
                cnt += 1
            }
        })
    })


    const newHall = new Examhallnew({
        roomno: req.body.roomno,
        capacity: cnt,
        rows: newbenches.length,
        cols: col,
        lim:lims,
        use: false,
        benches: newbenches
    })

    const ret = await newHall.save();

    return res.status(200).json(ret).send()
})

/**
 * Delete halls
 * roomno: string
 */
manageRouter.delete("/hall/", async(req,res)=>{

    const checkHalls = await Examhall.find({roomno: req.body.roomno})

    if (checkHalls.length == 0){
        return res.status(400).json({"err":"Hall does not exist"}).send()
    }

    const ret = await Examhall.findOneAndDelete({roomno: req.body.roomno})

    return res.status(200).json(ret).send();
})
manageRouter.delete("/hallnew/", async(req,res)=>{

    console.log(req.body)
    const checkHalls = await Examhallnew.find({roomno: req.body.roomno})
    if (checkHalls.length == 0){
        return res.status(400).json({"err":"Hall does not exist"}).send()
    }

    const ret = await Examhallnew.findOneAndDelete({roomno: req.body.roomno})

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