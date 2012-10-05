// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setInterval(callback, 1000/60);
        };
})();

// Initialization
$(function() {
    var w = $(window).width();
    var h = $(window).height();

    //fourth param is the "unit" size
    myMachine = new Machine('grid', w, h, 1);

    $('#grid').mousedown(function(e){
            if(myMachine.lock == false){
                changeCell(e, myMachine);
                myMachine.lock = true;
            }

    });

    toggleMenu();
    toggleText('contact');


});


function Machine(id, w, h, u) {

    var self = this;
    this.unit = u;
    this.pixelator = Math.round(Math.random() * 2);

    this.canvas = document.getElementById(id);

    this.lock = false;



    $(id).css("width", w + "px");
    $(id).css("height", h + "px");

     var ctx = this.canvas.getContext('2d');

    var imageObj = new Image();


    // clear the entire grid
/*    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, w, h);
    ctx.fill();*/

    //init grid
    this.grid = [];
    this.iternumber = 1;
    this.buildgrid(this.iternumber);

    //initialize at middle of canvas
    var middle = Math.round((this.canvas.height/2)/u);
    //var initCell = new Cell(0, middle, true, this);
    //this.grid[0][middle] = 1;
    var iteration = 0;
    var leftIteration = 0;
    //this.drawCell(0, middle, ctx);

    //animate(this, iteration, leftIteration);

    imageWidth = Math.round(this.canvas.width / 1.5);
    imageHeight = Math.round((748/1200) * imageWidth);
    imageX = Math.round(this.canvas.width / 6.5);
    imageY = Math.round(this.canvas.height / 6);
    imageObj.onload = function() {
        ctx.drawImage(imageObj, imageX, imageY, imageWidth, imageHeight);
    };
    imageObj.src = "media/images/pixelme.png";


}

function changeCell(e, myMachine) {
    var cell = getPosition(e, myMachine);
    var iteration = cell.x;
    var leftIteration = cell.x;

    this.canvas = document.getElementById('grid');
    var ctx = this.canvas.getContext('2d');
//
    myMachine.grid[cell.x][cell.y] = 1;
    myMachine.drawCell(cell.x, cell.y, ctx);

    //random rules
    var rules = [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()),
        Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())];



    //rule 30
    //var rules = [0, 1, 1, 1, 1, 0, 0, 0];

    animate(myMachine, iteration, leftIteration, rules);

   // alert("X: " + cell.x + " Y: " + cell.y);
}

function getPosition(e, myMachine) {

    //this section is from http://www.quirksmode.org/js/events_properties.html
    var targ;
    if (!e)
        e = window.event;
    if (e.target)
        targ = e.target;
    else if (e.srcElement)
        targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;

    // jQuery normalizes the pageX and pageY
    // pageX,Y are the mouse positions relative to the document
    // offset() returns the position of the element relative to the document
    var x = e.pageX - $(targ).offset().left;
    var y = e.pageY - $(targ).offset().top;

    var winXcorr = targ.scrollWidth / targ.width;
    var winYcorr = targ.scrollHeight / targ.height;

    var cell = new Cell(Math.round((x/(myMachine.unit))/winXcorr),Math.round((y/(myMachine.unit))/winYcorr), true, myMachine);
    return cell;
}



Machine.prototype = {

    drawCell: function(x, y, ctx) {

        /*var xshift = Math.round((this.canvas.width/2.6)/this.unit);*/
        var xshift = 0;

        ctx.beginPath();

        if (this.grid[x][y]) {
            ctx.fillStyle = 'black';
            ctx.fillRect((x + xshift) * this.unit, y * this.unit, this.unit, this.unit);
        } else {
            /*ctx.fillStyle = 'grey';*/
            ctx.clearRect((x + xshift) * this.unit, y * this.unit, this.unit, this.unit);
        }
        ctx.stroke();
    },


    //If not updating right, then updating left
    update: function (isRight, iteration, rules) {
        var ctx = this.canvas.getContext('2d');
        if(isRight){
            var lastRow = iteration;
            //update row
            var thisRow = ++iteration;
        } else {
            var lastRow = iteration;
            var thisRow = --iteration;
        }
        //Clear this row, so redraw won't show old lines
        ctx.clearRect ( thisRow, 0 , this.unit , this.canvas.height);

        for(var i = 1; i < Math.round((this.canvas.height)/this.unit); i++) {

            // 0 0 0
            if (!this.grid[lastRow][i-1] && !this.grid[lastRow][i] && !this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[0];
            }
            // 0 0 1
            if (!this.grid[lastRow][i-1] && !this.grid[lastRow][i] && this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[1];
            }
            // 0 1 0
            if (!this.grid[lastRow][i-1] && this.grid[lastRow][i] && !this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[2];
            }
            // 0 1 1
            if (!this.grid[lastRow][i-1] && this.grid[lastRow][i] &&  this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[3];
            }
            // 1 0 0
            if (this.grid[lastRow][i-1] && !this.grid[lastRow][i] && !this.grid[lastRow][i+1]){
                this.grid[thisRow][i] = rules[4];
            }
            // 1 0 1
            if (this.grid[lastRow][i-1] && !this.grid[lastRow][i] && this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[5];
            }
            // 1 1 0
            if (this.grid[lastRow][i-1] && this.grid[lastRow][i] && !this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[6];
            }
            // 1 1 1
            if (this.grid[lastRow][i-1] && this.grid[lastRow][i] && this.grid[lastRow][i+1]) {
                this.grid[thisRow][i] = rules[7];
            }

            this.drawCell(thisRow, i, ctx);
        }

    },

    buildgrid: function (iterNumber) {
        //build a large grid array for drawing purposes
        this.grid = new Array(Math.round(this.canvas.width/iterNumber)/this.unit);
        for(var i = 0; i < Math.round((this.canvas.width/iterNumber)/this.unit); i++) {
            this.grid[i] = new Array(Math.round(this.canvas.height)/this.unit);
            for(var j = 0; j < Math.round((this.canvas.height)/this.unit); j++) {
                this.grid[i][j] = 0;
            }
        }
    },

    fillRight: function () {
        var ctx = this.canvas.getContext('2d');
        var randfillCnt = Math.round(Math.random()*5) + 1;
        var cntTracker;
        var isFilled = Math.round(this.grid.length / 2.6);
        //start from ~half and work till the end
        for (var i = isFilled; i < Math.round((this.canvas.width / this.iternumber) / this.unit); i+= Math.round(Math.random()*2) + 1) {
            cntTracker = randfillCnt;
            //go down the column and check for empty rows to fill within random # specified
            for (var j = 0; j < Math.round((this.canvas.height) / this.unit); j++) {
                //add some randomness to this as well...
                if (!this.grid[i][j] && Math.random() > .2) {
                    this.grid[i][j] = 1;
                    this.drawCell(i, j, ctx);
                    cntTracker--;
                }
                //break out of this for loop when randfillCnt is exhausted
                if (cntTracker == 0) { break; }
            }
            if (cntTracker == randfillCnt) {
                isFilled++;
            }
        } //most outer for loop
        if(isFilled > Math.round(i/2)) {
            //iteration++;
        }
    }
}

function animate(machine, iteration, leftIteration, rules) {

    if(iteration != (machine.grid.length) - 1) {
        var isRight = true;
        machine.update(isRight, iteration, rules);
    }
    if(leftIteration > 0){
        var notLeft = false;
        machine.update(notLeft, leftIteration, rules);
    }

    requestAnimFrame(function(){
        var newLeftIter = leftIteration;
        var newIter = iteration;

        if(iteration != (machine.grid.length) - 1) {
            var newIter = iteration + 1;
        }
        if(leftIteration > 0 ) {
            var newLeftIter = leftIteration - 1;
        }
        if(iteration == newIter && newLeftIter == leftIteration){
            //we are done
            machine.lock = false;
        }
        else{
           /* fillcells(machine);*/
            animate(machine, newIter, newLeftIter, rules);
        }
    });
}

function fillcells(machine) {
    //this is terrible terrible terrible
    if(Math.random() > .95) {
        machine.fillRight();
    }

//    requestAnimFrame(function(){
//        if(machine.iteration != (machine.grid.length)) {
//            fillcells(machine);
//        }
//    });
}

function Cell(x, y, on, machine) {
    this.x = x;
    this.y = y;
    this.on = on;
    this.machine = machine;
    this.unit = machine.unit;
}

//*** explosion functionality

function cellulateMiddle() {

    this.canvas = document.getElementById('grid');
    var ctx = this.canvas.getContext('2d');
    //find the middle
    var middleY = Math.round((this.canvas.height/2)/myMachine.unit);
    var middleX = Math.round((this.canvas.width/2)/myMachine.unit);

    for(var i = 0; i < Math.round((this.canvas.height)/myMachine.unit); i++) {
        myMachine.grid[middleX][i] = 0;
        myMachine.drawCell(middleX, i, ctx);
    }
    var rules = [0, 0, 0, 0, 0, 0, 0, 0];
    animate(myMachine, middleX, middleX, rules);



}