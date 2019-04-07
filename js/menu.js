let gachaCounter = 0, coinCounter = 0;
const menu = {
    gameTimer: 0, state: 0, substate: 0, pressedButton: -1, doubleTapDelay: 0, 
    options: ["Home", "Fight", "Teams", "Summon", "Shop"], 
    todaysPrizes: [], 
    SetUp: function() {
        gfx.DrawBackground("bgmenu");
        menu.state = 0; menu.substate = menu.GetDefaultStateDetails(menu.state);
        menu.pressedButton = -1;
        menu.gameTimer = setInterval(menu.MenuLoop, 100);
        menu.todaysPrizes = dailies.GetTodaysColosseum();
    },
    CleanUp: function() {
        gfx.ClearAll();
        clearInterval(menu.gameTimer);
    },
    GetDefaultStateDetails: function(i) {
        switch(i) {
            case 0:
                return { state: 0, btnPress: -1, msg: dailies.GetMessages(), missions: dailies.GetMissions(), 
                         buddy: player.gachas[Math.floor(Math.random() * player.gachas.length)], buddyMsg: buddyMessages[Math.floor(Math.random() * buddyMessages.length)] };
            case 2:
                const details = {
                    state: 0, selected: -1, selectType: -1, btnPress: 0, 
                    numPerRow: 4, page: 0, topY: gfx.GetPixelY(0.25),  
                };
                details.maxPerPage = details.numPerRow * details.numPerRow;
                details.pageMax = Math.floor((player.gachas.length - 1) / details.maxPerPage);
                return details;
        }
        return { state: 0, btnPress: -1 };
    },

    MenuLoop: function() {
        menu.doubleTapDelay--;
    },
    Draw: function() {
        gfx.ClearSome(["characters", "HUD", "menutext"]);  
        const w = gfx.GetPixelX(1 / menu.options.length);
        const h = gfx.GetPixelY(0.1), y = gfx.GetPixelY(1) - h;
        switch(menu.state) {
            case 0: menu.DrawMainMenu(y); break;
            case 1: menu.DrawFightMenu(); break;
            case 2: menu.DrawTeamList(); break;
            case 3: menu.DrawSummonPage(); break;
            case 4: menu.DrawShop(); break;
        }
        if(menu.substate.hideBottom !== true) {
            for(let i = 0; i < menu.options.length; i++) {
                gfx.DrawButton(i * w, y, w, h, menu.options[i], this.state === i || this.pressedButton === i, false);
            }
        }
    },

    DrawShop: function() {
        const full = gfx.GetPixelX(1), half = full / 2;
        const textHeight = gfx.GetPixelY(0.05), middle = gfx.GetPixelY(0.35);
        gfx.DrawTextbox(0, 0, full, textHeight, "Pay Real Money for Fake Money!");
        gfx.DrawTextbox(0, textHeight, full, textHeight, "ERROR CONNECTING TO PAYMENTS SERVER.");
        gfx.DrawTextbox(0, 2 * textHeight, full, textHeight, "UNABLE TO PROCESS TRANSACTIONS AT THIS TIME.");
        gfx.DrawButton(0, middle, full, textHeight, "Buy 5 ePloids for $5", true, false);
        gfx.DrawButton(0, middle + textHeight, full, textHeight, "Buy 20 ePloids for $21", true, false);
        gfx.DrawButton(0, middle + 2 * textHeight, full, textHeight, "Buy 60 ePloids for $80", true, false);
        gfx.DrawButton(0, middle + 3 * textHeight, full, textHeight, "Buy 100 ePloids for $1,500", true, false);
        gfx.DrawButton(0, middle + 4 * textHeight, full, textHeight, "Buy 500 ePloids for $10,000", true, false);
        gfx.DrawButton(0, middle + 5 * textHeight, full, textHeight, "Buy 1000 ePloids for $1bil", true, false);
        gfx.DrawButton(0, middle + 6 * textHeight, full, textHeight, "Buy 5 ePloids for 500 Coinies", menu.substate.btnPress === 1, player.coins < 500);
        gfx.DrawTextbox(0, middle + 7 * textHeight, half, textHeight, "You have " + player.coins + " Coinies.");
        gfx.DrawTextbox(half, middle + 7 * textHeight, half, textHeight, "You have " + player.eploids + " ePloids.");
    },

    DrawMainMenu: function(buttonBottomY) {
        const si = menu.substate;
        const full = gfx.GetPixelX(1), half = full / 2;
        const textHeight = gfx.GetPixelY(0.1);
        if(si.state === 0) {
            menu.DrawMainMenuContent(si, textHeight, full);
            gfx.DrawTextbox(0, 0, half, textHeight / 2, "Coinies: " + player.coins);
            gfx.DrawTextbox(half, 0, half, textHeight / 2, "ePloids: " + player.eploids);
            gfx.DrawEffect(0, textHeight / 2, 5, 1, textHeight / 2);
            gfx.DrawEffect(half, textHeight / 2, 5, 0, textHeight / 2);
            // TODO: music, sound, and settings controls
            //gfx.DrawButton(0, buttonBottomY - textHeight, half, textHeight, "Missions (" + si.missions.numPrizes + ")", si.btnPress === 1);
            gfx.DrawButton(half, buttonBottomY - textHeight, half, textHeight, "Messages (" + si.msg.length + ")", si.btnPress === 2);
        } else if(si.state === 1) { // MISSION TODO
            gfx.DrawTextbox(0, 0, full, textHeight, "Available Missions");
            const topY = gfx.GetPixelY(0.3);
            const left = gfx.GetPixelX(0.8), right = gfx.GetPixelX(0.2);
            for(let i = 0; i < si.missions.active.length; i++) {
                const me = si.missions.active[i];
                gfx.DrawTextbox(0, topY + i * textHeight, left, textHeight, "Clear '" + (me.name || quests[me.eID].name) + ".'");
                gfx.DrawButton(left, topY +  i * textHeight, right, textHeight, "Fuck");
            }
            gfx.DrawButton(0, buttonBottomY - textHeight, full, textHeight, "Back", si.btnPress === 4, false, 0.35);
        } else if(si.state === 2) { // Notifications
            const topY = gfx.GetPixelY(0.4), qtrY = topY / 2;
            if(si.msg.length === 0) {
                gfx.DrawTextbox(0, topY, full, textHeight, "You have no new messages.");
            } else {
                gfx.DrawTextbox(0, qtrY - 40, full, topY + 40, "");
                gfx.DrawWrappedText(si.msg[0].text, half, qtrY, full, topY, true);
            }
            gfx.DrawButton(0, buttonBottomY - textHeight, full, textHeight, "Dismiss", si.btnPress === 1);
        }
    },
    DrawMainMenuContent: function(si, textHeight, full) {
        const padding = gfx.GetPixelX(0.05);
        if(player.storyState === 0) {
            gfx.DrawGachaToScale(gachas[37], gfx.GetPixelX(-0.2), gfx.GetPixelY(0.9), 1, true);
            gfx.DrawTextbox(0, textHeight, full, 2 * textHeight, "");
            gfx.DrawWrappedText("Dover Scout: Hey stranger, I need your help! Tap the \"Fight\" menu button below and start Story Mode!", padding, textHeight + padding, full - 2 * padding, 2 * textHeight - 2 * padding, false);
        } else {
            gfx.DrawGachaToScale(si.buddy, gfx.GetPixelX(-0.2), gfx.GetPixelY(0.9), 1, true);
            gfx.DrawTextbox(0, textHeight, full, 2 * textHeight, "");
            gfx.DrawWrappedText(si.buddy.name + ": " + si.buddyMsg, padding, textHeight + padding, full - 2 * padding, 2 * textHeight - 2 * padding, false);
        }
    },
    DrawFightMenu: function() {
        const si = menu.substate;
        const full = gfx.GetPixelX(1);
        const textHeight = gfx.GetPixelY(0.05);
        const padding = gfx.GetPixelX(0.05);
        if(si.state === 0) {
            const hsize = gfx.GetPixelX(0.45), vsize = gfx.GetPixelX(0.28);
            const lpadding = gfx.GetPixelX(0.05), rpadding = gfx.GetPixelX(0.95) - hsize, vpadding = gfx.GetPixelY(0.22);
    
            gfx.DrawMapIcon(lpadding, 0, 1, 0, hsize);
            gfx.DrawButton(lpadding, vsize, hsize, textHeight, "Story Mode", si.btnPress === 1, false);
            
            gfx.DrawMapIcon(rpadding, vpadding, 0, 0, hsize);
            gfx.DrawButton(rpadding, vpadding + vsize, hsize, textHeight, "The Colosseum", si.btnPress === 2, false);
    
            gfx.DrawMapIcon(lpadding, 2 * vpadding, 0, 1, hsize);
            gfx.DrawButton(lpadding, 2 * vpadding + vsize, hsize, textHeight, "Training", si.btnPress === 3, false);
            
            gfx.DrawMapIcon(rpadding, 3 * vpadding, 1, 1, hsize);
            gfx.DrawButton(rpadding, 3 * vpadding + vsize, hsize, textHeight, "Event Maps", si.btnPress === 4, false);
        } else if(si.state === 1) { // Story Mode
            gfx.DrawTextbox(0, 0, full, textHeight, "Chapter Select");
            const vtop = gfx.GetPixelY(0.1);
            const availableChapters = Math.floor(player.storyState / 5); // 5 missions per chapter
            let j = 1;
            for(let i = availableChapters; i >= 0; i--) {
                gfx.DrawButton(0, vtop + i * 1.5 * textHeight, full, 1.5 * textHeight, "Chapter " + j, si.btnPress === (i + 1), false, 0.5);
                j++;
            }
            gfx.DrawButton(0, vtop + 14 * textHeight, full, 1.75 * textHeight, "Back", si.btnPress === 14, false, 0.25);
        } else if(si.state === 2) { // The Colosseum
            const prizeS = 1 / menu.todaysPrizes.length;
            const prizeW = gfx.GetPixelX(prizeS);
            for(let j = player.todaysPrizesWon; j < menu.todaysPrizes.length; j++) {
                const i = j - player.todaysPrizesWon;
                gfx.DrawGachaFrame(i * prizeW, textHeight, prizeS, false, i === 0, 0);
                const me = menu.todaysPrizes[j];
                if(me.isCoins) {
                    gfx.DrawEffect(i * prizeW, textHeight + prizeW, 5, 1, prizeW);
                    gfx.DrawTextToFit(me.value, i * prizeW + prizeW / 2, textHeight + prizeW / 1.9, prizeW, undefined, 0.5);
                } else if(me.isPloids) {
                    gfx.DrawEffect(i * prizeW, textHeight + prizeW, 5, 0, prizeW);
                    gfx.DrawTextToFit(me.value, i * prizeW + prizeW / 2, textHeight + prizeW / 1.75, prizeW, undefined, 0.25);
                } else {
                    gfx.DrawGachaToScale(me, i * prizeW, textHeight, prizeS, false);
                }
            }
            for(let i = (menu.todaysPrizes.length - player.todaysPrizesWon); i < menu.todaysPrizes.length; i++) {
                gfx.DrawGachaFrame(i * prizeW, textHeight, prizeS, false, 0, 0);
            }
            gfx.DrawStillImage(0, gfx.GetPixelY(0.8), "banker", 450, 490, gfx.GetPixelX(1));
            // TODO: have him say some fucking words
            gfx.DrawTextbox(0, 0, full, textHeight, "Today's Prizes");
            gfx.DrawButton(0, textHeight + prizeW, full / 2, 1.75 * textHeight, "Fight", si.btnPress === 1, menu.todaysPrizes.length === player.todaysPrizesWon, 0.5);
            gfx.DrawButton(0, gfx.GetPixelY(0.8), full, 1.75 * textHeight, "Back", si.btnPress === 2, false, 0.25);
        } else if(si.state === 3) { // Training
            gfx.DrawTextbox(0, 0, full, textHeight, "Training Battles");
            const vtop = gfx.GetPixelY(0.1);
            for(let i = 0; i < 13; i++) {
                let recLevel = 0;
                if(i === 0) {
                    recLevel = 100;
                } else if(i < 7) {
                    recLevel = 90 - i * 10;
                } else {
                    recLevel = (13 - i) * 4;
                }
                gfx.DrawButton(0, vtop + i * textHeight, full, textHeight, "Training " + String.fromCharCode(65 + i) + " (Lv." + recLevel + ")", si.btnPress === (i + 1));
            }
            gfx.DrawButton(0, vtop + 14 * textHeight, full, 1.75 * textHeight, "Back", si.btnPress === 14, false, 0.25);
        } else if(si.state === 4) { // Event Maps
            gfx.DrawTextbox(0, 0, full, textHeight, "Event Map Battles");
            gfx.DrawTextbox(0, textHeight, full, textHeight, "Current Event: Clowning Around");
            gfx.DrawGachaToScale({ file: "pd2", x: 0, y: 1 }, gfx.GetPixelX(-0.1), gfx.GetPixelY(0.05), 0.8, false);
            const vtop = gfx.GetPixelY(0.3), icoSize = gfx.GetPixelX(0.1);
            for(let i = 0; i < 5; i++) {
                const eID = "eventApr" + i;
                const e = quests[eID];
                gfx.DrawButton(0, vtop + i * 2 * textHeight, full, 2 * textHeight, e.name + " (Lv." + e.recommendedLevel + ")", si.btnPress === (i + 1));
                const completed = player.questsCleared.indexOf(eID) >= 0;
                const sx = completed ? 6 : 5, sy = completed ? 0 : e.prizeType;
                const prizeY = vtop + i * 2 * textHeight + textHeight;
                gfx.DrawEffect(0, prizeY, sx, sy, icoSize);
                if(!completed) {
                    gfx.DrawTextToFit("x" + e.firstClear, icoSize, prizeY - textHeight / 2, icoSize);
                }
            }
            gfx.DrawButton(0, vtop + 10 * textHeight, full, 1.75 * textHeight, "Back", si.btnPress === 6, false, 0.25);
        } else if(si.state === 5) { // Confirm or Deny!
            const completed = player.questsCleared.indexOf(si.battleID) >= 0;
            const infoBoxTop = gfx.GetPixelY(0.4), icoSize = gfx.GetPixelX(0.15);
            const e = quests[si.battleID];
            if(completed) {
                gfx.DrawTextbox(0, infoBoxTop, full, 4 * textHeight, "");
                gfx.DrawWrappedText("You have already completed this mission, but you can still earn EXP from playing it again.", 40, infoBoxTop + 20, full - 40, 3.5 * textHeight);
            } else {
                const icoPadding = gfx.GetPixelX(0.3333);
                const prizeText = e.prizeType === 2 ? "a Colosseum Prize" : (e.firstClear + (e.prizeType === 1 ? " Coinies" : " ePloids"));
                gfx.DrawTextbox(0, infoBoxTop, full, 4 * textHeight, "");
                gfx.DrawWrappedText("You will earn " + prizeText + " for completing this mission.", 40, infoBoxTop + 20, full - 40, 2.5 * textHeight);
                if(e.prizeType != 2) {
                    gfx.DrawEffect(icoPadding, infoBoxTop + 3.6 * textHeight, 5, e.prizeType, icoSize);
                    gfx.DrawTextToFit("x" + e.firstClear, icoPadding + 1.25 * icoSize, infoBoxTop + 3 * textHeight, icoSize);
                }
            }
            
            const topW = gfx.GetPixelX(0.25), topY = gfx.GetPixelY(0.05);
            const textBoxWidth = gfx.GetPixelX(0.66);
            gfx.DrawTextbox(0, 0, textBoxWidth, topY, "Your Party");
            for(let i = 0; i < 4; i++) {
                const x = i * topW;
                gfx.DrawGachaFrame(x, topY, 0.25, false, 0, 1);
                if(i < player.party.length) {
                    const me = player.gachas[player.party[i]];
                    gfx.DrawGachaToScale(me, x, topY, 0.25, false);
                }
            }
            const vtop = gfx.GetPixelY(0.2);
            gfx.DrawTextbox(0, vtop, full, 2 * textHeight, e.name);
            gfx.DrawTextbox(0, vtop + 2 * textHeight, full, textHeight, "Recommended Level: " + e.recommendedLevel);
            
            const btnTop = infoBoxTop + 5 * textHeight;
            gfx.DrawButton(0, btnTop, full, textHeight * 2, "Fight!", si.btnPress === 1, false, 0.5);
            gfx.DrawButton(0, btnTop + 2 * textHeight, full, textHeight * 2, "Back", si.btnPress === 2, false, 0.5);
        } else if(si.state === 6) { // Story Select
            gfx.DrawTextbox(0, 0, full, textHeight, "Mission Select");
            const vtop = gfx.GetPixelY(0.1);
            const chapter = si.chapter;
            let availableMissions = player.storyState - chapter * 5;
            if(availableMissions >= 5) { availableMissions = 4; }
            let j = 0;
            for(let i = availableMissions; i >= 0; i--) {
                const me = quests["story" + chapter + "-" + i];
                gfx.DrawButton(0, vtop + j * 1.5 * textHeight, full, 1.5 * textHeight, (chapter + 1) + "-" + (i + 1) + ": " + me.name, si.btnPress === (i + 1), false);
                j++;
            }
            gfx.DrawButton(0, vtop + 14 * textHeight, full, 1.75 * textHeight, "Back", si.btnPress === 14, false, 0.25);
        } else if(si.state === 7) { // Cutscene
            const csInfo = quests[si.battleID].cutscene;
            let textInfo = csInfo[si.cutsceneIdx], isEnd = false;
            if(csInfo.length === si.cutsceneIdx) {
                textInfo = csInfo[si.cutsceneIdx - 1];
                isEnd = true;
            }
            const topY = gfx.GetPixelY(0.5);
            gfx.DrawGachaToScale(gachas[textInfo.speaker], textInfo.left ? 0 : gfx.GetPixelX(0.2), topY + gfx.GetPixelY(0.05), 0.75, true);
            gfx.DrawTextbox(0, topY, full, topY, "");
            if(isEnd) {
                gfx.DrawWrappedText("Tap to begin the battle.", padding, topY + padding, full - 2 * padding, topY - 2 * padding, false, 48);
            } else {
                gfx.DrawWrappedText(textInfo.text, padding, topY + padding, full - 2 * padding, topY - 2 * padding, false, 48);
            }
        }
    },
    DrawSummonPage: function() {
        const si = menu.substate;
        if(si.state === 2) { return menu.DrawSummoning(); }
        const full = gfx.GetPixelX(1), half = full / 2;
        const textHeight = gfx.GetPixelY(0.05);
        const belowY = gfx.GetPixelY(0.6);
        if(si.state === 0) {
            gfx.DrawButton(0, belowY + textHeight, half, textHeight, "Appearance Rates", si.btnPress === 0);
            gfx.DrawTextbox(half, belowY + textHeight, half, textHeight, "ePloids: " + player.eploids);
            const redeem5Text = player.freeFiveCards > 0 ? "Redeem 5 free!" : "Summon 5 (20 ePloids)";
            gfx.DrawButton(0, belowY + 2.5 * textHeight, full, textHeight, redeem5Text, si.btnPress === 1, player.freeFiveCards === 0 && player.eploids < 20);
            gfx.DrawButton(0, belowY + 3.5 * textHeight, full, textHeight, "Summon 1 (5 ePloids)", si.btnPress === 2, player.eploids < 5);
        } else if(si.state === 1) {
            gfx.DrawWrappedText("5-Star Event: 5% \n 5-Star: 5% \n 4-Star: 35% \n 3-Star: 65% ", half, belowY + 1.9 * textHeight, full, 2.5 * textHeight, true);
            gfx.DrawTextbox(0, belowY + textHeight, full, 3.5 * textHeight, "");
            gfx.DrawTextToFit("The current summon rates are:", full / 2, belowY + 1.5 * textHeight, full, "#000000");
            gfx.DrawButton(half / 2, belowY + 4.5 * textHeight, half, textHeight * 1.2, "OK", si.btnPress === 0, false, 0.25);
        }
        gfx.DrawTextbox(0, 0, full, textHeight, "Public Domain Summoning");
        gfx.DrawTextbox(0, textHeight, full, textHeight, "Current Event: The April Fool");
        gfx.DrawGachaToScale({ file: "pd2", x: 3, y: 0 }, gfx.GetPixelX(0.25), gfx.GetPixelY(0.1), 0.4, false);
        gfx.DrawGachaToScale({ file: "pd2", x: 0, y: 0 }, gfx.GetPixelX(0.6), gfx.GetPixelY(0.15), 0.4, false);
        gfx.DrawGachaToScale({ file: "pd2", x: 1, y: 0 }, gfx.GetPixelX(-0.1), gfx.GetPixelY(0.15), 0.6, false);
        gfx.DrawGachaToScale({ file: "pd2", x: 0, y: 1 }, gfx.GetPixelX(0.1), gfx.GetPixelY(0.15), 0.8, false);
        gfx.DrawTextbox(0, belowY, full, textHeight, "Limited Time Event!");
    },
    DrawSummoning: function() {
        const si = menu.substate;
        const full = gfx.GetPixelX(1);
        const textHeight = gfx.GetPixelY(0.05);
        const chestSize = gfx.GetSizeFromScale(0.5);
        gfx.DrawTextbox(0, 0, full, textHeight, "Summoning In Progress!");
        if(si.animState < 70) {
            const percent = (si.animState / 70);
            const dx = percent * gfx.GetPixelX(0.75), dy = percent * gfx.GetPixelY(0.65);
            gfx.DrawChest(gfx.GetPixelX(1) - dx, gfx.GetPixelY(-0.25) + dy, 0, 0, chestSize);
            if(si.fromPrevious) {
                const x = gfx.GetPixelX(0.25);
                gfx.DrawChest(x - dx, gfx.GetPixelY(0.4) + dy, 1, 2, chestSize);
                gfx.DrawSparkle(x - dx, gfx.GetPixelY(0.25) + dy, 0.5, false, si.rotation, 1);
                if(si.newestFriend !== undefined) {
                    gfx.DrawGachaToScale(si.newestFriend, x - dx, gfx.GetPixelY(0.25) + dy, 0.5, false);
                }
                si.rotation += 0.01;
            }
            si.animState++;
        } else if(si.animState === 70) {
            gfx.DrawChest(gfx.GetPixelX(0.25), gfx.GetPixelY(0.4), 0, 0, chestSize);
        } else if(si.animState < 83) {
            const chestAnim = Math.floor((si.animState - 71) / 2);
            gfx.DrawChest(gfx.GetPixelX(0.25), gfx.GetPixelY(0.4), chestAnim % 2, Math.floor(chestAnim / 2), chestSize);
            si.animState++;
            si.rotation = 0;
        } else if(si.animState === 83) {
            si.animState = 100;
            si.rotation = 0;
            let attempts = 3;
            si.newestFriend = { isCoins: true };
            while(si.newestFriend.isCoins && attempts-- > 0) {
                console.log(`attempt ${3 - attempts}`);
                si.newestFriend = GetGatcha();
            }
            if(si.newestFriend.isCoins) {
                coinCounter++;
                player.coins += si.newestFriend.value;
            } else {
                gachaCounter++;
                player.gachas.push(si.newestFriend);
            }
            game.SaveData();
            gfx.DrawChest(gfx.GetPixelX(0.25), gfx.GetPixelY(0.4), 1, 2, chestSize);
        } else {
            gfx.DrawTextbox(0, textHeight, full, textHeight, si.newestFriend.name);
            const raritySize = gfx.GetPixelX(0.1);
            for(let i = 0; i < si.newestFriend.rarity; i++) {
                gfx.DrawRarity(10 + i * raritySize / 1.5, 3 * textHeight, raritySize, si.newestFriend.rarity === 5);
            }
            const x = gfx.GetPixelX(0.25);
            gfx.DrawChest(x, gfx.GetPixelY(0.4), 1, 2, chestSize);
            gfx.DrawSparkle(x, gfx.GetPixelY(0.25), 0.5, false, si.rotation, 1);
            gfx.DrawGachaToScale(si.newestFriend, x, gfx.GetPixelY(0.25), 0.5, false);
            si.rotation += 0.01;
        }
    },
    DrawTeamList: function() {
        const si = menu.substate;
        if(si.state === 0) { // friend list
            const topW = gfx.GetPixelX(0.25), topY = gfx.GetPixelY(0.05);
            const textBoxWidth = gfx.GetPixelX(0.66);
            gfx.DrawTextbox(0, 0, textBoxWidth, topY, "Your Party");
            for(let i = 0; i < 4; i++) {
                const x = i * topW;
                const selected = si.selectType === 0 && si.selected === i;
                gfx.DrawGachaFrame(x, topY, 0.25, false, selected ? 1 : 0, selected ? 0 : 1);
                if(i < player.party.length) {
                    const me = player.gachas[player.party[i]];
                    gfx.DrawGachaToScale(me, x, topY, 0.25, false);
                }
            }

            const inverse = 1 / si.numPerRow;
            const w = gfx.GetPixelX(inverse);
            const iMax = Math.min(si.page * si.maxPerPage + si.maxPerPage, player.gachas.length);
            const start = si.page * si.maxPerPage;
            gfx.DrawTextbox(0, si.topY - topY, textBoxWidth, topY, "Your Friends (" + player.gachas.length + "/" + gachas.length + ")");
            for(let i = start; i < iMax; i++) {
                const me = player.gachas[i];
                const x = ((i - start) % si.numPerRow) * w, y = si.topY + w * Math.floor((i - start) / si.numPerRow);
                const isInParty = player.party.indexOf(i) >= 0;
                const selected = si.selectType === 1 && si.selected === i;
                gfx.DrawGachaFrame(x, y, inverse, false, selected ? 1 : 0, selected ? 0 : (isInParty ? 1 : 0));
                gfx.DrawGachaToScale(me, x, y, inverse, false);
            }
            const yBottom = si.topY + w * (si.maxPerPage / si.numPerRow);
            const bWidth = gfx.GetPixelX(0.5), bHeight = gfx.GetPixelY(0.07);
            gfx.DrawButton(0, yBottom, bWidth, bHeight, "Back", si.btnPress === -1, si.page === 0, 0.5);
            gfx.DrawButton(bWidth, yBottom, bWidth, bHeight, "Next", si.btnPress === 1, si.page === si.pageMax, 0.5);
        } else if(si.state >= 1) { // friend details
            const me = player.gachas[si.selected];
            const topY = gfx.GetPixelX(0.8), width = gfx.GetPixelX(1), half = width / 2;
            const textHeight = gfx.GetPixelY(0.05);
            gfx.DrawGachaToScale(me, gfx.GetPixelX(0.1), 0, 0.8, false);

            const descY = topY + 5 * textHeight, descH = 2.7 * textHeight;
            gfx.DrawTextbox(0, descY, width, descH, "");
            if(si.state === 1) { // Must be written first because I hacked this shit together
                gfx.DrawWrappedText(me.desc, 20, descY + 20, width - 30, 0.8 * descH);
                gfx.DrawButton(0, descY + descH, half, textHeight, "Back", si.btnPress === -1, false, 0.5);
                gfx.DrawButton(half, descY + descH, half, textHeight, "Upgrade", si.btnPress === 1, false, 0.5);
            } else if(si.state === 2) {
                const cost = GetGatchaUpgradePrice(me);
                if(player.coins < cost) {
                    gfx.DrawWrappedText("Upgrading will increase this character's level by 5 and would cost " + cost + " Coinies, but you only have " + player.coins + ".", 20, descY + 20, width - 20, 0.8 * descH);
                } else {
                    gfx.DrawWrappedText("Upgrading will increase this character's level by 5 and will cost " + cost + " Coinies. You have " + player.coins + " Coinies.", 20, descY + 20, width - 20, 0.8 * descH);
                }
                gfx.DrawButton(0, descY + descH, half, textHeight, "No", si.btnPress === -1, false, 0.3);
                gfx.DrawButton(half, descY + descH, half, textHeight, "Yes", si.btnPress === 1, player.coins < cost, 0.3);
            }

            gfx.DrawTextbox(0, topY, width, textHeight, me.name);
            gfx.DrawTextbox(0, topY + textHeight, half, textHeight, "Level: " + me.level);
            gfx.DrawTextbox(half, topY + textHeight, half, textHeight, "EXP: " + me.exp + "/" + me.expToNextLevel);
            gfx.DrawTextbox(0, topY + 2 * textHeight, half, textHeight, "HP: " + me.maxhp);
            gfx.DrawTextbox(half, topY + 2 * textHeight, half, textHeight, "POW: " + me.power);
            gfx.DrawTextbox(0, topY + 3 * textHeight, half, textHeight, "Cooldown: " + (me.cooldown1 / 10) + "s");
            gfx.DrawTextbox(half, topY + 3 * textHeight, half, textHeight, "Sp.Cooldown: " + (me.cooldown2 / 10) + "s");
            gfx.DrawTextbox(0, topY + 4 * textHeight, width, textHeight, "Special: " + specials[me.special].name);
            
            const raritySize = gfx.GetPixelX(0.1), rarityGap = gfx.GetPixelY(0.01);
            for(let i = 0; i < me.rarity; i++) {
                gfx.DrawRarity(10 + i * raritySize / 1.5, topY + rarityGap, raritySize, me.rarity === 5);
            }
        }
    },
    
    GetMouseLocation: function(e) {
        // Check Bottom Menu
        const h = gfx.GetPixelY(0.1), y = gfx.GetPixelY(1) - h;
        const si = menu.substate;
        if(e.pageY >= y && !(menu.state === 1 && si.state === 7)) {
            const w = gfx.GetPixelX(1 / menu.options.length);
            for(let i = 0; i < menu.options.length; i++) {
                if(e.pageX >= (i * w) && e.pageX <= (i * w + w)) {
                    menu.pressedButton = i;
                    return { type: "option", idx: i };
                }
            }
            return { type: "none" };
        }
        if(menu.state === 0) { // Main Menu
            const half = gfx.GetPixelX(0.5);
            const textHeight = gfx.GetPixelY(0.1);
            if(si.state === 0) {
                if(e.pageY >= (y - textHeight) && e.pageY < y) {
                    if(e.pageX < half) {
                        //return { type: "mainMenuPress", idx: 1 }; // MISSION TODO
                    } else {
                        return { type: "mainMenuPress", idx: 2 };
                    }
                }
            } else if(si.state === 2) {
                if(e.pageY >= (y - textHeight) && e.pageY < y) {
                    return { type: "mainMenuPress", idx: 1 };
                }
            }
        } else if(menu.state === 1) { // Battles
            const textHeight = gfx.GetPixelY(0.05);
            if(si.state === 0) { // Main Spot
                const hsize = gfx.GetPixelX(0.45), vsize = gfx.GetPixelX(0.28);
                const lpadding = gfx.GetPixelX(0.05), rpadding = gfx.GetPixelX(0.95) - hsize, vpadding = gfx.GetPixelY(0.22);
                for(let i = 0; i < 4; i++) {
                    const left = (i % 2 === 0) ? lpadding : rpadding;
                    if(e.pageY >= (i * vpadding) && e.pageY <= (i * vpadding + vsize + textHeight) && e.pageX >= left && e.pageX <= (left + hsize)) {
                        return { type: "battleMenuPress", idx: (i + 1) };
                    }
                }
            } else if(si.state === 1) { // Chapter Select
                const vtop = gfx.GetPixelY(0.1);
                if(e.pageY >= (vtop + 14 * textHeight)) {
                    return { type: "battleBack", newState: 0, idx: 14 };
                }
                const availableChapters = Math.floor(player.storyState / 5);
                let j = 0;
                for(let i = availableChapters; i >= 0; i--) {
                    if(e.pageY >= (vtop + (i * 1.5 * textHeight)) && e.pageY <= (vtop + (i * 1.5 * textHeight) + 1.5 * textHeight)) {
                        return { type: "chapterSelect", idx: (i + 1), chapter: j };
                    }
                    j++;
                }
            } else if(si.state === 2) { // Colosseum
                const full = gfx.GetPixelX(1);
                const prizeS = 1 / menu.todaysPrizes.length;
                const prizeW = gfx.GetPixelX(prizeS);
                if(e.pageX <= (full / 2) && e.pageY >= (textHeight + prizeW) && e.pageY <= (2.75 * textHeight + prizeW)) {
                    return { type: "battleSelect", event: "coll", idx: 1, isColl: true };
                } else if(e.pageY >= gfx.GetPixelY(0.8)) {
                    return { type: "battleBack", newState: 0, idx: 2 };
                }
            } else if(si.state === 3) { // Training
                const vtop = gfx.GetPixelY(0.1);
                for(let i = 0; i < 13; i++) {
                    if(e.pageY >= (vtop + (i * textHeight)) && e.pageY <= (vtop + (i * textHeight) + textHeight)) {
                        return { type: "battleSelect", event: ("training" + i), idx: (i + 1), isTraining: true };
                    } else if(e.pageY >= (vtop + 14 * textHeight)) {
                        return { type: "battleBack", newState: 0, idx: 14 };
                    }
                }
            } else if(si.state === 4) { // Events
                const vtop = gfx.GetPixelY(0.3);
                for(let i = 0; i <= 5; i++) {
                    if(e.pageY >= (vtop + (i * 2 * textHeight)) && e.pageY <= (vtop + (i * 2 * textHeight) + (2 * textHeight))) {
                        if(i === 5) {
                            return { type: "battleBack", newState: 0, idx: (i + 1) };
                        } else {
                            return { type: "battleSelect", event: ("eventApr" + i), idx: (i + 1) };
                        }
                    }
                }
            } else if(si.state === 5) { // Confirm
                const btnTop = gfx.GetPixelY(0.4) + 5 * textHeight;
                if(e.pageY >= btnTop && e.pageY <= (btnTop + textHeight * 2)) {
                    return { type: "battleConfirm", idx: 1 };
                } else if(e.pageY >= (btnTop + textHeight * 2) && e.pageY <= (btnTop + textHeight * 4)) {
                    return { type: "battleConfirm", idx: 2 };
                }
            } else if(si.state === 6) { // Story Select
                const vtop = gfx.GetPixelY(0.1);
                if(e.pageY >= (vtop + 14 * textHeight)) {
                    return { type: "storyBack", newState: 0, idx: 14 };
                }
                const chapter = si.chapter;
                let availableMissions = player.storyState - chapter * 5;
                if(availableMissions >= 5) { availableMissions = 4; }
                let j = 0;
                for(let i = availableMissions; i >= 0; i--) {
                    if(e.pageY >= (vtop + (j * 1.5 * textHeight)) && e.pageY <= (vtop + (j * 1.5 * textHeight) + 1.5 * textHeight)) {
                        return { type: "battleSelect", event: "story" + si.chapter + "-" + i, idx: (i + 1) };
                    }
                    j++;
                }
            } else if(si.state === 7) { // Cutscene
                return { type: "cutscene" };
            }
        } else if(menu.state === 3) { // Summon
            const belowY = gfx.GetPixelY(0.6), textHeight = gfx.GetPixelY(0.05);
            const full = gfx.GetPixelX(1), half = full / 2, qtr = half / 2;
            if(si.state === 0) { // Main Spot
                if(e.pageX <= half && e.pageY >= (belowY + textHeight) && e.pageY <= (belowY + 2 * textHeight)) {
                    return { type: "summonMenu", idx: 0 };
                } else if(e.pageY >= (belowY + 2.5 * textHeight) && e.pageY <= (belowY + 3.5 * textHeight)) {
                    return { type: "summonMenu", idx: 1 };
                } else if(e.pageY >= (belowY + 3.5 * textHeight) && e.pageY <= (belowY + 4.5 * textHeight)) {
                    return { type: "summonMenu", idx: 2 };
                }
            } else if(si.state === 1) { // Appearance Rates
                if(e.pageX >= qtr && e.pageX <= (half + qtr) && e.pageY >= (belowY + 4.5 * textHeight) && e.pageY <= (belowY + 5.7 * textHeight)) {
                    return { type: "summonMenu", idx: 0 };
                }
            } else if(si.state === 2) { // Opening Chest
                return { type: "openChest" };
            }
        } else if(menu.state === 2) { // Teams
            if(si.state === 0) { // friend list
                const yBottom = si.topY + gfx.GetPixelX(1 / si.numPerRow) * (si.maxPerPage / si.numPerRow);
                if(e.pageY >= yBottom) { // Pagination
                    const bWidth = gfx.GetPixelX(0.5);
                    return { type: "paginateGachas", dir: (e.pageX <= bWidth ? -1 : 1) };
                } else if(e.pageY < si.topY) { // Current Party
                    const topW = gfx.GetPixelX(0.25); // yes I could use math instead of looping but
                    for(let i = 0; i < 4; i++) {
                        const x = i * topW;
                        if(e.pageX >= x && e.pageX <= (x + topW)) {
                            return { type: "partyPress", selType: 0, idx: i };
                        }
                    }
                } else { // Misc. Friends
                    const inverse = 1 / si.numPerRow;
                    const w = gfx.GetPixelX(inverse);
                    const iMax = Math.min(si.page * si.maxPerPage + si.maxPerPage, player.gachas.length);
                    const start = si.page * si.maxPerPage;
                    for(let i = start; i < iMax; i++) {
                        const x = ((i - start) % si.numPerRow) * w, y = si.topY + w * Math.floor((i - start) / si.numPerRow);
                        if(e.pageX >= x && e.pageX <= (x + w) && e.pageY >= y && e.pageY <= (y + w)) {
                            return { type: "partyPress", selType: 1, idx: i };
                        }
                    }
                }
            } else if(si.state >= 1) { // friend details or upgrading
                const yBottom = si.topY + gfx.GetPixelX(1 / si.numPerRow) * (si.maxPerPage / si.numPerRow);
                if(e.pageY >= yBottom) { // Pagination
                    const bWidth = gfx.GetPixelX(0.5);
                    return { type: si.state === 1 ? "friendDtClick" : "friendDt2Click", dir: (e.pageX <= bWidth ? -1 : 1) };
                }
            }
        } else if(menu.state === 4) { // Shop
            const textHeight = gfx.GetPixelY(0.05), middle = gfx.GetPixelY(0.35);
            const top = middle + 6 * textHeight;
            if(e.pageY >= top && e.pageY <= (top + textHeight)) {
                return { type: "shop", idx: 1 };
            }
        }
        return { type: "none" };        
    },

    HandlePress: function(e) {
        const si = menu.substate;
        const press = menu.GetMouseLocation(e);
        switch(press.type) {
            case "option":
                menu.pressedButton = press.idx;
                break;
            case "shop":
            case "mainMenuPress":
            case "chapterSelect":
            case "battleConfirm":
            case "battleBack":
            case "battleSelect":
            case "battleMenuPress":
            case "storyBack":
            case "summonMenu":
                si.btnPress = press.idx;
                break;
            case "paginateGachas":
            case "friendDtClick":
            case "friendDt2Click":
                si.btnPress = press.dir;
                break;
        }
    },
    HandleRelease: function() {
        menu.pressedButton = -1;
        menu.substate.btnPress = (menu.state === 3 ? -1 : 0);
    },
    HandleClick: function(e) {
        const si = menu.substate;
        const press = menu.GetMouseLocation(e);
        switch(press.type) {
            case "shop":
                if(player.coins >= 500) {
                    player.coins -= 500;
                    player.eploids += 5;
                }
                break;
            case "mainMenuPress":
                menu.HandleMainMenuClick(si, press);
                break;
            case "storyBack":
                si.state = 1;
                break;
            case "chapterSelect":
                si.state = 6;
                si.chapter = press.chapter;
                break;
            case "cutscene":
                const csInfo = quests[si.battleID].cutscene;
                if(csInfo.length === si.cutsceneIdx) {
                    game.SwitchToBattle(quests[si.battleID], { state: 1, substate: 6, storyChapter: si.chapter }, si.battleID); 
                } else {
                    si.cutsceneIdx++;
                }
                break;
            case "battleConfirm":
                if(press.idx === 2) { // Back
                    si.state = si.lastState;
                    si.lastState = undefined;
                    si.battleID = undefined;
                } else if(press.idx === 1) { // Fight!
                    if(quests[si.battleID].cutscene !== undefined) {
                        gfx.DrawBackground(quests[si.battleID].map, false);
                        si.state = 7; si.cutsceneIdx = 0; si.hideBottom = true;
                    } else {
                        if(quests[si.battleID].storyId !== undefined) { si.lastState = 6; }
                        game.SwitchToBattle(quests[si.battleID], { state: 1, substate: si.lastState, storyChapter: si.chapter }, si.battleID); 
                    }
                }
                break;
            case "battleMenuPress":
                si.state = press.idx;
                if(si.state === 2) {
                    gfx.ClearLayer("background");
                    gfx.DrawBackground("bgcolus");
                }
                si.btnPress = 0;
                break;
            case "battleBack":
                gfx.ClearLayer("background");
                gfx.DrawBackground("bgmenu");
                si.state = press.newState;
                break;
            case "battleSelect":
                menu.HandleBattleSelectClick(si, press);
                break;
            case "option":
                if(menu.state === 3 && si.state === 2 && si.animState !== 100) { return; }
                if(menu.state !== press.idx) {
                    menu.state = press.idx;
                    menu.substate = menu.GetDefaultStateDetails(menu.state);
                }
                break;
            case "openChest":
                if(si.animState < 71) {
                    si.animState = 71;
                } else if(si.animState < 83) {
                    si.animState = 83;
                } else {
                    if(--si.numSummons > 0) {
                        si.state = 2; si.fromPrevious = true; si.animState = 0;
                    } else { si.state = 0; }
                }
                break;
            case "summonMenu":
                if(press.idx === 0) {
                    si.state = (si.state === 0 ? 1 : 0);
                } else if(press.idx === 1) {
                    if(player.freeFiveCards > 0) {
                        player.freeFiveCards -= 1;
                    } else if(player.eploids >= 20) {
                        player.eploids -= 20;
                    } else { return; }
                    si.state = 2; si.numSummons = 5; si.animState = 0; si.fromPrevious = false;
                } else if(press.idx === 2) {
                    if(player.eploids < 5) { return; }
                    player.eploids -= 5;
                    si.state = 2; si.numSummons = 1; si.animState = 0; si.fromPrevious = false;
                }
                break;
            case "paginateGachas": // state = 2, substate = 0
                if(press.dir < 0) {
                    si.page = Math.max(0, si.page - 1);
                } else {
                    si.page = Math.min(si.pageMax, si.page + 1);
                }
                si.btnPress = 0;
                break;
            case "partyPress":  // state = 2, substate = 0
                menu.HandlePartyPressClick(si, press);
                break;
            case "friendDtClick": // state = 2, substate = 1
                if(press.dir < 0) {
                    si.state = 0;
                    si.selected = -1; si.selectType = -1;
                } else {
                    si.state = 2;
                }
                si.btnPress = 0;
                break;
            case "friendDt2Click": // state = 2, substate = 2
                if(press.dir < 0) {
                    si.state = 1;
                } else {
                    const me = player.gachas[si.selected];
                    const cost = GetGatchaUpgradePrice(me);
                    if(cost > player.coins) { return; }
                    player.coins -= cost;
                    for(let i = 0; i < 5; i++) {
                        LevelUpGatcha(me);
                    }
                }
                si.btnPress = 0;
                break;
        }
    },
    HandleMainMenuClick: function(si, press) {
        if(si.state === 0) { // main menu
            si.state = press.idx;
        } else if(si.state === 1) { // Quest Menu

        } else if(si.state === 2) { // Viewing Notification List
            if(si.msg.length > 0) {
                player.messagesCleared.push(si.msg[0].idx);
            }
            si.msg = dailies.GetMessages();
            if(si.msg.length === 0) {
                si.state = 0;
            }
        }
    },
    HandleBattleSelectClick: function(si, press) {
        si.lastState = si.state;
        si.state = 5;
        if(press.isColl) {
            if(menu.todaysPrizes.length === player.todaysPrizesWon) { si.state = 2; return; }
            si.battleID = "coll";
            let recLevel = 0, maxEnemies = 4;
            for(let i = 0; i < player.party.length; i++) {
                const me = player.gachas[player.party[i]];
                recLevel += me.level;
            }
            recLevel = Math.floor(recLevel / player.party.length);
            switch(player.todaysPrizesWon) {
                case 0: recLevel = Math.ceil(recLevel * 0.75); maxEnemies = 2; break;
                case 1: recLevel = recLevel; maxEnemies = 3; break;
                case 2: recLevel = Math.ceil(recLevel * 1.15); break;
                case 3: recLevel = Math.ceil(recLevel * 1.4); break;
            }
            quests["coll"] = {
                name: "Colosseum", recommendedLevel: recLevel,
                firstClear: 0, prizeType: 2, isColl: true, noPersist: true, 
                enemies: GetRandomEnemySet(recLevel, maxEnemies)
            };
        } else if(press.isTraining) {
            const i = press.idx - 1;
            let recLevel = 0;
            if(i === 0) {
                recLevel = 100;
            } else if(i < 7) {
                recLevel = 90 - i * 10;
            } else {
                recLevel = (13 - i) * 4;
            }
            const invi = 14 - i;
            const eventName = "t" + i + "." + dailies.GetDayID();
            quests[eventName] = {
                name: "Training " + String.fromCharCode(65 + i), recommendedLevel: recLevel,
                firstClear: (invi * invi) * 100, prizeType: 1,
                enemies: GetRandomEnemySet(recLevel, (i < 5 ? 4 : (i < 10 ? 3 : 2)))
            };
            if(invi > 7) {
                quests[eventName].prizeType = 0;
                quests[eventName].firstClear = Math.ceil(quests[eventName].firstClear / 1200);
            }
            si.battleID = eventName;
        } else {
            si.battleID = press.event;
        }
    },
    HandlePartyPressClick: function(si, press) {
        if(si.selectType === press.selType && si.selected === press.idx) {
            if(menu.doubleTapDelay > 0 && si.selected < player.party.length) {
                si.state = 1;
                if(si.selectType === 0) {
                    si.selectType = 1;
                    si.selected = player.party[si.selected];
                }
                return;
            }
            si.selected = -1; si.selectType = -1;
        } else if(si.selectType === -1) { // first select
            si.selectType = press.selType;
            si.selected = press.idx;
            menu.doubleTapDelay = input.TapDelay;
        } else if(si.selectType === 0 && press.selType === 0) { // swap team member positions
            if(press.idx >= player.party.length || si.selected >= player.party.length) {
                si.selected = -1; si.selectType = -1;
                return;
            }
            const temp = player.party[si.selected];
            player.party[si.selected] = player.party[press.idx];
            player.party[press.idx] = temp;
            si.selected = -1; si.selectType = -1;
        } else if(si.selectType === 1 && press.selType === 1) { // you can't sort non-party members because fuck you I'm making this game in two days
            si.selectType = press.selType;
            si.selected = press.idx;
            menu.doubleTapDelay = input.TapDelay;
        } else { // add/remove from party
            const inPartyPos = si.selectType === 0 ? si.selected : press.idx;
            const inParty = player.party[inPartyPos];
            const outParty = si.selectType === 1 ? si.selected : press.idx;
            if(player.party.indexOf(outParty) >= 0) { // can't swap party out with party
                if(inParty === outParty) { // unless removing from party
                    player.party.splice(inPartyPos, 1);
                }
                si.selected = -1; si.selectType = -1;
                return;
            }
            if(inPartyPos >= player.party.length) {
                player.party.push(outParty);
            } else {
                player.party[inPartyPos] = outParty;
            }
            si.selected = -1; si.selectType = -1;
        }
    }
};