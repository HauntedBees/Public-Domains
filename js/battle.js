let draw = {};
const battle = {
    playerTeam: [], livingPlayerIndexes: [], 
    enemy: [], targetIdx: 0, lastState: { state: 0, substate: 0 },
    cursorRotation: 0, cursorSize: 0, 
    pressedButton: -1, gameTimer: 0,
    levelUps: [], expGained: 0, canExit: false, 
    questID: "", prizeInfo: null, overState: 0, 
    SetUp: function(enemyInfo, lastState, questID) {
        const quest = quests[questID];
        if(quest !== undefined) {
            const map = quest.map || "bg0";
            gfx.DrawBackground(map, true);
        } else {
            gfx.DrawBackground("bg" + Math.floor(Math.random() * 5), true);
        }
        battle.cursorRotation = 0;
        battle.cursorSize = 0;
        battle.pressedButton = -1;
        battle.overState = 0;
        draw = {};
        battle.SetUpPlayers();
        battle.SetUpEnemies(enemyInfo);
        battle.prizeInfo = enemyInfo;
        battle.gameTimer = setInterval(battle.BattleLoop, 100);
        battle.lastState = lastState;
        battle.questID = questID || "";
        battle.levelUps = [];
        battle.expGained = 0;
    },
    CleanUp: function() {
        gfx.ClearAll();
        clearInterval(battle.gameTimer);
    },
    EndBattle: function(won) {
        clearInterval(battle.gameTimer);
        battle.overState = won ? 2 : 1;
        if(won) {
            if(battle.questID.indexOf("|") < 0) {
                const d = new Date();
                const todayID = battle.questID + "|" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
                if(player.questsCleared.indexOf(todayID) < 0) { player.questsCleared.push(todayID); }
            }
            if(player.questsCleared.indexOf(battle.questID) < 0) {
                if(!battle.prizeInfo.noPersist) { player.questsCleared.push(battle.questID); }
                if(battle.prizeInfo.prizeType === 0) {
                    player.eploids += battle.prizeInfo.firstClear;
                } else if(battle.prizeInfo.prizeType === 1) {
                    player.coins += battle.prizeInfo.firstClear;
                } else if(battle.prizeInfo.prizeType === 2) { // colosseum
                    const prize = dailies.GetTodaysColosseum()[player.todaysPrizesWon++];
                    if(prize.isCoins) {
                        player.coins += prize.value;
                    } else if(prize.isPloids) {
                        player.eploids += prize.value;
                    } else {
                        player.gachas.push(Object.assign({}, prize));
                    }
                }
                const storyId = quests[battle.questID].storyId;
                if(storyId !== undefined) { player.storyState = Math.max(player.storyState, storyId) }
            }
            for(let i = 0; i < battle.playerTeam.length; i++) {
                const me = battle.playerTeam[i];
                if(me.hp <= 0) { continue; }
                const leveledUp = ApplyEXPToGatcha(me, battle.expGained);
                if(leveledUp) {
                    battle.levelUps.push(me.name + " is now Lv." + me.level + "!");
                }
            }
        }
        battle.canExit = false;
        game.SaveData();
        setTimeout(function() { battle.canExit = true; }, input.EndBattleDelay);
    },

    SetUpPlayers: function() {
        battle.playerTeam = [];
        battle.livingPlayerIndexes = [];
        draw["buttonSpace"] = Math.max(gfx.GetPixelY(0.2), 200);
        draw["playerY"] = gfx.GetPixelY(1) - draw["buttonSpace"];
        draw["playerScale"] = Math.min(0.4, 1 / player.party.length);
        draw["playerSize"] = gfx.GetSizeFromScale(draw["playerScale"]);
        draw["buttonHeight"] = draw["buttonSpace"] / 2;
        draw["healthHeight"] = draw["buttonHeight"] / 3;
        draw["meterHeight"] = draw["buttonHeight"] / 5;

        const leftPadding = gfx.GetPixelX((1 - (draw["playerScale"] * player.party.length)) / 2);
        for(let i = 0; i < player.party.length; i++) {
            const gacha = player.gachas[player.party[i]];
            InitGatchaForBattle(gacha);
            gacha.drawInfo = { tintOpacity: 0, x: leftPadding + gfx.GetPixelX(i * draw["playerScale"]) };
            battle.playerTeam.push(gacha);
            battle.livingPlayerIndexes.push(i);
        }
    },
    SetUpEnemies: function(enemyInfo) {
        battle.enemy = [];
        if(enemyInfo === undefined || enemyInfo.enemies === undefined) { // pick randomly
            const numEnemies = Math.floor(3 * Math.random());
            for(let i = 0; i < numEnemies; i++) {
                const gacha = GetGatcha(undefined, true);
                InitGatchaForBattle(gacha);
                gacha.drawInfo = { tintOpacity: 0, x: 0 };
                battle.enemy.push(gacha);
            }
        } else {
            for(let i = 0; i < enemyInfo.enemies.length; i++) {
                const gacha = GetGachaFromEnemyData(enemyInfo.enemies[i]);
                gacha.drawInfo = { tintOpacity: 0, x: 0 };
                battle.enemy.push(gacha);
            }
        }
        battle.RepositionEnemies();
    },
    RepositionEnemies: function() {
        draw["enemyY"] = gfx.GetPixelY(0.5);
        draw["enemyScale"] = Math.min(0.6, 1 / battle.enemy.length);
        draw["enemySize"] = gfx.GetSizeFromScale(draw["enemyScale"]);
        const leftPadding = gfx.GetPixelX((1 - (draw["enemyScale"] * battle.enemy.length)) / 2);
        for(let i = 0; i < battle.enemy.length; i++) {
            const gacha = battle.enemy[i];
            gacha.drawInfo.x = leftPadding + gfx.GetPixelX(i * draw["enemyScale"]);
        }
        battle.targetIdx = Math.floor(Math.random() * battle.enemy.length);
    },

    BattleLoop: function() {
        for(let i = 0; i < battle.playerTeam.length; i++) {
            const me = battle.playerTeam[i];
            if(me.currCool1 < me.cooldown1) { me.currCool1 = Math.min(me.cooldown1, me.currCool1 + (me.speed > 0 ? me.speedPower : 1)); }
            if(me.currCool2 < me.cooldown2) { me.currCool2++; }
            me.shield--; me.speed--; me.poison--; me.sand--; me.buff--; me.weak--; me.freeze--; me.ult--;
            if(me.poison > 0 && --me.poisonTimer <= 0) {
                me.drawInfo.tintColor = "#77005B";
                me.drawInfo.tintOpacity = 1;
                me.hp -= me.poisonPower;
                me.poisonTimer = 2 + Math.floor(13 * Math.random());
            }
        }
        for(let i = 0; i < battle.enemy.length; i++) {
            const me = battle.enemy[i];
            if(me.aggro > 0) { battle.targetIdx = i; }
            if(me.currCool2 === me.cooldown2 && Math.random() > 0.98) {
                battle.EnemyAttack(me, true);
            } else if(me.currCool1 === me.cooldown1 && Math.random() > 0.9) {
                battle.EnemyAttack(me, false);
            }
            if(me.currCool1 < me.cooldown1) { me.currCool1 = Math.min(me.cooldown1, me.currCool1 + (me.speed > 0 ? me.speedPower : 1)); }
            if(me.currCool2 < me.cooldown2) { me.currCool2++; }
            me.shield--; me.speed--; me.poison--; me.sand--; me.buff--; me.weak--; me.freeze--; me.ult--;
            if(me.poison > 0 && Math.random() < 0.1) {
                me.drawInfo.tintColor = "#77005B";
                me.drawInfo.tintOpacity = 1;
                me.hp -= me.poisonPower;
            }
        }
    },
    Draw: function() {
        gfx.ClearSome(["characters", "HUD", "menutext"]);
        battle.cursorRotation += 0.0525;
        battle.cursorSize += 0.125;
        const playerY = draw["playerY"];
        const playerSize = draw["playerSize"];
        const buttonHeight = draw["buttonHeight"];
        const healthHeight = draw["healthHeight"];
        const meterHeight = draw["meterHeight"];
        for(let i = 0; i < battle.playerTeam.length; i++) {
            const me = battle.playerTeam[i];
            const di = me.drawInfo;
            gfx.DrawGachaFrame(di.x, playerY, draw["playerScale"], true);
            if(me.hp <= 0) {
                di.tintColor = "#000000";
                di.tintOpacity = 0.75;
            }
            gfx.DrawGachaToScale(me, di.x, playerY, draw["playerScale"], true, di.tintColor, di.tintOpacity);
            di.tintOpacity -= 0.1;
            gfx.DrawHealthbar(di.x, playerY - playerSize - healthHeight, playerSize, healthHeight, me.hp, me.maxhp);
            gfx.DrawButton(di.x, playerY, playerSize, buttonHeight, "Attack", this.pressedButton === i, me.freeze > 0 || me.hp <= 0 || me.currCool1 < me.cooldown1);
            gfx.DrawAttackMeter(di.x, playerY + buttonHeight - meterHeight, playerSize, meterHeight, me.currCool1, me.cooldown1);
            gfx.DrawButton(di.x, playerY + buttonHeight, playerSize, buttonHeight, specials[me.special].name, this.pressedButton === (i + 0.5), me.freeze > 0 || me.hp <= 0 || me.currCool2 < me.cooldown2);
            gfx.DrawAttackMeter(di.x, playerY + 2 * buttonHeight - meterHeight, playerSize, meterHeight, me.currCool2, me.cooldown2);
            battle.DrawStatusEffects(me, playerY - playerSize - healthHeight / 2, playerSize, false);
            if(di.missCount-- > 0) { gfx.DrawTextToFit("MISS!", di.x + playerSize / 2, playerY - playerSize / 2, playerSize, "#FFFFFF"); }
        }
        const enemyY = draw["enemyY"];
        const enemySize = draw["enemySize"];
        for(let i = 0; i < battle.enemy.length; i++) {
            const me = battle.enemy[i];
            const di = me.drawInfo;
            gfx.DrawGachaToScale(me, di.x, enemyY, draw["enemyScale"], true, di.tintColor, di.tintOpacity);
            di.tintOpacity -= 0.1;
            gfx.DrawHealthbar(di.x, enemyY - enemySize - healthHeight, enemySize, healthHeight, me.hp, me.maxhp);
            battle.DrawStatusEffects(me, enemyY - enemySize - healthHeight / 2, enemySize, true);
            if(i === battle.targetIdx) {
                gfx.DrawCrosshair(di.x, enemyY, draw["enemyScale"], true, battle.cursorRotation, 1 + 0.15 * Math.sin(battle.cursorSize));
            }
            if(di.missCount-- > 0) { gfx.DrawTextToFit("MISS!", di.x + enemySize / 2, enemyY - enemySize / 2, enemySize, "#FFFFFF"); }
        }
        if(battle.overState > 0) { // 1 = lost / 2 = won
            const tHeight = gfx.GetPixelY(0.1);
            const middlin = gfx.GetPixelY(0.3) - 0.5 * (battle.levelUps.length * tHeight);
            const full = gfx.GetPixelX(1);
            let y = middlin + (2 * tHeight);
            gfx.DrawTextbox(0, middlin, full, 2 * tHeight, "You " + (battle.overState === 2 ? "Won!" : "Lost..."));
            for(let i = 0; i < battle.levelUps.length; i++) {
                gfx.DrawTextbox(0, y, full, tHeight, battle.levelUps[i]);
                y += tHeight;
            }
            gfx.DrawTextbox(0, y, full, tHeight, "Tap anywhere to continue.");
        }
    },
    DrawStatusEffects(me, y, size, isEnemy) {
        size *= isEnemy ? 0.15 : 0.3;
        let x = me.drawInfo.x;
        if(me.shield > 0) { gfx.DrawEffect(x, y, 0, 0, size); x += size; }
        if(me.speed > 0) { gfx.DrawEffect(x, y, 1, 0, size); x += size; }
        if(me.poison > 0) { gfx.DrawEffect(x, y, 2, 0, size); x += size; }
        if(me.sand > 0) { gfx.DrawEffect(x, y, 3, 0, size); x += size; }
        if(me.buff > 0) { gfx.DrawEffect(x, y, 0, 1, size); x += size; }
        if(me.freeze > 0) { gfx.DrawEffect(x, y, 1, 1, size); x += size; }
        if(me.weak > 0) { gfx.DrawEffect(x, y, 2, 1, size); x += size; }
        if(me.ult > 0) { gfx.DrawEffect(x, y, 3, 1, size); x += size; }
        if(me.aggro > 0) { gfx.DrawEffect(x, y, 4, 0, size); x += size; }
    },

    MissCheck: function(attacker, target, isSpecial, specialType) {
        if((attacker.sand > 0 && Math.random() < 0.7) || Math.random() < 0.1) {
            if(isSpecial) {
                if(targetEnemySkills.indexOf(specialType) < 0) { // attacks can't miss if they're not targeting enemies
                    return false;
                }
                attacker.currCool2 = 0;
            } else {
                attacker.currCool1 = 0;
            }
            target.drawInfo.tintColor = "#FFFFF";
            target.drawInfo.tintOpacity = 0.75;
            target.drawInfo.missCount = 10;
            return true;
        }
        return false;
    },
    GetEnemyTarget: function() {
        for(let i = 0; i < battle.livingPlayerIndexes.length; i++) {
            const targIdx = battle.livingPlayerIndexes[i];
            const targ = battle.playerTeam[targIdx];
            if(targ.hp > 0 && targ.aggro > 0) { return i; }
        }
        return Math.floor(Math.random() * battle.livingPlayerIndexes.length);
    },
    EnemyAttack: function(attacker, special) {
        if(attacker.freeze > 0 || attacker.hp <= 0) { return; }
        const targIdxIdx = battle.GetEnemyTarget();
        const targIdx = battle.livingPlayerIndexes[targIdxIdx];
        const target = battle.playerTeam[targIdx];
        if(battle.MissCheck(attacker, target, special, attacker.special)) { return; }
        if(special) {
            attacker.currCool2 = 0;
            specials[attacker.special].func(attacker, target, false);
        } else {
            battle.StandardAttack(attacker, target);
        }
        if(target.hp <= 0) {
            battle.livingPlayerIndexes.splice(targIdxIdx, 1);
            if(battle.livingPlayerIndexes.length === 0) {
                battle.EndBattle(false);
            }
        }
    },
    PlayerAttack: function(attackInfo) {
        const attacker = battle.playerTeam[attackInfo.player];
        const target = battle.enemy[battle.targetIdx];
        if(attacker.freeze > 0 || attacker.hp <= 0 || battle.MissCheck(attacker, target, attackInfo.special, attacker.special)) { return; }
        if(attackInfo.special) {
            attacker.currCool2 = 0;
            specials[attacker.special].func(attacker, target, true);
        } else {
            battle.StandardAttack(attacker, target);
        }
        if(target.hp <= 0) {
            battle.expGained += GetEXPFromGacha(target);
            battle.enemy.splice(battle.targetIdx, 1);
            if(battle.enemy.length > 0) {
                battle.RepositionEnemies();
            } else {
                battle.EndBattle(true);
            }
        }
    },
    StandardAttack: function(attacker, target) {
        attacker.currCool1 = 0;
        attacker.drawInfo.tintColor = "#FFFF00";
        attacker.drawInfo.tintOpacity = 0.75;
        target.drawInfo.tintColor = "#FF0000";
        target.drawInfo.tintOpacity = 1;

        let damage = attacker.power;
        if(attacker.buff > 0) { damage *= 1.5; }
        if(attacker.ult > 0) { damage *= 2.5; }
        if(target.weak > 0) { damage += target.weakPower; }
        if(target.shield > 0) { damage -= target.shieldPower; }
        target.hp -= Math.max(1, Math.ceil(damage));
    },

    GetMouseEventPosition: function(e) {
        // Check if it's an Enemy
        const enemyY = gfx.GetPixelY(0.5);
        if(e.pageY >= (enemyY - draw["enemySize"]) && e.pageY <= enemyY) {
            for(let i = 0; i < battle.enemy.length; i++) {
                const me = battle.enemy[i];
                if(e.pageX >= me.drawInfo.x && e.pageX <= (me.drawInfo.x + draw["enemySize"])) {
                    return { type: "enemy", idx: i };
                }
            }
            return { type: "none", idx: 0 };
        }
        // Check if it's a Button
        const buttonY = draw["playerY"];
        if(e.pageY >= buttonY) {
            for(let i = 0; i < battle.playerTeam.length; i++) {
                const me = battle.playerTeam[i];
                if(e.pageX >= me.drawInfo.x && e.pageX <= (me.drawInfo.x + draw["playerSize"])) {
                    const isSpecial = e.pageY >= (buttonY + draw["buttonSpace"] / 2);
                    return { type: "button", idx: i + (isSpecial ? 0.5 : 0), player: i, special: isSpecial };
                }
            }
        }
        return { type: "none", idx: 0 };
    },
    HandlePress: function(e) {
        const info = battle.GetMouseEventPosition(e);
        switch(info.type) {
            case "button": 
                battle.pressedButton = info.idx;
                break;
        }
    },
    HandleRelease: function(e) {
        battle.pressedButton = -1;
    },
    HandleClick: function(e) {
        if(battle.overState > 0) {
            if(battle.canExit) {
                game.SwitchFromBattle(battle.lastState);
            }
            return;
        }
        const info = battle.GetMouseEventPosition(e);
        switch(info.type) {
            case "enemy": 
                for(let i = 0; i < battle.enemy.length; i++) {
                    const me = battle.enemy[i];
                    if(me.aggro > 0) { return; }
                }
                battle.targetIdx = info.idx;
                break;
            case "button":
                const player = battle.playerTeam[info.player];
                if(info.special) {
                    if(player.currCool2 < player.cooldown2) { return; }
                    battle.PlayerAttack(info);
                } else {
                    if(player.currCool1 < player.cooldown1) { return; }
                    battle.PlayerAttack(info);
                }
                break;
        }
    }
};