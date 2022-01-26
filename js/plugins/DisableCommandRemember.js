/*:
*@plugindesc Disables command remember option.
*@author Hoyii
*/

Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.alwaysDash, 'alwaysDash');
    //this.addCommand(TextManager.commandRemember, 'commandRemember');
};