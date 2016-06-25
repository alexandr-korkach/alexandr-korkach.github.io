function Game(elem){
    if(!elem)return;
    this.gameBlock = elem;
    this.pointArr = [];
    this.proportions = 3;
    this.moveNumber = 0;
    this.aiSwitch = true;
    this.players = {
        1: "X",
        2: "0"
    };
    this.playerColor = "red";//1-x, 2-0;
    this.aiColor = "green";
    this.selectionScreen();
    
    if(!this.gameTable) this.createField();
    
    
}

Game.prototype.selectionScreen = function(end){
   document.body.style.overflow = "hidden";
    var html = '<div class="selection-screen-back">';
    if (end) html += end;
    html += '<div class="selection-block">'+
            '<h2 class="selection-block__header">За кого будете грати?</h2>'+
        '<input type="button" class="selection-block__button" value="X" data-player-id = "1">'+
            '<input type="button" class="selection-block__button" value="0" data-player-id = "2">'+
             '</div>'+
            '</div>';
    document.body.insertAdjacentHTML("afterbegin", html);
    var selectionBlock = document.querySelector(".selection-block");
    selectionBlock.addEventListener("click", this.start.bind(this));
    
    
    
}


Game.prototype.start = function(e){
    if (e.target.getAttribute("data-player-id")){
        e.preventDefault();
        var playerId = +(e.target.getAttribute("data-player-id")),
            back = document.querySelector(".selection-screen-back");
        document.body.removeChild(back);
        this.createField();        
        this.gameTable.addEventListener("click", this.turn.bind(this));
        if(playerId == 2){
            this.playerColor = "green";//0-x, 1-0;
            this.aiColor = "red";
            this.playerId = 2;
            this.aiStart();
        }else{
            this.playerColor = "red";//0-x, 1-0;
            this.aiColor = "green";
            this.playerId = 1;
            this.turn;
        }
    }
}
                                    
                                    
                                    



Game.prototype.createField = function(){
    var table = "<table class = 'game-table'>";    
    for(var i = 0; i < this.proportions; i++){
        table += "<tr>";
        this.pointArr[i] = [];
        for(var j = 0; j < this.proportions; j++){
            this.pointArr[i][j] = 0;
            table += "<td data-row-id = '" + i + "' data-cell-id = '"+ j +"'></td>";
            
        }
        table += "</tr>";
        
    }
    table += "</table>";
    if(this.gameTable){
      this.gameBlock.removeChild(this.gameTable);  
    } 
    this.moveNumber = 0;
    this.gameBlock.insertAdjacentHTML("afterbegin", table);
    this.gameTable = this.gameBlock.querySelector(".game-table");
}






Game.prototype.turn = function(e){

    if(e.target.getAttribute("data-row-id")!== null){
        var row = +e.target.getAttribute("data-row-id"),
            cell = +e.target.getAttribute("data-cell-id");
        if(!this.pointArr[row][cell] != 0){
            e.target.style.backgroundColor = this.playerColor;
            var playerId = (this.playerColor == "red")? 1 : 2;
            this.pointArr[row][cell] = playerId;
            e.target.insertAdjacentHTML("afterbegin", this.players[playerId]);
            
            this.youWonTest(row, cell, playerId);
        }
    }
}


Game.prototype.youWonTest = function(row, cell, playerId, aiFlag){
    
    
    if(this.straightLineTest(cell, row, playerId, false)||
    this.straightLineTest(row, cell, playerId, true)||
    this.checkDiagonally(row, cell, playerId, false)||
    this.checkDiagonally(row, cell, playerId, true)){
        return;
    }
    this.moveNumber++;
    if(this.moveNumber == this.proportions*this.proportions){
        this.victory(false);
        return;
    }
    if(!aiFlag){
        this.aiStart();
    }
    
   

    
}

Game.prototype.straightLineTest = function(testLine, secondLine, playerId, reverse, aiFlag){
    for(var test = 0, num = 0; test < this.proportions; test++){
        var testItem = (reverse)?this.pointArr[test][secondLine]: this.pointArr[secondLine][test];
        if(testItem != playerId ){
           continue;
        }else{
            num++;
            if(aiFlag&&num==2){
                
                return true;
            }
            if(num==3){
                this.victory(playerId);
                return true;

            }else{
                continue;
            }
        }
    }
    return false;
}

Game.prototype.checkDiagonally = function(row, cell, playerId, reverse, aiFlag){
    
    if(reverse){
    
        for(var rowTest = row - 2, cellTest = cell-2, num = 0; rowTest <= row+2 && cellTest <=cell+2; rowTest++, cellTest++){
            if(this.pointArr[rowTest] != null && this.pointArr[rowTest][cellTest] != null){
                if(this.pointArr[rowTest][cellTest] != playerId ){
                    continue;
                }else{
                    num++;
                    if(aiFlag&&num==2){
                        return true;
                    }
                    if(num==3){
                        this.victory(playerId);
                        return true;


                    }else{
                        continue;
                    }
                }
            }
        }
    }else{
        
        for(var rowTest = row + 2, cellTest = cell - 2, num = 0; rowTest >= row-2 && cellTest <=cell+2; rowTest--, cellTest++){

            if(this.pointArr[rowTest] != null && this.pointArr[rowTest][cellTest] != null){
                if(this.pointArr[rowTest][cellTest] != playerId ){
                    continue;
                }else{
                    num++;
                    if(aiFlag&&num==2){
                        return true;
                    }
                    if(num==3){
                        
                        this.victory(playerId);
                        return true;


                    }else{
                        continue;
                    }
                }
            }
        }
    }
    return false;
    
}
Game.prototype.victory = function(winnerId){
    if(winnerId == this.playerId){
        var text = "Перемога!",
            img = "victory.jpg";            
        
    }else if (winnerId == false){
        var text = "Нічия!",
            img = "draw.jpg";
    }else{
        var text = "Поразка!",
            img = "lose.jpg";
    }
    var endBlock = '<div class="end-block">'+
                    '<h1>'+text+'</h1>'+
                    '<img src="img/'+img+'" width="300">'+
                    '</div>';
    this.selectionScreen(endBlock);
    
}
/* AI for 3x3 */
/*Game.prototype.aiStart = function(){
    var aiId = (this.aiColor == "red")? 1 : 2,
        rowArr = [1, 0, 0, 2, 2],
        cellArr = [1, 0, 2, 0, 2];
    if(this.aiSearch(aiId)){
        return;
    }
    for(var i = 0; i < 5; i++){
        if(this.pointArr[rowArr[i]][cellArr[i]] == 0){
            this.aiTurn(rowArr[i], cellArr[i], aiId);
            return;
        }
    }
    for(var r = 0; r < this.proportions; r++){
        for(var c = 0; c < this.proportions; c++){
            if(this.pointArr[r][c] == 0){
                this.aiTurn(r, c, aiId);
                return;
            }
        }
    }
    
}*/
/* AI for 3x3 */
Game.prototype.aiStart = function(){
    var aiId = (this.aiColor == "red")? 1 : 2,
        rowArr = [0, 0, 2, 2],
        cellArr = [0, 2, 0, 2];
    if(this.aiSearch(aiId)){
        return;
    }
    if(this.pointArr[1][1] == 0){
        this.aiTurn(1, 1, aiId);
        return;
        
    }
    var points = [];    
    for(var i = 0; i < 4; i++){
        if(this.pointArr[rowArr[i]][cellArr[i]] == 0){
            points.push(i);
                     
        }
    }
    if(points.length > 0){
        var number = this.randomInteger(0, points.length-1);
        this.aiTurn(rowArr[points[number]], cellArr[points[number]], aiId);
        return;
    }
    for(var r = 0; r < this.proportions; r++){
        for(var c = 0; c < this.proportions; c++){
            if(this.pointArr[r][c] == 0){
                this.aiTurn(r, c, aiId);
                return;
            }
        }
    }

}




Game.prototype.aiSearch = function(aiId){
    
    for(var r = 0; r < this.proportions; r++){
        for(var c = 0; c < this.proportions; c++){
            for(var p = 1; p <= 2; p++){
                if(this.pointArr[r][c] == 0){
                    if(this.straightLineTest(c, r, p, false, true) || this.straightLineTest(r, c, p, true, true) ||this.checkDiagonally(r, c, p, false, true) ||this.checkDiagonally(r, c, p, true, true)){

                        this.aiTurn(r, c, aiId);
                        return true;

                    }
                }
            }
        }
    }
    
}


Game.prototype.aiTurn = function(row, cell, aiId){
    this.pointArr[row][cell] = aiId;
    var field = this.gameBlock.querySelector("[data-row-id='"+ row +"'][data-cell-id='"+ cell +"']")
    field.style.backgroundColor = this.aiColor;
    field.insertAdjacentHTML("afterbegin", this.players[aiId]);
    this.youWonTest(row, cell, aiId, true);
}

Game.prototype.randomInteger = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

           
var game = new Game(document.getElementById("game"));



