const express = require('express');
const app = express();
const port = 5000;
const MainRouter = require('./Router/MainRoute');
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static('public'));
app.use(express.static('/images'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

app.use(cookieparser("AbcEdfGJH"));
app.use(
  session({
    secret: "AbcEdfGJH",
    saveUninitialized: true,
    resave: false,
  })
);
app.use(flash());

app.use(MainRouter);

app.use((req ,res) =>{
    res.send("Page Note Found");
})

app.listen(port);