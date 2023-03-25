class Engine
{
    engineStop = false;

    keys = {
        // move
        ArrowRight: false,
        ArrowLeft: false,
        ArrowUp: false,
        ArrowDown: false,
        // actions
        shot: false,
        pass: false,
    }

    player;

    teamA;
    teamB;

    constructor () {
        this.addEventListeners();
        return this;
    }

    consoleLog(msg) {
        console.log(msg);
    }

    addEventListeners() {
        let that = this;
        window.addEventListener('keydown', function(event) {
            if (event.key!=='F5') {
                event.preventDefault();
            }
            that.setNavigationKey(event.key, true);
            that.setActionKey(event.key, true);
        });
        window.addEventListener('keyup', function(event) {
            if (event.key!=='F5') {
                event.preventDefault();
            }
            that.setNavigationKey(event.key, false);
            that.setActionKey(event.key, false);
        });
    }

    setNavigationKey(key, flag) {
        switch (key) {
            case "ArrowRight": 
                this.keys.ArrowRight = flag;
            break;
            case "ArrowLeft": 
                this.keys.ArrowLeft = flag;
            break;
            case "ArrowUp": 
                this.keys.ArrowUp = flag;
            break;
            case "ArrowDown": 
                this.keys.ArrowDown = flag;
            break;
        }
    }

    setActionKey(key, flag) {
        switch (key.toLowerCase()) {
            case "d": 
                this.keys.shot = flag;
            break;
            case "s": 
                this.keys.pass = flag;
            break;
        }
    }

    control(player) {
        this.player = player;
        return this;
    }

    movePlayer() {
        if (this.keys.ArrowRight) {
            this.player.setXAcceleration(this.player.acceleration);
        }
        if (this.keys.ArrowLeft) {
            this.player.setXAcceleration(-this.player.acceleration);
        }
        if (this.keys.ArrowUp) {
            this.player.setYAcceleration(-this.player.acceleration);
        }
        if (this.keys.ArrowDown) {
            this.player.setYAcceleration(this.player.acceleration);
        }
        //this.consoleLog(p);
        this.player.move();
        this.player.updatePosition();
    }

    actionPlayer() {
        if (this.keys.shot) {
            this.player.setAction("shot");
            this.keys.shot = false;
        }
        if (this.keys.pass) {
            this.player.setAction("pass");
            this.keys.pass = false;
        }
    }

    calcVector(a, b) {
        return {
            a: b.x-a.x,
            b: b.y-a.y,
        }
    }

    setBallDirection(player, defaultPower) {
        let p1 = player.getPosition();
        let ballPos = this.player.stadiumObj.ball.getPosition();
        let vector = this.calcVector(p1, ballPos);
        this.player.stadiumObj.ball.setVector(vector);

        let power = defaultPower;
        if (this.player.isShoting()) {
            power = this.player.getShotPower();
            this.player.resetAction('shot');
        }
        if (this.player.isPassing()) {
            power = this.player.getPassPower();
            this.player.resetAction('pass');
        }

        this.player.stadiumObj.ball.setPower(power);
    }

    colisionWithBall(player){
        let ball = this.player.stadiumObj.ball;
        if (this.isColision(ball, player)) {
            this.consoleLog('COLISION!!!!!!!');
            this.setBallDirection(player, player.touch);
            player.setCurrentMaxSpeed(0.3); //30%
            ball.setCurrentOwner(player);
        } else {
            player.setCurrentMaxSpeed(1); //100%
        }
    }

    colisionWithElement(element){
        let ball = this.player.stadiumObj.ball;
        if (this.isColision(ball, element)) {
            this.consoleLog('COLISION WITH ELEMENT!!!!!!!');
            this.setBallDirectionAfterColision(element, ball.power);
        } else {
        }
    }

    setBallDirectionAfterColision(element, defaultPower) {
        let p1 = element.getPosition();
        let ballPos = this.player.stadiumObj.ball.getPosition();
        let vector = this.calcVector(p1, ballPos);
        this.player.stadiumObj.ball.setVector(vector);

        let power = defaultPower;

        this.player.stadiumObj.ball.setPower(power);
    }

    isColision(obj1, obj2) {
        let p1 = obj1.getPosition();
        let p2 = obj2.getPosition();
        let dMax = (obj1.r+obj2.r) / 2;
        let d = Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
        let name = obj2.name;
        //console.log(JSON.stringify({name, p1, p2, dMax, d}))
        return dMax>=d;
    }

    moveBall() {
        let pBefore = this.player.stadiumObj.ball.getPosition();
        this.player.stadiumObj.ball.move();
        if (this.player.stadiumObj.isBallOnField()) {
            let pAfter = this.player.stadiumObj.ball.getPosition();
            if (this.player.stadiumObj.isGoal("A", this.player.getPosition(), pAfter)) {
                console.log("GOAL A!!!");    
            }
            else if (this.player.stadiumObj.isGoal("B", this.player.getPosition(), pAfter)) {
                console.log("GOAL B!!!");
            } 
            else {
                console.log("BALL OUT!!!");
            }
            let that = this;
            setTimeout(function(){
                that.engineStop = true;
                document.location.reload();
            }, 1000);
        }
    }

    moveOtherPlayers (side) {
        let that = this;
        this.player.stadiumObj['team'+side].getPlayers().forEach(player => {
            if (!player.focused) {
                that.moveOtherPlayer(player);
            }
        });
    }

    moveOtherPlayer(player) {
        player.updatePosition();
        this.colisionWithBall(player);
        
        that.colisionWithBall(this.player);
    }

    run() {
        let that = this;
        this.consoleLog(that.player.stadiumObj);
        setInterval(function(){

            if (that.engineStop) {
                return;
            }

            //that.consoleLog(that.keys);
            that.movePlayer();
            that.actionPlayer();
            that.colisionWithBall(that.player);
            
            that.moveBall();
            that.colisionWithElement(that.player.stadiumObj.goalPostA1Obj);
            that.colisionWithElement(that.player.stadiumObj.goalPostA2Obj);
            that.colisionWithElement(that.player.stadiumObj.goalPostB1Obj);
            that.colisionWithElement(that.player.stadiumObj.goalPostB2Obj);

            that.moveOtherPlayers('A');
            that.moveOtherPlayers('B');

        },10);
    }
}