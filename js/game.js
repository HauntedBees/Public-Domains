const input = {
    TapDelay: 15, EndBattleDelay: 500, // TODO: customize
    GetCleanEvent: function(e) {
        if(e.targetTouches) {
            return e.targetTouches[0];
        } else {
            return e;
        }
    },
    Press: function(e) { game.currentHandler.HandlePress(input.GetCleanEvent(e)); },
    Release: function(e) { game.currentHandler.HandleRelease(input.GetCleanEvent(e)); },
    Click: function(e) { game.currentHandler.HandleClick(input.GetCleanEvent(e)); }
};
const game = {
    currentHandler: null, drawIdx: 0,
    debug: true, lastTime: undefined,
    Init: function() {
        InitGachas();
        player.gachas = [GetGatcha(37), GetGatcha(40), GetGatcha(52)];
        player.party = [0, 1, 2];
        for(let i = 0; i < 3; i++) {
            LevelUpGatcha(player.gachas[i]);
            LevelUpGatcha(player.gachas[i]);
        }
        const canvasLayers = ["background", "characters", "HUD", "menu", "menutext"];
        const assetsToLoad = ["coin", "pd0", "pd1", "pd2", "pd3", "pd4", "pd5", "pd6", "pd7", "pd8",
                              "mapicons", "bgmenu", "bgcolus", "bg0", "bg1", "bg2", "bg3", "bg4", 
                              "charframe", "charframebottom", "charframesel", "charframebottomsel", "sparkle",
                              "banker",                                 // https://commons.wikimedia.org/wiki/File:The_Banker.JPG
                              "chest",                                  // https://free-images.com/display/treasure_chest_chest_gems.html https://free-images.com/display/treasure_chest_chest_box_0.html
                              "crosshair",                              // https://opengameart.org/content/10-aimtargets
                              "buton", "meter", "textbox", "bigtextbox",// https://opengameart.org/content/rpg-game-ui
                              "effects"];                               // https://opengameart.org/content/496-pixel-art-icons-for-medievalfantasy-rpg
        let canvasObj = {};
        for(let i = 0; i < canvasLayers.length; i++) {
            const name = canvasLayers[i];
            canvasObj[name] = document.getElementById(name);
        }
        let contextObj = {};
        for(const key in canvasObj) {
            contextObj[key] = canvasObj[key].getContext("2d");
        }
        gfx.SetCanvases(canvasObj, contextObj);
        gfx.LoadSpriteSheets("img", assetsToLoad, game.SheetsLoaded);
        game.LoadData();
    },
    SheetsLoaded: function() {
        document.getElementById("loadText2").remove();
        document.getElementById("loadText").innerText = "Tap to begin";
        document.addEventListener("click", input.Click);
        document.addEventListener("touchstart", input.Press);
        document.addEventListener("mousedown", input.Press);
        document.addEventListener("touchend", input.Release);
        document.addEventListener("mouseup", input.Release);
        game.currentHandler = loader;
    },
    MainLoop: function() {
        game.currentHandler.Draw();
    },
    SwitchToBattle: function(battleInfo, lastStateInfo, questID) {
        game.currentHandler.CleanUp();
        game.currentHandler = battle;
        game.currentHandler.SetUp(battleInfo, lastStateInfo, questID);
    },
    SwitchFromBattle: function(nextStateInfo) {
        game.currentHandler.CleanUp();
        game.currentHandler = menu;
        game.currentHandler.SetUp();
        menu.state = nextStateInfo.state;
        menu.substate = menu.GetDefaultStateDetails(menu.state);
        menu.substate.state = nextStateInfo.substate;
        if(menu.state === 1 && menu.substate.state === 6) {
            menu.substate.chapter = nextStateInfo.storyChapter;
        }
    },
    LoadData: function() {
        const saveData = localStorage.getItem("saveData");
        if(saveData === null) { console.log("NO SAVE DATA!"); return; }
        player = JSON.parse(saveData);
        const d = new Date(), suffix = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        for(let i = player.questsCleared.length - 1; i >= 0; i--) {
            const qkey = player.questsCleared[i];
            if(qkey.indexOf("|") >= 0) {
                const d = qkey.split("|")[1];
                if(d != suffix) { // clear out any old day events
                    player.questsCleared.splice(i, 1);
                }
            }
        }
        if(localStorage.getItem("patch1.1") === null) {
            console.log("Applying patch!");
            for(let i = 0; i < player.gachas.length; i++) {
                const me = player.gachas[i];
                const gachies = gachas.filter(e => e.name === me.name);
                if(gachies.length === 0) {
                    console.log("Couldn't find " + me.name + "!");
                    continue;
                }
                const gacha = Object.assign({}, gachies[0]);
                InitGatchaForBattle(gacha);
                while(gacha.level < me.level) {
                    LevelUpGatcha(gacha);
                }
                player.gachas[i] = gacha;
            }
            localStorage.setItem("patch1.1", true);
        }
    },
    SaveData: function() {
        const saveData = JSON.stringify(player);
        localStorage.setItem("saveData", saveData);
    }
};
const loader = {
    HandlePress: function() { },
    HandleRelease: function() { },
    HandleClick: function() {
        document.getElementById("loadingPage").remove();
        game.currentHandler = menu;
        game.currentHandler.SetUp();
        game.drawIdx = setInterval(game.MainLoop, 20);
        game.MainLoop();
    }
};
window.oncontextmenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};