class Engine
{
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
        }
        if (this.player.isPassing()) {
            power = this.player.getPassPower();
        }

        this.player.stadiumObj.ball.setPower(power);
    }

    colisionWithBall(player){
        let ball = this.player.stadiumObj.ball;
        if (this.isColision(ball, player)) {
            this.consoleLog('COLISION!!!!!!!');
            this.setBallDirection(player, player.touch);
            this.player.setCurrentMaxSpeed(0.3); //30%
            ball.setCurrentOwner(player);
        } else {
            this.player.setCurrentMaxSpeed(1); //100%
        }
    }

    isColision(obj1, obj2) {
        let p1 = obj1.getPosition();
        let p2 = obj2.getPosition();
        let dMax = (obj1.r+obj2.r) / 2;
        let d = Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
        return dMax>=d;
    }

    moveBall() {
        this.player.stadiumObj.ball.move();
        if (this.player.stadiumObj.isBallOnField()) {
            console.log("BALL OUT!!!");
        }
    }

    run() {
        let that = this;
        setInterval(function(){

            //that.consoleLog(that.keys);
            that.movePlayer();
            that.actionPlayer();
            that.colisionWithBall(that.player);
            
            that.moveBall();

        },50);
    }
}