class Stadium
{
    containerElement = $("#main");

    stadium = null;
    field = null;
    sideA = null;
    sideB = null;
    
    goalA = null;
    goalPostA1 = null;
    goalPostA2 = null;
    
    goalB = null;
    goalPostB1 = null;
    goalPostB2 = null;

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

    players = [];
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

    addPlayer(player) {
        player.setStadium(this);
        this.players.push(player);
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
        
    }

    isBallOnField() {
        let p = this.ball.getPosition();
        //console.log("ball position: "+JSON.stringify(p));
        return p.x < this.fieldPosition.x - this.ball.r/2
            || p.x > this.fieldPosition.x + this.length + this.ball.r/2
            || p.y < this.fieldPosition.y - this.ball.r/2
            || p.y > this.fieldPosition.y + this.width + this.ball.r/2;
    }

    render() {
        this.updateView();
        this.containerElement.append(this.stadium);
        this.calcPositions();
        this.players.forEach(player => {
            player.render();
        });
        this.ball.render();
    }
    
}