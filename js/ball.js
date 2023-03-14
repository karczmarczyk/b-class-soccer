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

    render() {
        this.stadiumObj.stadium.append(this.ball);
        
        this.pos.x = parseInt(this.ball.css("left"), 10);
        this.pos.y = parseInt(this.ball.css("top"), 10);
        this.updatePosition();
    }
}