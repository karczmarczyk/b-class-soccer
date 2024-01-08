class Player 
{
    r = 50;

    name;
    number;
    
    // Team A or B
    side;

    player;
    playerBody;

    stadiumObj;
    focused = false;

    // prędkość maksymalna
    speed = 1;
    // aktualna prędkość maksymalna
    currentMaxSpeed = this.speed;
    // przyspieszenie
    acceleration = 1;
    // prędkość na osi X
    xSpeed = 0;
    // prędkość na osi Y
    ySpeed = 0;
    // bezwładność (wytracanie xSpeed, ySpeed)
    moveInertia = 0.49;
    // ponieżej tej prędkości zeruję
    moveDelta = this.moveInertia;

    // akcja
    action = null;
    // czas ustawienia akcji
    actionSetTime = null;
    // czas ważności akcji
    actionValidityTime = 1000; // ms

    // siła dotknięcia
    touch = 0.03;
    // max siła strzału
    shotPower = 0.2;
    // max siła podania
    passPower = 0.1;

    ai = null;

    goalkeeper = false;

    pos = {
        x: 0, y: 0
    }

    constructor(name, number) {
        this.name = name;
        this.number = number;
        this.create();
        return this;
    }

    setFocused(state) {
        this.focused = state;
        return this;
    }

    setStadium(stadiumObj) {
        this.stadiumObj = stadiumObj;
        return this;
    }

    create() {
        this.player = $('<div class="player '+this.playerCssClass()+'"></div>');
        this.playerBody = $('<div class="player-body"></div>');
        let playerName = $('<div class="player-name">'+this.name+'</div>');
        this.player
            .append(this.playerBody)
            .append(playerName)
            ;
    }

    playerCssClass() {
        let gkClass = "";
        if (this.goalkeeper) {
            gkClass = "goalkeeper"
        }
        return " "+gkClass+" ";
    }

    setTeamSide (side) {
        this.player.addClass('team'+side);
        this.side = side;
        return this;
    }

    updatePosition() {
        this.player.css({
            'left':this.pos.x+'px',
            'top':this.pos.y+'px',
        });
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

    render() {
        this.stadiumObj.stadium.append(this.player);
    }

    setXAcceleration(acceleration) {
        if (Math.abs(this.xSpeed)<this.currentMaxSpeed) {
            this.xSpeed = this.xSpeed+acceleration;
        }
    }

    setYAcceleration(acceleration) {
        if (Math.abs(this.ySpeed)<this.currentMaxSpeed) {
            this.ySpeed = this.ySpeed + acceleration;    
        }
    }

    move() {
        let p = this.getPosition();
        this.xSpeed = this.calcSpeed(this.xSpeed);
        this.ySpeed = this.calcSpeed(this.ySpeed);
        p.x = p.x + this.xSpeed;
        p.y = p.y + this.ySpeed;
    }

    moveTo(p) {
        let thisP = this.getPosition();
        if (null!=p.y) {
            if (p.y<thisP.y) {
                this.setYAcceleration(-this.acceleration);
            } else if (p.y>thisP.y) {
                this.setYAcceleration(this.acceleration);
            } else {
                this.setYAcceleration(0);
            }
        }
        if (null!=p.x) {
            if (p.x<thisP.x) {
                this.setXAcceleration(-this.acceleration);
            } else if (p.x>thisP.x) {
                this.setXAcceleration(this.acceleration);
            } else {
                this.setXAcceleration(0);
            }
        }
    }

    calcSpeed(currentSpeed) {
        if (currentSpeed>0) {
            currentSpeed = currentSpeed-this.moveInertia; 
        } else {
            currentSpeed = currentSpeed+this.moveInertia;
        }
        if (Math.abs(currentSpeed)<=this.moveDelta) {
            currentSpeed = 0;
        }
        return currentSpeed;
    }

    setCurrentMaxSpeed(currentMaxSpeedPercent) {
        this.currentMaxSpeed = this.speed * currentMaxSpeedPercent;
    }

    getPercentCurrentSpeedOfMaxSpeed() {
        let speed = Math.abs(this.xSpeed);
        if (Math.abs(this.ySpeed) > Math.abs(this.xSpeed)) {
            speed = Math.abs(this.ySpeed);
        } 
        if (speed < 1) {
            return 0.3;
        }
        return speed / this.speed;
    }

    setAction(action) {
        this.action = action;
        this.actionSetTime = Date.now();
    }

    isShoting() {
        return this.isAction('shot');
    }

    isPassing() {
        return this.isAction('pass');
    }

    isAction(action) {
        if (action == this.action && Date.now()-this.actionSetTime>this.actionValidityTime) {
            this.action = null;
            this.actionSetTime = null;
        }
        return action == this.action;
    }

    getShotPower() {
        return this.shotPower * this.getPercentCurrentSpeedOfMaxSpeed();
    }

    getPassPower() {
        return this.passPower;// * this.getPercentCurrentSpeedOfMaxSpeed();
    }

    resetAction(action) {
        if (action == this.action) {
            this.action = null;
            this.actionSetTime = null;
        }
        return this;
    }

    setIsGoalkeeper(is) {
        this.goalkeeper = is;
        return this;
    }

    isGoalkeeper() {
        return this.goalkeeper;
    }

    doAIMove(engine) {
        return this;
    }

    setAI (ai) {
        this.ai = ai;
        this.configureAI();
        this.ai.do();
        return this;
    }

    configureAI() {
        this.ai;
        // todo
        return this;
    }
}