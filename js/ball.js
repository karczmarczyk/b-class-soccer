class Ball
{
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

    create() {
        this.ball = $('<div class="ball"></div>');
        this.ballBody = $('<div class="ball-body"></div>');
        this.ball.append(this.ballBody);
    }

    render() {
        this.stadiumObj.stadium.append(this.ball);
    }
}