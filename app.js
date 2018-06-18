//Server core functions
var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var app = express();
///
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/client.html", function (req, res) {
    res.sendFile(__dirname + "/client.html");
});

//Server basic function
var handler = function(req, res) {
    fs.readFile('./client.html', function (err, data) {
        if(err) throw err;
        res.writeHead(200);
        res.end(data);
    });
}

var POST = process.env.PORT||8080;
var server = http.createServer(app).listen(POST, function() {
  console.log('start connection', POST);
});

//old Part to connection.When it works,we dont need this part
// var app = require('http').createServer(handler);
// var io = require('socket.io').listen(app);
// var fs = require('fs');
// var port = 3333;
// app.listen(port);
// console.log("Server is running on port 3333");

//Game
var canvasWidth = 480;
var canvasHeight = 620;
var calcSwitch = false;
var scoreBlue = 0;
var scoreRed = 0;
//ball
var ballRadius = 10;
var x = 240 //canvas.width/2;
var y = 290 //canvas.height-30;
var dx = 2;
var dy = -2;
//paddle1
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvasWidth-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
//paddle2
var paddleHeight2 = 10;
var paddleWidth2 = 75;
var paddleX2 = (canvasWidth-paddleWidth2)/2;
var rightPressed2 = false;
var leftPressed2 = false;

function calculate() {
    if(calcSwitch==true){
        //ball
        if(x + dx > canvasWidth-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        else if(y + dy < ballRadius) {//oben red
            if(x > paddleX2 && x < paddleX2 + paddleWidth2) {
            dy = -dy;
                if(dy>0){
                    dy += 0.5;
                }else{
                    dy -= 0.5;
                }
            }
            else{
                scoreBlue += 1;
                io.sockets.emit("renewScore",{ scoreBlue:scoreBlue, scoreRed:scoreRed } );
                if(scoreBlue==3){
                    calcSwitch=false;
                    x=500; //ball goes out from the canvas
                    io.sockets.emit("showForm");
                }
                else{
                    x=240;y=290;dy=-2;
                }
            }
        }
        else if(y + dy > canvasHeight-ballRadius) {//unten blue
            if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
                if(dy>0){
                    dy += 0.5;
                }else{
                    dy -= 0.5;
                }
            }
            else{
                scoreRed += 1;
                io.sockets.emit("renewScore",{ scoreBlue:scoreBlue, scoreRed:scoreRed } );
                if(scoreRed==3){
                    calcSwitch=false;
                    x=500; //ball goes out from the canvas
                    io.sockets.emit("showForm");
                }
                else{
                    x=240;y=290;dy=-2;
                }
            }
        }
        x += dx;
        y += dy;

        //paddle
        if(rightPressed && paddleX < canvasWidth-paddleWidth) {
            paddleX += 5;
        }
        if(leftPressed && paddleX > 0) {
            paddleX -= 5;
        }
        if(rightPressed2 && paddleX2 < canvasWidth-paddleWidth2) {
        paddleX2 += 5;
        }
        if(leftPressed2 && paddleX2 > 0) {
        paddleX2 -= 5;
        }
    }

}
//timer=setInterval(calculate, 10);
setInterval(calculate, 10);

//sockets
io.sockets.on('connection', function (socket) {
    console.log('someone connected')
    io.sockets.emit("hideForm");

    //to initialize ball&paddle coordinates
    socket.on("getCoordinates",function(){
        io.sockets.emit("setCoordinates",{ positionX:x,positionY:y,paddleX:paddleX,paddleX2:paddleX2 } );
    });

    //Control paddles
    socket.on("rightKeyDown",function(){
        console.log("rightKey is pressed");
        rightPressed = true;
    });
    socket.on("leftKeyDown",function(){
        console.log("leftKey is pressed");
        leftPressed = true;
    });
    socket.on("rightKeyUp",function(){
        console.log("rightKey is released");
        rightPressed = false;
    });
    socket.on("leftKeyUp",function(){
        console.log("leftKey is released");
        leftPressed = false;
    });

    socket.on("rightKeyDown2",function(){
        console.log("D is pressed");
        rightPressed2 = true;
    });
    socket.on("leftKeyDown2",function(){
        console.log("A is pressed");
        leftPressed2 = true;
    });
    socket.on("rightKeyUp2",function(){
        console.log("D is released");
        rightPressed2 = false;
    });
    socket.on("leftKeyUp2",function(){
        console.log("A is released");
        leftPressed2 = false;
    });

    //buttons
    socket.on("getStart",function(){
        console.log("Start Button is pressed");
        calcSwitch=true;
        io.sockets.emit("setStart",{ scoreBlue:scoreBlue, scoreRed:scoreRed } );
    });
    socket.on("getPause",function(){
        console.log("Pause Button is pressed");
        calcSwitch=false;
        io.sockets.emit("setPause");
    });
    socket.on("getReset",function(){
        console.log("Reset Button is pressed");
        scoreBlue = 0; scoreRed = 0;
        io.sockets.emit("renewScore",{ scoreBlue:scoreBlue, scoreRed:scoreRed } );
        io.sockets.emit("hideForm");
        x=240;y=290;dy=-2;
        calcSwitch=true;
    });

});


io.on("disconnect", function (socket) {
    console.log('someone disconnected')
});
