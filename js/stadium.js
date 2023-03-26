class Stadium
{
    containerElement = $("#main");

    stadium = null;
    field = null;
    sideA = null;
    sideB = null;
    
    goalPosR = 2.5;

    goalA = null;
    goalPostA1 = null;
    goalPostA1Obj = null;
    goalPostA2 = null;
    goalPostA2Obj = null;
    
    goalB = null;
    goalPostB1 = null;
    goalPostB1Obj = null;
    goalPostB2 = null;
    goalPostB2Obj = null;

    length = 200;
    width = 100;
    goalSize = 25;

    centerPosition = {
        x: 0,
        y: 0,
    }

    fieldPosition = {
        x: 0,
        y: 0,
    }

    teamA = [];
    teamB = [];
    ball;

    constructor(name) {
        this.create();
        return this;
    }

    create() {
        this.stadium = $('<div class="stadium"></div>');
        this.field = $('<div class="field"></div>');

        this.goalA = this.createGoal("A");
        this.goalB = this.createGoal("B");

        this.sideA = $('<div class="field-side sideA"></div>');
        this.sideB = $('<div class="field-side sideB"></div>');

        this.sideA.append(this.goalA);
        this.sideB.append(this.goalB);

        this.circle = $('<div class="field-circle"></div>');
        

        this.field.append(this.sideA).append(this.sideB).append(this.circle);
        this.stadium.append(this.field);
    }

    createGoal(x) {
        this['goalPost'+x+'1'] = $('<div class="goal'+x+' goalPost goalPost1"></div>');
        this['goalPost'+x+'2'] =  $('<div class="goal'+x+' goalPost goalPost2"></div>');
        let goal = $('<div class="goal"></div>');
        let goalInside = $('<div class="goal-inside"></div>');
        goal.append(goalInside.append(this['goalPost'+x+'1']).append(this['goalPost'+x+'2']));
        return goal;
    }

    setSize(length, width) {
        this.length = length;
        this.width = width;
        return this;
    }

    setGoalSize(size) {
        this.goalSize = size;
        return this;
    }

    updateView() {
        this.stadium.css({
            'width':this.length+'px',
            'height':this.width+'px',
        });

        let goalTop = this.width/2 - this.goalSize/2

        this.goalA.css({
            height: this.goalSize+'px',
            top: goalTop+'px',
        });

        this.goalB.css({
            height: this.goalSize+'px',
            top: goalTop+'px',
        });

        return this;
    }

    addTeamA(team) {
        let that = this;
        team.getPlayers().forEach(player => {
            player.setStadium(that);
        });
        
        this.teamA = team;
        return this;
    }

    addTeamB(team) {
        let that = this;
        team.getPlayers().forEach(player => {
            player.setStadium(that);
        });
        
        this.teamB = team;
        return this;
    }

    addBall(ball) {
        this.ball = ball;
        this.ball.setStadium(this);
        return this;
    }

    calcPositions() {
        // field position
        let x0 = this.field.position().left;
        let y0 = this.field.position().top;
        this.fieldPosition = {
            x: x0,
            y: y0,
        }

        // center position
        this.centerPosition = {
            x: this.length/2 + x0,
            y: this.width/2 + y0,
        }
        console.log("field center: "+JSON.stringify(this.centerPosition));

        // goals positions
        this.goalPostA1Obj = new GoalPost("A1", this.calcGoalPostPos('A','1'), this.goalPosR);
        this.goalPostA2Obj = new GoalPost("A2", this.calcGoalPostPos('A','2'), this.goalPosR);
        this.goalPostB1Obj = new GoalPost("B1", this.calcGoalPostPos('B','1'), this.goalPosR);
        this.goalPostB2Obj = new GoalPost("B2", this.calcGoalPostPos('B','2'), this.goalPosR);
    }

    calcGoalPostPos(n,m) {
        let goalPostName = 'goalPost'+n+m;
        let goalName = 'goal'+n;
        let sideName = 'side'+n;
        let goalY = this[goalName].position().top + this.fieldPosition.y + this[sideName].position().top;
        let goalX = this[goalName].position().left + this.fieldPosition.x + this[sideName].position().left;
        let p = {x: this[goalPostName].position().left+goalX+this.goalPosR, y: this[goalPostName].position().top+goalY-this.goalPosR}
        return p;
    }

    isBallOutField() {
        let p = this.ball.getPosition();
        //console.log("ball position: "+JSON.stringify(p));
        return p.x < this.fieldPosition.x - this.ball.r/2
            || p.x > this.fieldPosition.x + this.length + this.ball.r/2
            || p.y < this.fieldPosition.y - this.ball.r/2
            || p.y > this.fieldPosition.y + this.width + this.ball.r/2;
    }

    isGoal(x, pBefore, pAfter) {
        let goalPostName1 = "goalPost"+x+"1Obj";
        let goalPostName2 = "goalPost"+x+"2Obj";

        return this.vectorIntersection(pBefore,pAfter,this[goalPostName1].getPosition(),this[goalPostName2].getPosition());
    }

    vectorIntersection(p1, p2, p3, p4) {
        let S_1 = this.vectorProduct(p1, p3, p2);
        let S_2 = this.vectorProduct(p1, p4, p2);
        let S_3 = this.vectorProduct(p3, p1, p4);
        let S_4 = this.vectorProduct(p3, p2, p4);
        
        if (((S_1 > 0 && S_2 < 0) || (S_1 < 0 && S_2 > 0)) && ((S_3 < 0 && S_4 > 0) || (S_3 > 0 && S_4 < 0))) {
            return true;
        } 
        else if (S_1 = 0 && this.isBetween(p1, p2, p3)) {
            return true;
        } 
        else if (S_2 = 0 && this.isBetween(p1, p2, p4)) {
             return true;
        }
        else if (S_3 = 0 && this.isBetween(p3, p4, p1)) {
             return true;
        }
        else if (S_4 = 0 && this.isBetween(p3, p4, p2)) {
             return true;
        }
        else return false;
    }

    /**
     * Iloczyn wektorów
     * @param {*} p1 
     * @param {*} p2 
     * @param {*} p3 
     * @returns 
     */
    vectorProduct (p1, p2, p3) {
        //(x2 - x1)(y3 - y1) - (x3 - x1)(y2 - y1)  
        return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
    }

    /**
     * Czy leży pomiędzy
     */
    isBetween(p1, p2, p3) {
        xMin = p1.x;
        if (p2.x<xMin) {
            xMin = p2.x;
        }
        xMax = p1.x;
        if (p2.x > xMax) {
            xMax = p2.x;
        }
        return xMin <= p3.x && p3.x <= xMax;
    }

    getCenterPosition() {
        return this.centerPosition;
    }

    render() {
        this.updateView();
        this.containerElement.append(this.stadium);
        this.calcPositions();
        this.teamA.getPlayers().forEach(player => {
            player.render();
        });
        this.teamB.getPlayers().forEach(player => {
            player.render();
        });
        this.ball.render();
    }
    
}

class GoalPost 
{
    name;
    r = 2.5;

    pos = {
        x: 0, y: 0
    }

    constructor(name, p, r) {
        this.name = name;
        this.pos = p;
        console.log("goalPost"+name+": "+JSON.stringify(p));
        this.r = r;
        return this;
    }

    setPosition(p) {
        this.pos = {
            x: p.x,
            y: p.y,
        }
        return this;
    }

    getPosition() {
        return this.pos;
    }
}