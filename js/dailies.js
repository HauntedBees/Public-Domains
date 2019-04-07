const messages = [
    "Welcome to Public Domains: Gacha Game, the only mobile game where you can collect and battle public domain photos, paintings, clip art, and more! Unless there's another one we don't know about, but that would be kind of sad given that this is a pretty silly concept. Anyway, we hope you enjoy the game! Tap the DISMISS button below to, get this, DISMISS this message! Wild, right?",
    "Happy April, everybody! Today marks the beginning of the 'The April Fool' summoning event! Now's the perfect time to collect some powerful public domain clowns, jesters, and goofballs! To celebrate the start of this event, you've received a Public Domain Five-Ticket, which you can use to summon five characters without having to spend any ePloids! Let's get goofy!",
    "The version 1.1 update is now out! Congratulations on still playing this game two days after it came out! I'm not sure why you decided to do that, but I'm proud of you! The main part of this update is SIXTEEN NEW SUMMONS, some balance tweaks, and bug fixes! Plus, every day you log in, you'll get 30 ePloids! Epic!", 
    "What is likely the final update -- Version 1.2 -- has arrived! The most important part? Realistically, the bug fixes and quality of life fixes, but no that doesn't matter. There are now 176 characters to summon, including the Zodiac Collection, the Dover Collection, and one more April Fool! Gotta catch them all! See, I said \"them\" instead of \"em\" so it's legal."
];
const dailies = {
    GetDayID: function(asObj) {
        const d = new Date();
        const dayOfWeek = d.getDay();
        const dayOfMonth = d.getDate();
        const month = d.getMonth();
        const secondVal = (dayOfMonth * month) % 10;
        const thirdVal = Math.round(dayOfMonth * dayOfMonth * month / (dayOfWeek + 1)) % 10;
        const ploidPrize = 2 + ((dayOfWeek + 1) * (month + 1) * (d.getFullYear())) % 8;
        if(asObj) {
            return {
                a: dayOfWeek, // [0-6]
                b: secondVal, // [0-9]
                c: thirdVal, // [0-9]
                ploidPrize: ploidPrize, // [2-10]
                isWeekend: (dayOfWeek === 0 || dayOfWeek === 1),
                isFirstDay: dayOfMonth === 0
            };
        } else {
            return dayOfWeek + "." + secondVal + "." + thirdVal + "|" + d.getFullYear() + "-" + month + "-" + dayOfMonth;
        }
    },
    GetMissions: function() {
        const d = new Date(), suffix = "|" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        const key = dailies.GetDayID(true);
        const missions = [];
        let prizes = 0;
        for(let i = 0; i < 3; i++) {
            let r = ((i === 0 ? key.a : key.b) + 3) * ((i === 1 ? key.b : key.c) + 4) * ((i === 2 ? key.c : key.a) + 3);
            let r2 = ((i === 0 ? key.c : key.b) + key.a) * ((i === 1 ? key.b : key.a) + key.c) * ((i === 2 ? key.a : key.b) + key.c);
            let event = "", prize = 2 + (key.b % 2), name = undefined;
            if(r % 5 === 0) {
                event = "eventApr" + ((r2 * key.ploidPrize + key.c) % 5);
            } else if(r % 45 === 0) {
                event = "coll";
                name = "Colosseum";
            } else if(r % 6 === 0) {
                const q = ((r2 * key.ploidPrize + key.c) % 13);
                event = "t" + q + "." + key;
                name = "Training " + String.fromCharCode(65 + q);
            } else {
                event = "story0-1"; // MISSION TODO
            }
            const won = player.questsCleared.indexOf(event + suffix) >= 0;
            const prizeAccepted = player.questsCleared.indexOf(event + suffix + "|prize") >= 0;
            if(!prizeAccepted) {
                if(won) { prizes++; }
                missions.push({ eID: event, name: name, won: won, prize: prize });
            }
        }
        return { numPrizes: prizes, active: missions };
    },
    GetMessages: function() {
        const msg = [];
        for(let i = 0; i < messages.length; i++) {
            if(player.messagesCleared.indexOf(i) < 0) {
                msg.push({ idx: i, text: messages[i] });
            }
        }
        const today = dailies.GetDayID();
        if(player.messagesCleared.indexOf(today) < 0) {
            player.messagesCleared.push(today);
            player.eploids += 30;
        }
        return msg;
    },
    GetTodaysColosseum: function() {
        const key = this.GetDayID(true);
        const prizes = [];
        const switch2 = (420 * key.a) + (69 * key.b) + key.c;
        const switch3 = (key.a + 1) * (key.b + 1) * (key.c + 1);
        if(switch3 % 9 === 0) { // potential coinage (was %5)
            const coinValue = (key.b + 1) * 1000 + (key.c * 100);
            prizes.push({ isCoins: true, value: coinValue });
        } else {
            prizes.push(gachas[switch3 % gachas.length]);
        }
        const switch4 = (key.a + 1) * (key.b + 1) * (key.c + 1);
        if(switch4 % 9 === 0) { // potential ploidage 
            prizes.push({ isPloids: true, value: key.ploidPrize });
        } else {
            prizes.push(gachas[reg3[switch4 % reg3.length]]);
        }
        const switch1 = (100 * key.a) + (10 * key.b) + key.c;
        if(key.isWeekend) { // weekend rare prize!
            prizes.push(gachas[reg4[switch1 % reg4.length]]);
        } else {
            prizes.push(gachas[switch1 % gachas.length]);
        }
        if(key.isFirstDay) { // first day super rare prize!
            prizes.push(gachas[reg5[switch2 % reg5.length]]);
        } else {
            prizes.push(gachas[switch2 % gachas.length]);
        }
        return prizes;
    }
};