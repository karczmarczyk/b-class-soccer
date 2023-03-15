class Ball
{
    r = 20;

    pos = {
        x: 0,
        y: 0,
    }

    ball;
    ballBody;

    stadiumObj;

    vector = {
        a: 0,
        b: 0,
    };
    power = 0;

    powerLoss = 0.2;

    constructor() {
        this.create();
        return this;
    }

    setStadium(stadiumObj) {
        this.stadiumObj = stadiumObj;
        return this;
    }

    updatePosition() {
        this.ball.css({
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

    create() {
        this.ball = $('<div class="ball"></div>');
        this.ballBody = $('<div class="ball-body"></div>');
        this.ball.append(this.ballBody);
    }

    setPower(power) {
        this.power = power;
    }

    setVector(vector) {
        this.vector = vector;
    }

    move() {
        if (this.power<=0) return;

        this.pos.x = this.pos.x+(this.power*this.vector.a);
        this.pos.y = this.pos.y+(this.power*this.vector.b);

        this.power-=this.powerLoss;

        this.updatePosition();
    }

    render() {
        this.stadiumObj.stadium.append(this.ball);
        
        this.pos.x = parseInt(this.ball.css("left"), 10);
        this.pos.y = parseInt(this.ball.css("top"), 10);
        this.updatePosition();
    }
}