class Player 
{
    r = 50;

    name;
    
    player;
    playerBody;

    stadiumObj;
    focused = true;

    speed = 5;

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
}