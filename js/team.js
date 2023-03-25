class Team 
{
    name;
    teamSide;

    players = [];
    goalkeeper;

    constructor (teamSide, name) {
        this.teamSide = teamSide;
        this.name = name;
        return this;
    }

    addPlayer (player) {
        this.players.push(player);
        if (player.isGoalkeeper()) {
            this.goalkeeper = player;
        }
        player.setTeamSide(this.teamSide);
        return this;
    }

    getPlayers() {
        return this.players;
    }
}