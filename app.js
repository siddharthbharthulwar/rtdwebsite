var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
    //properties...
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampleDB'
});

connection.connect(function(error) {

    //callback
    if (!!error) {
        console.log('Error');
    }
    else{
        console.log('connected');
    }
});

app.get('/', function(req, resp) {

    //about mysql
    connection.query("SELECT * FROM sampleDB", function(error, rows, fields){

        //callback function
        if (!!error)
        {
            console.log("Error in query");
        }
        else{

            console.log('successful query');
        }

    });


});

app.listen(1337);