class Goalkeeper extends Player 
{
    goalkeeper = true;

    // siła dotknięcia
    touch = 0.1;

    doAIMove(engine) {
        this.ai.do(this, engine);
        return this;
    }

    configureAI() {
        this.ai.setTeamSide(this.side);
        return this;
    }
}