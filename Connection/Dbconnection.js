const mysql = require('mysql');

const Connection = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"",
    database:"act_db1"
});
Connection.connect(()=>{
    console.log("Connected Database");
})

module.exports = Connection;