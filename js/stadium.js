class Stadium
{
    containerElement = $("#main");

    stadium = null;
    field = null;
    sideA = null;
    sideB = null;

    length = 200;
    width = 100;

    players = [];
    ball;

    constructor(name) {
        this.create();
        return this;
    }

    create() {
        this.stadium = $('<div class="stadium"></div>');
        this.field = $('<div class="field"></div>');
        this.sideA = $('<div class="field-side sideA"></div>');
        this.sideB = $('<div class="field-side sideB"></div>');
        this.circle = $('<div class="field-circle"></div>');

        this.field.append(this.sideA).append(this.sideB).append(this.circle);
        this.stadium.append(this.field);
    }

    setSize(length, width) {
        this.length = length;
        this.width = width;
        return this;
    }

    updateView() {
        this.stadium.css({
            'width':this.length+'px',
            'height':this.width+'px',
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

    render() {
        this.updateView();
        this.containerElement.append(this.stadium);
        this.players.forEach(player => {
            player.render();
        });
        this.ball.render();
    }
}