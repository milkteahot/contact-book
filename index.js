var express = require("express");
var mongoose = require("mongoose");
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

//port setting
var port = process.env.PORT || 3000; //port값 설정되어 있지 않다면 3000사용.
app.listen(3000, function() {
    console.log("server on! http://localhost:"+port);
});

