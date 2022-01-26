//======================================================
//QiNian Latern Game
//QiNian_LaternGame.js
//======================================================

var Imported = Imported || {};
Imported.QiNian_LaternGame = true;

var Qi = Qi || {};
Qi.CRAFT = Qi.CRAFT || {};

/*:
 * @plugindesc This plugin allows users to initiate a latern-building minigame.
 *
 * @author Hoyii
 *
 * @param Top Part Image
 * @desc The top part of building games.
 * @default Top
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param Middle Part Image
 * @desc The middle part of building games.
 * @default Mid
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param Bottom Part Image
 * @desc The bottom part of building games.
 * @default Low
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @help
 *
 * QiNian's Latern crafting minigame:
 * ======================================================
 * This plugin adds a lantern building minigame
 * ======================================================
 * 
 * Script calls:
 * ======================================================
 * Qi.CRAFT.addTarget(t_1, t_2, ...);
 * 
 * //add rewards to the minigame
 * //t_n is in the form of "a,b"
 * //"a" represents the id of item to be crafted
 * //"b" represents the amount of item to be crafted
 * 
 * Qi.CRAFT.clearTarget();
 * 
 * //clear all rewards of the minigame
 * 
 * Qi.CRAFT.startCraft();
 * 
 * //start a default minigame
 * 
 * Qi.CRAFT.startCustomCraft(minS, maxS, t);
 * 
 * //start a custom minigame
 * //minS is the minimum speed (px/fr)
 * //maxS is the maximum speed
 * //tolerance is the success condition (px)
 * 
 * Qi.CRAFT.getCraftResult();
 * 
 * //get the result of the minigame
 * //returns true if successful, false otherwise
 * //gives party rewards if successful
 * 
 * Qi.CRAFT.setBack(image);
 * 
 * //use img/pictures/image(.xxx) as the background
 * 
 * Qi.CRAFT.setFront(image);
 * 
 * //use img/pictures/image(.xxx) as the foreground
 * ======================================================
 * 
 * Recommended Usage:
 * ======================================================
 * Script: Qi.CRAFT.setBack("xxx");
 *         Qi.CRAFT.setFront("xxx");
 *         Qi.CRAFT.addTarget("xxx");
 *         Qi.CRAFT.startCraft();
 * Script: Qi.CRAFT.getCraftResult();
 *         Qi.CRAFT.clearTarget();
 * ======================================================
 */


(function () {

    var params = PluginManager.parameters('QiNian_LanternGame');

    Qi.CRAFT.top = params["Top Part Image"];
    Qi.CRAFT.mid = params["Middle Part Image"];
    Qi.CRAFT.low = params["Bottom Part Image"];

    Qi.CRAFT.target = [];
    Qi.CRAFT.success = true;

    Qi.CRAFT.addTarget = function () {
        var arr = arguments;
        for (var i = 0; i < arguments.length; i++) {
            Qi.CRAFT.target.push(Qi.CRAFT.getItem(arr[i]));
            //console.log("added something");
        };
    };

    Qi.CRAFT.getItem = function (info) {
        var info = info.split(",");
        return { item: $dataItems[Number(info[0])], amount: Number(info[1]) };
    };

    Qi.CRAFT.clearTarget = function () {
        Qi.CRAFT.target = [];
    };

    Qi.CRAFT.startCraft = function () {
        Qi.CRAFT.startCustomCraft(5, 10, 150);
    };

    Qi.CRAFT.startCustomCraft = function (minSpeed, maxSpeed, tolerance) {
        Qi.CRAFT.minSpeed = minSpeed;
        Qi.CRAFT.maxSpeed = maxSpeed;
        Qi.CRAFT.tolerance = tolerance;

        if (!(Qi.CRAFT.target.length == 0)) {
            //Scene_QiCraft
            SceneManager.push(Scene_QiCraft);
            //console.log("start");
        };
    };

    Qi.CRAFT.getCraftResult = function () {
        if (Qi.CRAFT.success == true) {
            //console.log("giving something");
            for (var i = 0; i < Qi.CRAFT.target.length; i++) {
                var item = Qi.CRAFT.target[i].item;
                var amount = Qi.CRAFT.target[i].amount;
                $gameParty.gainItem(item, amount);
                //console.log("given something");
            };
            return true;
        } else {
            return false;
        };
    };

    Qi.CRAFT.setBack = function () {
        $gameSystem._craftBack = Array.prototype.slice.call(arguments);
    };

    Qi.CRAFT.setFront = function () {
        $gameSystem._craftFront = Array.prototype.slice.call(arguments);
    };

})();

//Game_System
Qi.CRAFT.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    this._craftBack = [];
    this._craftFront = [];
    Qi.CRAFT.Game_System_initialize.call(this);
};

//Scene_QiCraft
function Scene_QiCraft() {
    this.initialize.apply(this, arguments);
};

Scene_QiCraft.prototype = Object.create(Scene_MenuBase.prototype);
Scene_QiCraft.prototype.constructor = Scene_QiCraft;

Scene_QiCraft.prototype.initialize = function () {
    this.loadRequiredImages();
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_QiCraft.prototype.loadRequiredImages = function () {
    ImageManager.loadPicture(Qi.CRAFT.top);
    ImageManager.loadPicture(Qi.CRAFT.mid);
    ImageManager.loadPicture(Qi.CRAFT.low);
};

//create
Scene_QiCraft.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.setGraphics();
    this.initializeCraft();
};

Scene_QiCraft.prototype.setGraphics = function () {
    //backround
    this._backImages = [];
    for (var i = 0; i < $gameSystem._craftBack.length; i++) {
        this._backImages[i] = new Sprite();
        this._backImages[i].bitmap = ImageManager.loadPicture($gameSystem._craftBack[i]);
        this.addChild(this._backImages[i]);
        //console.log("add background");
    };

    //top part
    this._topPart = new Sprite();
    var topBitmap = ImageManager.loadPicture(Qi.CRAFT.top);

    var w = topBitmap.width;
    var h = topBitmap.height;
    this._w = w;
    this._h = h;

    this._topPart.bitmap = new Bitmap(w, h);
    this._topPart.bitmap.blt(topBitmap, 0, 0, w, h, 0, 0);

    this._topPart.x = (w / 2) + Math.floor(Math.random() * (Graphics.boxWidth - w));
    this._topPart.y = 120;
    this._topPart.anchor.x = 0.5;
    this._topPart.anchor.y = 0;
    this.addChild(this._topPart);

    //middle part
    this._midPart = new Sprite();
    var midBitmap = ImageManager.loadPicture(Qi.CRAFT.mid);

    this._midPart.bitmap = new Bitmap(w, h);
    this._midPart.bitmap.blt(midBitmap, 0, 0, w, h, 0, 0);

    this._midPart.x = (w / 2) + Math.floor(Math.random() * (Graphics.boxWidth - w));
    this._midPart.y = 220;
    this._midPart.anchor.x = 0.5;
    this._midPart.anchor.y = 0;
    this.addChild(this._midPart);

    //bottom part
    this._lowPart = new Sprite();
    var lowBitmap = ImageManager.loadPicture(Qi.CRAFT.low);

    this._lowPart.bitmap = new Bitmap(w, h);
    this._lowPart.bitmap.blt(lowBitmap, 0, 0, w, h, 0, 0);

    this._lowPart.x = (w / 2) + Math.floor(Math.random() * (Graphics.boxWidth - w));
    this._lowPart.y = 395;
    this._lowPart.anchor.x = 0.5;
    this._lowPart.anchor.y = 0;
    this.addChild(this._lowPart);

    //foreground
    this._frontImages = [];
    for (var i = 0; i < $gameSystem._craftFront.length; i++) {
        this._frontImages[i] = new Sprite();
        this._frontImages[i].bitmap = ImageManager.loadPicture($gameSystem._craftFront[i]);
        this.addChild(this._frontImages[i]);
    };

    //win / lose graphics
    this._endPopup = new Sprite();
    this._winGraphics = [];
    this._loseGraphics = [];
    this._winGraphics.push(ImageManager.loadPicture("Win1"));
    this._winGraphics.push(ImageManager.loadPicture("Win2"));
    this._loseGraphics.push(ImageManager.loadPicture("Lose1"));
    this._loseGraphics.push(ImageManager.loadPicture("Lose2"));

    this._endPopup.x = Graphics.boxWidth / 2;
    this._endPopup.y = Graphics.boxHeight / 2;
    this._endPopup.anchor.x = 0.5;
    this._endPopup.anchor.y = 0.5;
};

Scene_QiCraft.prototype.initializeCraft = function () {
    this._allowInput = false;
    this._timer = 0;
    this._endCraft = false;

    if (Qi.CRAFT.maxSpeed === Qi.CRAFT.minSpeed) {
        Qi.CRAFT.maxSpeed += 1;
    };

    var speedChoices = [];

    for (var i = Qi.CRAFT.minSpeed; i <= Qi.CRAFT.maxSpeed; i += 0.5) {
        speedChoices.push(i);
    };

    //random speed
    this._topSpeed = speedChoices.splice(Math.floor(Math.random() * speedChoices.length), 1);
    this._topSpeed = this._topSpeed[0];
    //random direction
    this._topSpeed = this._topSpeed * (Math.floor(Math.random() * 2) * 2 - 1);

    this._midSpeed = speedChoices.splice(Math.floor(Math.random() * speedChoices.length), 1);
    this._midSpeed = this._midSpeed[0];
    this._midSpeed = this._midSpeed * (Math.floor(Math.random() * 2) * 2 - 1);

    this._lowSpeed = speedChoices.splice(Math.floor(Math.random() * speedChoices.length), 1);
    this._lowSpeed = this._lowSpeed[0];
    this._lowSpeed = this._lowSpeed * (Math.floor(Math.random() * 2) * 2 - 1);

    this._lBound = this._w / 2;
    this._rBound = Graphics.boxWidth - this._w / 2;
};

//update
Scene_QiCraft.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    this.updateTimer();
    this.updateCraft();
    this.updateInput();
    //console.log("update");
};

Scene_QiCraft.prototype.updateTimer = function () {
    this._timer = this._timer + 1;
    if (this._endCraft) {
        //save game result
        if (this._timer == 5) {
            this.saveResult();
        };
        //add pop up image
        if (this._timer == 10) {
            this.addChild(this._endPopup);

        };
        //end minigame
        if (this._timer == 120) {
            SceneManager.pop();
        };
        //change pop up image
        if (this._timer >= 10) {
            switch ((this._timer - 10) % 20) {
                case 0:
                    if (Qi.CRAFT.success) {
                        this._endPopup.bitmap = this._winGraphics[0];
                    } else if (!Qi.CRAFT.success) {
                        this._endPopup.bitmap = this._loseGraphics[0];
                    };
                    break;
                case 10:
                    if (Qi.CRAFT.success) {
                        this._endPopup.bitmap = this._winGraphics[1];
                    } else if (!Qi.CRAFT.success) {
                        this._endPopup.bitmap = this._loseGraphics[1];
                    };
                    break;
            };
        };
    } else {
        if (this._timer == 30) {
            this._allowInput = true;
        };
    };
    //console.log("timer: " + this._timer);
};

Scene_QiCraft.prototype.updateCraft = function () {
    if (!(this._endCraft)) {
        if (this._topPart.x + this._topSpeed <= this._lBound) {
            this._topPart.x = this._lBound;
            this._topSpeed = - this._topSpeed;
        } else if (this._topPart.x + this._topSpeed >= this._rBound) {
            this._topPart.x = this._rBound;
            this._topSpeed = - this._topSpeed;
        } else {
            this._topPart.x = this._topPart.x + this._topSpeed;
        };

        if (this._midPart.x + this._midSpeed <= this._lBound) {
            this._midPart.x = this._lBound;
            this._midSpeed = - this._midSpeed;
        } else if (this._midPart.x + this._midSpeed >= this._rBound) {
            this._midPart.x = this._rBound;
            this._midSpeed = - this._midSpeed;
        } else {
            this._midPart.x = this._midPart.x + this._midSpeed;
        };

        if (this._lowPart.x + this._lowSpeed <= this._lBound) {
            this._lowPart.x = this._lBound;
            this._lowSpeed = - this._lowSpeed;
        } else if (this._lowPart.x + this._lowSpeed >= this._rBound) {
            this._lowPart.x = this._rBound;
            this._lowSpeed = - this._lowSpeed;
        } else {
            this._lowPart.x = this._lowPart.x + this._lowSpeed;
        };
    };
};

Scene_QiCraft.prototype.updateInput = function () {
    if (this._allowInput && (Input.isTriggered('ok') || TouchInput.isPressed())) {
        //stop crafting process
        this._endCraft = true;
        this._allowInput = false;
        this._timer = 0;
        //console.log("stop");
    };
};

Scene_QiCraft.prototype.saveResult = function () {
    var totalDiff = 0
    totalDiff += Math.abs(this._topPart.x - this._midPart.x);
    totalDiff += Math.abs(this._midPart.x - this._lowPart.x);
    totalDiff += Math.abs(this._lowPart.x - this._topPart.x);

    if (totalDiff <= Qi.CRAFT.tolerance) {
        Qi.CRAFT.success = true;
    } else {
        Qi.CRAFT.success = false;
    };
};