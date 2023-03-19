class Player 
{
    r = 50;

    name;
    
    player;
    playerBody;

    stadiumObj;
    focused = true;

    // prędkość maksymalna
    speed = 5;
    // aktualna prędkość maksymalna
    currentMaxSpeed = this.speed;
    // przyspieszenie
    acceleration = 1;
    // prędkość na osi X
    xSpeed = 0;
    // prędkość na osi Y
    ySpeed = 0;
    // bezwładność (wytracanie xSpeed, ySpeed)
    moveInertia = 0.3;
    // ponieżej tej prędkości zeruję
    moveDelta = this.moveInertia;

    // akcja
    action = null;
    // czas ustawienia akcji
    actionSetTime = null;
    // czas ważności akcji
    actionValidityTime = 1000; // ms

    // max siła strzału
    shotPower = 2;
    // max siła podania
    passPower = 1;

    pos = {
        x: 0, y: 0
    }

    constructor(name) {
        this.name;
        this.create();
        return this;
    }

    setStadium(stadiumObj) {
        this.stadiumObj = stadiumObj;
        return this;
    }

    create() {
        this.player = $('<div class="player"></div>');
        this.playerBody = $('<div class="player-body"></div>');
        this.player.append(this.playerBody);
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
        return this.shotPower;
    }

    getPassPower() {
        return this.passPower;
    }
}