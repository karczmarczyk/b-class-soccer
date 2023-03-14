class Engine
{
    keys = {
        ArrowRight: false,
        ArrowLeft: false,
        ArrowUp: false,
        ArrowDown: false,
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
            //that.consoleLog("Down:"+event.key);
            if (event.key!=='F5') {
                event.preventDefault();
            }
            that.setKey(event.key, true);
        });
        window.addEventListener('keyup', function(event) {
            //that.consoleLog("Up:"+event.key);
            if (event.key!=='F5') {
                event.preventDefault();
            }
            that.setKey(event.key, false);
        });
    }

    setKey(key, flag) {
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

    control(player) {
        this.player = player;
        return this;
    }

    movePlayer() {
        let p = this.player.getPosition();
        if (this.keys.ArrowRight) {
            p.x = p.x+this.player.speed;
        }
        if (this.keys.ArrowLeft) {
            p.x = p.x-this.player.speed;
        }
        if (this.keys.ArrowUp) {
            p.y = p.y-this.player.speed;
        }
        if (this.keys.ArrowDown) {
            p.y = p.y+this.player.speed;
        }
        //this.consoleLog(p);
        this.player.setPosition(p);
        this.player.updatePosition();
    }

    colisionWithBall(player){
        let ball = this.player.stadiumObj.ball;
        if (this.isColision(ball, player)) {
            this.consoleLog('COLISION!!!!!!!');
        }
    }

    isColision(obj1, obj2) {
        let p1 = obj1.getPosition();
        let p2 = obj2.getPosition();
        let dMax = (obj1.r+obj2.r) / 2;
        let d = Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
        return dMax>=d;
    }

    run() {
        let that = this;
        setInterval(function(){

            //that.consoleLog(that.keys);
            that.movePlayer();
            that.colisionWithBall(that.player);
            

        },50);
    }
}