class GoalkeeperAI extends PlayerAI
{
    do (goalkeeper, engine) {
        if (engine === undefined) return;
        let ballP = engine.getLastPositionBallOnField();
        let gkP = goalkeeper.getPosition();
        
        let goalCenter = engine.player.stadiumObj['goalPost'+goalkeeper.side+'ObjCenter'];        
        
        let dPlayerToBall = engine.playerToBallDistance(engine.player);
        let dGkToBall = engine.playerToBallDistance(goalkeeper);

        let dPlayerToGoal = engine.distanceByPosition(engine.player.getPosition(), goalCenter);
        let dGkToGoal = engine.distanceByPosition(gkP, goalCenter);

        let ballToGoal = engine.distanceByPosition(ballP, goalCenter);

        if (dGkToBall<dPlayerToBall) {
            goalkeeper.moveTo({
                x: ballP.x,
                y: ballP.y
            });
        } else {
            if (dPlayerToGoal<dGkToGoal) {
                goalkeeper.moveTo(goalCenter);
            } else if (ballToGoal > (engine.player.stadiumObj.length/2.5)) {
                goalkeeper.moveTo({
                    x: goalCenter.x-engine.player.stadiumObj.length/10,
                    y: ballP.y
                });
            } else if (ballToGoal < (engine.player.stadiumObj.length/4.5)) {
                goalkeeper.moveTo({
                    x: ballP.x,
                    y: ballP.y
                });
            } else if (ballToGoal < (engine.player.stadiumObj.length/4)) {
                goalkeeper.moveTo({
                    x: goalCenter.x,
                    y: ballP.y
                });    
            } else if (dGkToBall*2>dPlayerToBall) {
                goalkeeper.moveTo(goalCenter);
            } else if (dGkToBall < (engine.player.stadiumObj.length/3)) {
                goalkeeper.moveTo({
                    x: null,
                    y: ballP.y
                });
            } else {
                goalkeeper.moveTo(goalCenter);
            }
        }

        goalkeeper.move();
        goalkeeper.updatePosition();
        if (engine.colisionWithBall(goalkeeper)) {
            console.log("GK shot");
            engine.player.stadiumObj.ball.setPower(goalkeeper.getShotPower());
        }
    }

    
}