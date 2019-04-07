let player = {
    gachas: [], party: [],
    eploids: 500, coins: 1000, 
    freeFiveCards: 1, storyState: 0, // max = 40 
    questsCleared: [], messagesCleared: [],
    todaysPrizesWon: 0, autoAttack: false
};
const specials = {
    "strong": {
        name: "Whack",  
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#FF0000", 1);
            t.hp -= a.power * 4;
        }
    },
    "shield": {
        name: "Shield",
        func: function(a, t) {
            DoTint(a, "#00FFFF", 2);
            a.shield = Math.min((a.rarity / 4) * 100, a.power * 5);
            a.shieldPower = (a.rarity - 2) * a.power;
        }
    },
    "shieldAll": {
        name: "ShieldAll",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#00FFFF", 2);
                me.shield = Math.min((a.rarity / 4) * 100, a.power * 5);
                me.shieldPower = (a.rarity - 2) * a.power;
            });
        }
    },
    "shield2": {
        name: "Shield2",
        func: function(a, t) {
            DoTint(a, "#00FFFF", 2);
            a.shield = Math.min((a.rarity / 4) * 150, a.power * 6);
            a.shieldPower = (a.rarity - 2) * 6 * a.power;
        }
    },
    "shieldAll2": {
        name: "ShieldAll2",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#00FFFF", 2);
                me.shield = Math.min((a.rarity / 4) * 150, a.power * 6);
                me.shieldPower = (a.rarity - 2) * 4 * a.power;
            });
        }
    },
    "shieldLong": {
        name: "LShield",
        func: function(a, t) {
            DoTint(a, "#00FFFF", 2);
            a.shield = Math.min((a.rarity / 4) * 300, a.power * 15);
            a.shieldPower = (a.rarity - 1) * a.power;
        }
    },
    "speed": {
        name: "Speed",
        func: function(a, t) {
            DoTint(a, "#0000FF", 1);
            a.speed = Math.min((a.rarity / 4) * 100, a.power * 5);
            a.speedPower = 2 * a.power;
        }
    },
    "speedAll": {
        name: "SpeedAll",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.speed = Math.min((a.rarity / 4) * 100, a.power * 5);
                me.speedPower = 2 * a.power;
            });
        }
    },
    "speed2": {
        name: "Speed2",
        func: function(a, t) {
            DoTint(a, "#0000FF", 1);
            a.speed = Math.min((a.rarity / 4) * 130, a.power * 6);
            a.speedPower = 4 * a.power;
        }
    },
    "speedAll2": {
        name: "SpeedAll2",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.speed = Math.min((a.rarity / 4) * 130, a.power * 6);
                me.speedPower = a.power * 2;
            });
        }
    },
    "poison": {
        name: "Poison",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#77005B", 1);
            t.poison = Math.min((a.rarity / 4) * 100, a.power * 5);
            t.poisonPower = a.rarity * a.rarity * a.power;
        }
    },
    "poison2": {
        name: "Poison2",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#77005B", 1);
            t.poison = Math.min((a.rarity / 4) * 150, a.power * 10);
            t.poisonPower = a.rarity * a.rarity * a.power * 2;
        }
    },
    "poisonAll": {
        name: "PoisonAll",
        func: function(a, t, isPlayer) {
            DoTint(a, "#FF00FF", 0.75);
            DoForAll(!isPlayer, function(me) {
                DoTint(me, "#77005B", 1);
                me.poison = Math.min((a.rarity / 4) * 100, a.power * 5);
                me.poisonPower = (a.rarity - 2) * a.rarity * a.power;
            });
        }
    },
    "sand": {
        name: "Sand",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#666666", 1);
            t.sand = Math.min((a.rarity / 4) * 100, a.power * 5);
        }
    },
    "buff": {
        name: "BuffAll",
        func: function(a, t, isPlayer) {
            DoTint(a, "#FF00FF", 0.75);
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#77005B", 1);
                me.buff = Math.min((a.rarity / 4) * 100, a.power * 5);
            });
        }
    },
    "revive": {
        name: "Revive",
        func: function(a, t, isPlayer) {
            const arr = isPlayer ? battle.playerTeam : battle.enemy;
            for(let i = 0; i < arr.length; i++) {
                const me = arr[i];
                if(me.hp > 0) { continue; }
                me.hp = Math.round(me.maxhp / 3);
                DoTint(a, "#FFFF77", 1);
                DoTint(me, "#FFFF77", 1);
                return;
            }
            DoTint(a, "#222200", 1);
        }
    },
    "heal": {
        name: "HealSelf",
        func: function(a, t) {
            DoTint(a, "#FFFFFF", 1);
            a.hp = Math.min(a.maxhp, a.hp + a.power * a.rarity);
        }
    },
    "healAll": {
        name: "HealAll",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#FFFFFF", 1);
                me.hp = Math.min(me.maxhp, me.hp + a.power * a.rarity);
            });
            DoTint(a, "#FFFFAA", 0.75);
        }
    },
    "healWeak": {
        name: "HealWeak",
        func: function(a, t, isPlayer) {
            const arr = isPlayer ? battle.playerTeam : battle.enemy;
            let lowestHP = 99999, lowestIdx = 0;
            for(let i = 0; i < arr.length; i++) {
                const me = arr[i];
                if(me.hp <= 0) { continue; }
                if(me.hp < lowestHP) {
                    lowestHP = me.hp;
                    lowestIdx = i;
                }
            }
            const weakest = arr[lowestIdx];
            DoTint(a, "#FFFFAA", 0.75);
            DoTint(weakest, "#FFFFFF", 0.75);
            weakest.hp = Math.min(weakest.maxhp, weakest.hp + a.power * a.rarity);
        }
    },
    "healWeak2": {
        name: "HealWeak2",
        func: function(a, t, isPlayer) {
            const arr = isPlayer ? battle.playerTeam : battle.enemy;
            let lowestHP = 99999, lowestIdx = 0;
            for(let i = 0; i < arr.length; i++) {
                const me = arr[i];
                if(me.hp <= 0) { continue; }
                if(me.hp < lowestHP) {
                    lowestHP = me.hp;
                    lowestIdx = i;
                }
            }
            const weakest = arr[lowestIdx];
            DoTint(a, "#FFFFAA", 0.75);
            DoTint(weakest, "#FFFFFF", 0.75);
            weakest.hp = Math.min(weakest.maxhp, weakest.hp + a.power * a.rarity * 4);
        }
    },
    "healAll2": {
        name: "HealAll2",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#FF00FF", 1);
                me.hp = Math.min(me.maxhp, me.hp + a.power * a.rarity * 4);
            });
            DoTint(a, "#FFFFAA", 0.75);
        }
    },
    "cure": {
        name: "CureAll",
        func: function(a, t, isPlayer) {
            DoTint(a, "#FF00FF", 0.75);
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.weak = 0;
                me.poison = 0;
                me.sand = 0;
                me.freeze = 0;
            });
        }
    },
    "freeze": {
        name: "Freeze",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#66FF66", 1);
            t.freeze = Math.min((a.rarity / 4) * 100, a.power * 4);
        }
    },
    "freeze2": {
        name: "Freeze2",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#66FF66", 1);
            t.freeze = Math.min((a.rarity / 4) * 300, a.power * 8);
        }
    },
    "weak": {
        name: "Weaken",
        func: function(a, t) {
            DoTint(a, "#0000FF", 1);
            t.weak = a.power * 10;
            t.weakPower = Math.min((a.rarity / 4) * 100, a.power * a.rarity);
        }
    },
    "weakAll": {
        name: "WeakAll",
        func: function(a, t, isPlayer) {
            DoForAll(!isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.weak = Math.min((a.rarity / 4) * 100, a.power * a.rarity);
                me.weakPower = a.power;
            });
        }
    },
    "weak2": {
        name: "Weaken2",
        func: function(a, t) {
            DoTint(a, "#0000FF", 1);
            t.weak = Math.min((a.rarity / 4) * 200, a.power * a.rarity * 4);
            t.weakPower = a.power * 2;
        }
    },
    "weakAll2": {
        name: "WeakAll2",
        func: function(a, t, isPlayer) {
            DoForAll(!isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.weak = Math.min((a.rarity / 4) * 200, a.power * a.rarity * 3);
                me.weakPower = a.power * 2;
            });
        }
    },
    "debuff": {
        name: "Debuff",
        func: function(a, t) {
            DoTint(a, "#FF00FF", 0.75);
            DoTint(t, "#00000", 1);
            t.speed = 0;
            t.shield = 0;
            t.buff = 0;
            t.ult = 0;
        }
    },
    "rage": {
        name: "Rage",
        func: function(a, t) {
            DoTint(a, "#FF0000", 0.75);
            DoTint(t, "#FF0000", 1);
            t.hp -= a.power * 7;
            a.hp -= a.power * 3;
        }
    },
    "ult": {
        name: "UltAll",
        func: function(a, t, isPlayer) {
            DoForAll(isPlayer, function(me) {
                DoTint(me, "#0000FF", 1);
                me.ult = Math.min((a.rarity / 4) * 150, (a.rarity - 2) * (a.rarity - 1) * Math.ceil(a.power / 3));
            });
        }
    },
    "aggro": {
        name: "Aggro",
        func: function(a, t) {
            DoTint(a, "#FF0000", 2);
            a.aggro = Math.min((a.rarity / 4) * 150, a.rarity * a.power * 5);
        } 
    }
};
function DoTint(target, color, opacity) {
    target.drawInfo.tintColor = color;
    target.drawInfo.tintOpacity = opacity;
}
function DoForAll(isPlayer, func) {
    const arr = isPlayer ? battle.playerTeam : battle.enemy;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].hp <= 0) { continue; }
        func(arr[i]);
    }
}