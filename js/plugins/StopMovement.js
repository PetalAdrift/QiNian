/*:
*@plugindesc Disables player movement with a switch. Improved by Hoyii.
*@author 汪汪
*
*@help This plugin does not provide plugin commands.
*
*@param playerSwitch
*@desc Turning the given switch on disables player movement.
*@default 31
*/

var params = PluginManager.parameters("StopMovement");
var pSwitch = params["playerSwitch"]

Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove() &&  !($gameSwitches.value(pSwitch)) ) {
        var direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
        }
        if (direction > 0) {
            this.executeMove(direction);
        }
    }
};