/*:
*@plugindesc Disables the HP/MP/TP display in the menu.
*@author Ossra
*/

Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
var lineHeight = this.lineHeight();
var x2 = x + 180;
var width2 = Math.min(200, width - 180 - this.textPadding());
this.drawActorName(actor, x, y);
this.drawActorLevel(actor, x, y + lineHeight * 1);
this.drawActorIcons(actor, x, y + lineHeight * 2);
this.drawActorClass(actor, x2, y);
// Draw HP and MP functions
/* this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
this.drawActorMp(actor, x2, y + lineHeight * 2, width2); */
};

Window_Status.prototype.drawBasicInfo = function(x, y) {
var lineHeight = this.lineHeight();
this.drawActorLevel(this._actor, x, y + lineHeight * 0);
this.drawActorIcons(this._actor, x, y + lineHeight * 1);
// Draw HP and MP functions
/* this.drawActorHp(this._actor, x, y + lineHeight * 2);
this.drawActorMp(this._actor, x, y + lineHeight * 3); */
};