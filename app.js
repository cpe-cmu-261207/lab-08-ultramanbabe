const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

//to post you must use bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.end(fs.readFileSync("./instruction.html"));
});

function GPA(){
  let gpax = mycourse.courses.map(courses => {
    return {
      gpa : Number(courses.gpa) * Number(courses.credit),
      credit : Number(courses.credit)
    }
  }).reduce((sum,courses)=>{
    return{
      gpa: courses.gpa + sum.gpa,
      credit : courses.credit + sum.credit
    }

  },{gpa:0,credit:0})
  mycourse.gpax = (gpax.gpa / gpax.credit).toFixed(2)
}

//implement your api here
const mycourse = require("./myCourses.json");
const { getPackedSettings } = require("http2");
app.get("/courses", (req, res) => {
  res.json({
    success: true,
    data: mycourse
  })
});

app.get("/courses/:id", (req, res) => {
  const { id } = req.params
  const findId = mycourse.courses.find(course => course.courseId === Number(id))
  if (findId) {
    res.status(200).json({
      success: true,
      data: findId
    })
  }
  else{
    res.status(404).json({
      succes: false,
      data: null
    })
  }

});

app.delete("/courses/:id",(req,res)=>{
  const FindID = mycourse.courses.findIndex(course => course.courseId === Number(req.params.id))
  if (FindID!==-1) {
    mycourse.courses.splice(FindID,1) //delete
    GPA()
    fs.writeFileSync('./myCourses.json',JSON.stringify(mycourse,null,4))
    res.status(200).json({
      success: true,
      data: mycourse
    })
  } else{
    res.json({
      success: true,
      data: mycourse
    })
  }
}

)

app.post("/addCourse",(req,res)=>{
  const Obj = Object.keys(req.body)
  if(Obj.length != 4){
    return res.status(422).json({
      success: false,
      error: "ใส่ข้อมูลไม่ครบ"
    })
  }else{
    mycourse.courses.push(req.body)
     GPA()
    fs.writeFileSync('./myCourses.json',JSON.stringify(mycourse,null,4))
    res.status(201).json({
      success: true,
      data: req.body
    })
  }
})


//follow instruction in http://localhost:8000/

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server started on port:${port}`));