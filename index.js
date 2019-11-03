var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); //body-parser module을 bodyParser 변수에 담는다.
var app = express();

require('dotenv').config(); // .env파일에서 환경변수 불러오기

//DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI);

var db = mongoose.connection;

db.once("open", function() {
    console.log("DB connected");
});

db.on("error", function(err) {
    console.log("DB ERROR: ", err);
});

//Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json()); //form data를 req.body에 옮겨 담는다. json data
app.use(bodyParser.urlencoded({extended:true})); 

//DB schema //db에서 사용할 schema object 생성.
var contactSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true}, //required:값이 반드시 입력되어야 함, unique:중복x
    email:{type:String},
    phone:{type:String}
});
var Contact = mongoose.model("contact", contactSchema); //model 생성

//Routes
//Home
app.get("/", function(req,res) {
    res.redirect("/contacts");
});

//Contacts-Index
app.get("/contacts", function(req,res){
    Contact.find({}, function(err,contacts){ //모델.find(검색조건, 콜백함수) {}=검색조건없음으로 모델의 모든데이터 리턴.
        if(err) return res.json(err);
        res.render("contacts/index", {contacts:contacts});
    });
});

//Contacts-New
app.get("/contacts/new", function(req,res){
    res.render("contacts/new");
});

//Contacts-create
app.post("/contacts", function(req,res){ //contacts/new 에서 폼을 전달받는 경우
    Contact.create(req.body, function(err, contact){ //인자 첫번째로 생성할 data의 object를 받고, 두번째로 인자의 콜백함수 받음
        if(err) return res.json(err);
        res.redirect("/contacts");
    });
});

//port setting
var port = process.env.PORT || 3000; //port값 설정되어 있지 않다면 3000사용.
app.listen(3000, function() {
    console.log("server on! http://localhost:"+port);
});

