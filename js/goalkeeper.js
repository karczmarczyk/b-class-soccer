class Goalkeeper extends Player 
{
    goalkeeper = true;

    doAIMove() {
        
    }

    configureAI() {
        this.ai.setTeamSide(this.side);
        return this;
    }
}