function EnemyData(idx, level) {
    this.idx = idx; this.level = level;
}
function GetGachaFromEnemyData(e) {
    const gacha = e.idx < 0 ? GetGatcha(undefined, true) : Object.assign({}, gachas[e.idx]);
    while(gacha.level < e.level) {
        LevelUpGatcha(gacha);
    }
    InitGatchaForBattle(gacha);
    return gacha;
}
function GetGatcha(i, isEnemy) {
    let arrToUse = reg3, rarity = 3;
    const r = Math.random();
    if(r < 0.05) {
        rarity = 5;
        arrToUse = focus5;
    } else if(r < 0.1) {
        rarity = 5;
        arrToUse = reg5;
    } else if(r < 0.45) {
        rarity = 4;
        arrToUse = reg4;
    }
    let gachaRef = null;
    if(i === undefined) {
        i = Math.floor(Math.random() * arrToUse.length);
        gachaRef = gachas[arrToUse[i]];
    } else {
        if(focus5.indexOf(i) >= 0 || reg5.indexOf(i) >= 0) { rarity = 5; }
        else if(reg4.indexOf(i) >= 0) { rarity = 4; }
        gachaRef = gachas[i];
    }
    if(isEnemy) {
        return Object.assign({}, gachaRef);
    } else if(player.gachas.filter(e => e.name === gachaRef.name).length > 0) {
        console.log("You already have a " + gachaRef.name + "!");
        const coinValue = gachaRef.rarity * gachaRef.rarity * 100;
        return { file: "coin", x: 0, y: 0, isCoins: true, name: "Coinies (" + coinValue + ")", value: coinValue };
    } else {
        return Object.assign({}, gachaRef);
    }
}
function InitGatchaForBattle(g) {
    g.hp = g.maxhp;
    g.currCool1 = g.cooldown1;
    g.currCool2 = g.cooldown2;
    g.shield = 0; g.shieldPower = 1;
    g.speed = 0; g.speedPower = 1;
    g.poison = 0; g.poisonPower = 1; g.poisonTimer = 2 + Math.floor(13 * Math.random());
    g.sand = 0; g.buff = 0;
    g.weak = 0; g.weakPower = 1;
    g.freeze = 0; g.ult = 0;
    g.aggro = 0;
}
function ApplyEXPToGatcha(g, exp) {
    g.exp += exp;
    if(g.exp >= g.expToNextLevel) {
        while(g.exp >= g.expToNextLevel) { LevelUpGatcha(g); }
        return true;
    } else { return false; }
}
function LevelUpGatcha(g) {
    g.level += 1;
    g.exp -= g.expToNextLevel;
    if(g.exp < 0) { g.exp = 0; }
    g.power += Math.ceil(Math.log10(g.level) * (7 * g.rarity) / 6);
    g.maxhp += Math.ceil(g.level * g.rarity * (1 + (g.rarity / 22)));
    g.expToNextLevel = Math.ceil(Math.min(g.expToNextLevel + 5432, g.expToNextLevel * 1.1));
}
function GetEXPFromGacha(g) { return 5 * g.level * g.power; }
function GetGatchaUpgradePrice(g) { // measured in Coinies, not ePloids
    return Math.floor((g.rarity / 2) * g.level) * 10;
}
const targetEnemySkills = ["debuff", "freeze", "freeze2", "poison", "poison2", "poisonAll", "rage", "sand", "strong", "weak", "weak2", "weakAll", "weakAll2"];
const shittySkills = ["sand", "rage", "weak", "shield", "strong"];
const greatSkills = ["cure", "freeze2", "freeze", "healAll2", "healWeak2", "shieldAll2", "shieldAll", "speedAll", "speedAll2"];
function Gacha(name, file, x, y, rarity, specialType, desc, url) {
    this.name = decodeURIComponent(name);
    this.file = "pd" + file;
    this.x = x;
    this.y = y;
    this.level = 1;
    this.special = specialType || "strong";
    const isShittyPower = shittySkills.indexOf(this.special) >= 0;
    const isGreatPower = greatSkills.indexOf(this.special) >= 0;
    const numVowels = url.match(/[aeiou]/gi).length;
    const urlLength = url.length;
    const numLongLetters = url.match(/[bdijlpqty]/gi).length;
    const numRoundLetters = url.match(/[ceopsu]/gi).length;
    const someRatio = (urlLength - numRoundLetters) / (urlLength - numLongLetters);
    const numCapitalsOrH = url.match(/[A-Zh]/g).length;
    const notLetters = url.match(/[^a-z]/gi).length;
    const oddLetters = url.match(/[acegikmoqsuwy]/gi).length;
    const rarityMult = ((rarity + 5) / 7) * (isShittyPower ? 1.25 : (isGreatPower ? 0.9 : 1));
    this.hp = 20 + Math.ceil(rarityMult * numVowels);
    this.maxhp = this.hp;
    this.power = Math.ceil(rarityMult * numCapitalsOrH);
    this.cooldown1 = Math.ceil(rarityMult * someRatio * 10);
    this.currCool1 = this.cooldown1;
    this.cooldown2 = Math.round(rarityMult * 1.5 * (urlLength - oddLetters));
    this.currCool2 = this.cooldown2;
    this.exp = 0;
    this.expToNextLevel = notLetters;
    this.desc = desc;
    this.rarity = rarity;
    this.drawInfo = { x: 0, y: 0, scale: 0 };
}
const focus5 = [32, 33, 34, 35, 36];
const reg5 = [];
const reg4 = [];
const reg3 = [];
function InitGachas() {
    const powers = {};
    const fullPowers = Object.keys(specials);
    for(let i = 0; i < fullPowers.length; i++) {
        powers[fullPowers[i]] = 0;
    }
    for(let i = 0; i < gachas.length; i++) {
        const me = gachas[i];
        switch(me.rarity) {
            case 5: reg5.push(i); break;
            case 4: reg4.push(i); break;
            case 3: reg3.push(i); break;
            default: console.log(`${me.name} has an unexpected rarity of ${me.rarity}!`); break;
        }
        if(powers[me.special] === undefined) {
            console.log(`${me.name} has an unexpected power of ${me.special}!`);
        } else { powers[me.special]++; }
    }
    console.log(`5-Star: ${reg5.length}
4-Star: ${reg4.length}
3-Star: ${reg3.length}
Powers:`);
    console.log(powers);
}
const gachas = [
    new Gacha("Flower Lord", 0, 0, 0, 3, "heal", "He'll keep you safe from a fate of not being surrounded by flowers constantly.", "https://en.wikipedia.org/wiki/File:2LORD-ROSEBERY.gif"),
    new Gacha("Skeets Gallagher (1938)", 0, 1, 0, 4, "strong", "Known for appearing in films like 'Hats Off,' 'Polo Joe,' and 'The Stolen Jools.'", "https://en.wikipedia.org/wiki/File:Skeets_Gallagher1.jpg"),
    new Gacha("Skeets Gallagher (1944)", 0, 2, 0, 3, "shield", "Starred in films such as 'Up Pops the Devil,' 'Merrily We Go to Hell,' and 'Too Much Harmony.' Strange pattern there.", "https://en.wikipedia.org/wiki/File:Richard_Skeets_Gallagher.JPG"),
    new Gacha("IPA Chart", 0, 3, 0, 3, "aggro", "A chart of phonetic symbols. If you can understand this, you can understand anything! ...For some definition of 'understand,' at least.", "https://en.wikipedia.org/wiki/File:IPA_chart_(1912).png"),
    new Gacha("Archangel Michael (Russian)", 0, 0, 1, 4, "shieldAll", "The leader of God's armies in the war against Satan. Learn more in the Book of Revelation!", "https://en.wikipedia.org/wiki/File:ArchangelRussianIcon.JPG"),
    new Gacha("Archangel Michael (Catalan)", 0, 1, 1, 5, "shieldAll2", "The leader of God's armies in the war against Satan. Want to know more? Read the manga! Er, I mean, the Bible.", "https://en.wikipedia.org/wiki/File:ArchangleStMichael.jpg"),
    new Gacha("Young Lady Judging You", 0, 2, 1, 4, "freeze", "She can see right through your fake charm and straight into your soul. And she's disappointed with what she sees.", "https://en.wikipedia.org/wiki/File:BCKoekkoek_Young_Lady.jpg"),
    new Gacha("Bee Eater", 0, 3, 1, 3, "sand", "Wikipedia said 'Bee-eaters may be killed by raptors' and it took me a second to remember that 'raptors' can mean 'birds of prey' and not just dinosaurs.", "https://en.wikipedia.org/wiki/File:Bee-eater-gould.JPG"),
    new Gacha("Map of Becouya", 0, 0, 2, 3, "debuff", "Becouya is the old name for Bequia, an island in the Grenadines. Their unofficial flag is a cute little whale drawing. Look it up!", "https://en.wikipedia.org/wiki/File:Becouya-Granadilles-map-1769.jpg"),
    new Gacha("Basarab I of Wallachia", 0, 1, 2, 4, "healWeak", "He's lookin' ahead like he's thinking \"why are you like this bro\" and I ask myself the same question every day.", "https://en.wikipedia.org/wiki/File:Basarab_I_of_Wallachia_cropped.jpg"),
    new Gacha("B%C3%B3lu-Hj%C3%A1lmar", 0, 2, 2, 5, "freeze2", "A man with a stare as cold as his heart, and a heart as cold as, like, an ice box.", "https://en.wikipedia.org/wiki/File:Bolu_hjalmar.jpg"),
    new Gacha("Cecily of York", 0, 3, 2, 4, "healAll", "One of the daughters of Edward IV, King of England. I mean, she was. They've both been dead for centuries. It's history, you see.", "https://en.wikipedia.org/wiki/File:Cecily_of_York.JPG"),
    new Gacha("Consort Shun", 0, 0, 3, 5, "cure", "She was demoted from 'Consort' to 'Noble Lady' in 1788 for unknown reasons, then died later that year. Demotions can be brutal.", "https://en.wikipedia.org/wiki/File:Consort_Shun.jpg"),
    new Gacha("The Lads Having A Good Time", 0, 1, 3, 4, "rage", "Where are they going? To the pub? From the pub? To a popular chain restaurant? Off a cliff? Well, if all their friends are doing it...", "https://en.wikipedia.org/wiki/File:DERRICK-2-.gif"),
    new Gacha("Djoser Statue", 0, 2, 3, 4, "poison", "Also known as Djser and Zoser. An Egyptian pharoah of the Third Dynasty of the Old Kingdom. He's got his own pyramid because he's dead.", "https://en.wikipedia.org/wiki/File:Djoser6.jpg"),
    new Gacha("Fat Winged Baby", 0, 3, 3, 3, "aggro", "His smug look makes his foes want to pick him up and slam him into a basketball hoop. Not THROUGH the hoop, into it.", "https://en.wikipedia.org/wiki/File:EIS_PHAOS.JPG"),
    new Gacha("David Ochterlony Dyce Sombre", 1, 0, 0, 3, "weakAll", "The first person of Asian descent to be elected to the British Parliament. I just like his hair.", "https://en.wikipedia.org/wiki/File:Dyce-sombre.jpg"),
    new Gacha("Lloyd's Coffee House Plaque", 1, 1, 0, 3, "healWeak", "Coffee isn't even that good and not you or any other person who reads this will be able to convince me otherwise.", "https://en.wikipedia.org/wiki/File:Lloyd%27s_Coffee_House_plaque.jpg"),
    new Gacha("Service Area Map", 1, 2, 0, 3, "buff", "For the Southern Power District in Nebraska, USA. They employ around 100 people.", "https://en.wikipedia.org/wiki/File:Retain_communities.gif"),
    new Gacha("15-bit RGB Color Palette", 1, 3, 0, 3, "speedAll", "These are all the colors that can be displayed with 15-bits of color. Modern computers can show many more colors!", "https://en.wikipedia.org/wiki/File:RGB_15bits_palette_(alternative_order).png"),
    new Gacha("Treble Clef", 1, 0, 1, 3, "shieldAll", "Used by instruments such as the violin, flute, bagpipe, and vibraphone. I don't know enough about music to say much more than that.", "https://en.wikipedia.org/wiki/File:Treble_clef_with_ref.svg"),
    new Gacha("Topical Election Pin", 1, 1, 1, 3, "rage", "Carl Zeidler won the 1940 mayoral election in Milwaukee, Wisconsin, USA. He unseated Dan Hoan, who had the longest Socialist administration in US history.", "https://en.wikipedia.org/wiki/File:40-zeidler-mayoralpinback.jpg"),
    new Gacha("Crazy Foam Root Beer Child", 1, 2, 1, 5, "healAll2", "Dig that crazy foam on top! You haven't tasted root beer like this in years! Seriously. Because this boy is from a 1955 newspaper ad.", "https://en.wikipedia.org/wiki/File:Ad_for_Belfast_Root_Beer_from_55-06-12_Oakland_Tribune.jpeg"),
    new Gacha("Skeptical Jeff", 1, 3, 1, 5, "rage", "The basketball mascot of Bishop Dubois High School, a private Catholic school that was shut down in 1976.", "https://en.wikipedia.org/wiki/File:Bdhslions.jpg"),
    new Gacha("Dolly Haas", 1, 0, 2, 4, "heal", "A German-American actress who starred in 'Girls Will Be Boys,' a movie about dressing up as a boy to mess with a rich sexist dude.", "https://en.wikipedia.org/wiki/File:Dolly_Haas_-_1955.jpg"),
    new Gacha("Thinking About Butt Stuff", 1, 1, 2, 4, "shieldAll", "\"Honey, what do you think about when we kiss?\" \"I, uh, well, I think about you, of course!\"", "https://upload.wikimedia.org/wikipedia/en/4/45/Free_and_Easy_poster_1941.jpg"),
    new Gacha("Berenice Summers", 1, 2, 2, 5, "ult", "She looks like she laughs like an anime villainess, but her movie poster predates anime by a few decades!", "https://en.wikipedia.org/wiki/File:Naughty_but_nice.JPG"),
    new Gacha("The Duncans", 1, 3, 2, 4, "weakAll", "An USAmerican vaudeville duo who I now regret putting into this game after reading that their most popular act was just blackface.", "https://en.wikipedia.org/wiki/File:It%27s_a_Great_Life_lobby_card_2.jpg"),
    new Gacha("The Duncans (Omega Form)", 1, 0, 3, 5, "weakAll2", "Their psychic powers are now active, and they have found that they quite enjoy the taste of human blood. Run.", "https://en.wikipedia.org/wiki/File:It%27s_a_Great_Life_lobby_card.jpg"),
    new Gacha("The Anarchist", 1, 1, 3, 5, "poisonAll", "He not a part of YOUR SYSTEM. He's not down with THE MAN. He's an ADULT. He has a BOMB-- oh, its fuse is lit. I'm gonna bail.", "https://en.wikipedia.org/wiki/File:Anarchie_ist_Helfer_der_Reaktion_und_Hungersnot_LCCN2004666102_-_from_Commons.tif"),
    new Gacha("Business Karan", 1, 2, 3, 3, "shieldAll", "He's got some important documents he needs you to go over, and some spreadsheets to pass along to the boss.", "https://openclipart.org/detail/298295/man-and-woman-remix"),
    new Gacha("Business Sheila", 1, 3, 3, 3, "shieldLong", "She's getting ready for a big meeting with the director to go over some issues she found with the financial data.", "https://openclipart.org/detail/298295/man-and-woman-remix"),
    new Gacha("Boo Boo the Fool", 2, 0, 0, 5, "shield2", "He's not very funny, but at least he isn't some loser with a TV special complaining about how millennials are too fragile.", "https://openclipart.org/detail/193921/clown-face"),
    new Gacha("Lil' Choobers", 2, 1, 0, 5, "speed2", "A wacky jester with a tiny human skull on his jestering stick. It looks real, but everybody is too afraid to ask him how he got it.", "https://openclipart.org/detail/174882/singing-jester"),
    new Gacha("Social Media Funnyman", 2, 2, 0, 5, "aggro", "If you treat him right, he'll make some good posts on line. If you don't, he might devolve into a Video Essay About Children's Cartoons Maker.", "https://openclipart.org/detail/281021/jester-4"),
    new Gacha("Hurley Quine", 2, 3, 0, 5, "poison2", "She can juggle, balance on a tightrope, tell jokes, and bring entire governments to their knees.", "https://openclipart.org/detail/1583/harlequin-woman"),
    new Gacha("Pagliacci", 2, 0, 1, 5, "healWeak2", "Man goes to doctor, says \"doctor, am sad.\" Doctor says \"go see clown Pagliacci, he will cheer you up.\" Man does that and it doesn't do much because clowns can only provide temporary relief for depression.", "https://en.wikipedia.org/wiki/File:Jan_Matejko,_Sta%C5%84czyk.jpg"),
    new Gacha("Dover Scout", 2, 1, 1, 3, "strong", "A brave young scout determined to help people. Isn't that precious?", "https://www.youtube.com/watch?v=jR0eBWDVAtw"),
    new Gacha("Wanderer", 2, 2, 1, 3, "speed", "He's journeyed far and wind, trying to find the most refreshing glass of ice cold milk in the world. His adventure is not yet complete.", "https://en.wikipedia.org/wiki/File:Walter_Scott_Waverley_illustration_(Pettie-Huth).jpg"),
    new Gacha("Pencil Holder", 2, 3, 1, 3, "sand", "It holds pencils and I guess other things you can fit in a pencil holder's pencil hole.", "https://en.wikipedia.org/wiki/File:Walnut-wood_pencil_holder.jpg"),
    new Gacha("Bumbled Bee", 2, 0, 2, 4, "poisonAll", "It's very important to save the bees. Do your part by planting bee-friendly flowers, buying from local beekeepers, and sending threatening letters to CEOs of companies that use dangerous pesticides.", "https://en.wikipedia.org/wiki/File:Mrs_tittlemouse.jpg"),
    new Gacha("Ashanti Jug", 2, 1, 2, 3, "poison", "A jug you could probably fill with tap water, but that'd probably make the British Museum very angry.", "https://en.wikipedia.org/wiki/File:Ashanti_English_Medieval_Ewer.jpg"),
    new Gacha("Cool Ride", 2, 2, 2, 3, "speed", "Airplanes go really fast and that's because they're trying to outrun gravity.", "https://en.wikipedia.org/wiki/File:Avia_b-h1(exp)_aircraft.jpg"),
    new Gacha("Overpriced Relic", 2, 3, 2, 3, "aggro", "This strange device is kind of like a smart phone, but only half as expensive, and only about 99% more limited in its functionality.", "https://en.wikipedia.org/wiki/File:Calculator-TI-30XA-rev2015.jpg"),
    new Gacha("William", 2, 0, 3, 5, "poisonAll", "Armed with a straw from which he can shoot peas, there is nothing that can stop this rambunctious youth, other than Mrs. KRUNGLER, of course! Tune in Tuesdays at 6pm for more of his WHACKY adventures!", "https://en.wikipedia.org/wiki/File:More_william_project_gutenberg_etext_number17125.jpg"),
    new Gacha("Figure-Eight Loop", 2, 1, 3, 3, "weak", "So this is how you do a figure-eight loop, I guess. I've never tied one. But I'll believe it.", "https://en.wikipedia.org/wiki/File:Figure8Loop.jpg"),
    new Gacha("Gold Plunger", 2, 2, 3, 4, "weak2", "This is a plunger made with real gold. Which means you probably don't want to use it as an actual plunger. So it's worthless. Eat the rich.", "https://en.wikipedia.org/wiki/File:Goldenplunger.jpg"),
    new Gacha("Freemason Symbol", 2, 3, 3, 3, "shieldLong", "The symbol of organizations for people who don't have anything exciting happening in their lives. Yeah, take THAT, Freemasons. You just got OWNED.", "https://en.wikipedia.org/wiki/File:Masonic_SquareCompassesG.svg"),
    new Gacha("Baby", 3, 0, 0, 3, "freeze", "A pixie bob cat. A precious infant. A lovely baby. A good child. A gorgeous creature. I love them. We all do. A great egg.", "https://en.wikipedia.org/wiki/File:Pixiebob0001.jpg"),
    new Gacha("Padlock", 3, 1, 0, 3, "freeze", "This is can be used to lock things. Like a shed with a body in it. Or a locker with a body in it. Lots of things with bodies in them can be locked up with one of these.", "https://en.wikipedia.org/wiki/File:Padlock.svg"),
    new Gacha("Sweet Ride", 3, 2, 0, 5, "speedAll2", "Show up to pick up your date riding this bad boy, and there'll be no need for a second date; they'll be ready to propose (and make out) right then and there.", "https://en.wikipedia.org/wiki/File:AztecWheeledToy.jpg"),
    new Gacha("Broom", 3, 3, 0, 3, "cure", "You can use this to sweep around dust and garbage and such. It's really quite useful. Also if you're a witch, you can ride it and fly around! Kids, don't try that one at home!", "https://en.wikipedia.org/wiki/File:Edit-clear.svg"),
    new Gacha("Book Nerd", 3, 0, 1, 4, "healAll", "Look at this dweeb, reading a book. The only thing anyone should be reading is the text in this game! Good job, you're doing great!", "https://en.wikipedia.org/wiki/File:Fifteenth_Century_Augustinian.jpg"),
    new Gacha("The Pengtwins", 3, 1, 1, 3, "debuff", "They call themselves the Penguin Triplets, but that's only because their parents haven't told them that one of them is adopted yet. I wonder which one it is?", "https://en.wikipedia.org/wiki/File:Happy_panguins.svg"),
    new Gacha("Capitalist Food", 3, 2, 1, 3, "speedAll", "If you defend Elon Musk from enough legitimate criticism of his practices on social media, he'll take you with him when he goes to Mars!", "https://en.wikipedia.org/wiki/File:Hiking_boot_clip_art_22891.jpg"),
    new Gacha("Ishmael", 3, 3, 1, 3, "weak", "He looks like he's tired of living. Buddy, I can relate!! Life is a lot!! Mankind as a whole just needs to slow things down for a while so we can rest!", "https://en.wikipedia.org/wiki/File:Ishmael.jpg"),
    new Gacha("Technology", 3, 0, 2, 3, "buff", "Bits and bytes and beeps and boops are what run the world these days. Even this game is made with technology! Try to think of some other things in your life that use technology and write them down in your diary!", "https://en.wikipedia.org/wiki/File:Joybus_Board_Top.JPG"),
    new Gacha("That Vampin' Lady", 3, 1, 2, 4, "ult", "With her charming smile, she has wrought heartbreak unto many a man. She has powers of seduction, grace, and also: a katana!", "https://en.wikipedia.org/wiki/File:Louisville_Lou_sheet_music_cover_2.jpg"),
    new Gacha("Wall-Hammer 4000", 3, 2, 2, 4, "shieldAll2", "Ain't nobody gonna get through this wall. It's made of bricks! And she's keeping a watchful eye with her hammer, so you gotta be careful! She might yell at you or shake that hammer menacingly!", "https://en.wikipedia.org/wiki/File:Mauer_City_of_Vienna_COA.jpg"),
    new Gacha("A Guitar", 3, 3, 2, 3, "sand", "An instrument best known for strumming four chords in most popular rock music. If its time signature ain't got a two digit number, it ain't real music!", "https://en.wikipedia.org/wiki/File:Morch_guitar_0019.jpg"),
    new Gacha("Chav", 3, 0, 3, 4, "poison2", "A British youth that would probably steal your lunch money if you were in school together. I say, that's quite rude, innit?", "https://en.wikipedia.org/wiki/File:Chav.jpg"),
    new Gacha("Origami Instructions", 3, 1, 3, 4, "weak2", "If you need to fold an origami box, now you're one tenth closer to figuring out how to do it! Who says video games aren't educational?", "https://en.wikipedia.org/wiki/File:Origami_Masu_Box_Step_09.gif"),
    new Gacha("Ginger General", 3, 2, 3, 5, "revive", "A brave general who will definitely kick you in the face if you mess with her or her people. She is respected by all of her troops, and even by many troops from enemy armies.", "https://en.wikipedia.org/wiki/File:Ozgeneraljinjurarmyofrevolt.jpg"),
    new Gacha("HLA-DR1", 3, 3, 3, 4, "poison2", "Honestly I don't know enough about biology to even know what to call this thing. It's a \"HLA-DR serotype,\" whatever that means.", "https://en.wikipedia.org/wiki/File:PBB_Protein_HLA-DRA_image.jpg"),
    new Gacha("Misterioso", 4, 0, 0, 3, "shield", "A mysterious person who lurks abeut in the shadows. What are they doing there? I don't know, but I'm suspicious! Hey, get out of my trash can! That's where I keep my trash!", "https://en.wikipedia.org/wiki/File:PersonSilhouette.png"),
    new Gacha("Grauer's Broadbill", 4, 1, 0, 4, "speed2", "A beautiful green bird endemic to the Democratic Republic of Congo and Uganda. A guy named Rudolf Grauer is the one who wrote about it first, so it's named after him now.", "https://en.wikipedia.org/wiki/File:Pseudocalyptomena.JPG"),
    new Gacha("Apple", 4, 2, 0, 3, "cure", "An apple a day keeps the Apple Goblin away. Please, eat apples. You don't want to meet the Apple Goblin. You don't want to see the Apple Goblin.", "https://en.wikipedia.org/wiki/File:Red_Apple.png"),
    new Gacha("Peanut Butter Cup", 4, 3, 0, 5, "healAll2", "A chocolatey disc full of peanut butter and sugar. They say that the secret to their sweet and salty flavor is a kiss from the God of Sweet and Salty. Don't ask me who \"they\" are; I'm not at liberty to discuss that.", "https://en.wikipedia.org/wiki/File:Reeses-PB-Cups.png"),
    new Gacha("Weevil", 4, 0, 1, 4, "shield", "You're probably expecting me to make a reference to that song about boll weevils, but this is a rhinomacer weevil, not a boll weevil. Sometimes you must sacrifice jokes for accuracy.", "https://en.wikipedia.org/wiki/File:Rhinomacer.jpg"),
    new Gacha("Beebo Robo", 4, 1, 1, 3, "debuff", "This robot was given sharp teeth to scare off predators. You may ask what predators a robot would have, but that isn't a question you're ready to hear the answer to yet.", "https://en.wikipedia.org/wiki/File:Robot18.gif"),
    new Gacha("Look at my Horse!", 4, 2, 1, 4, "shield2", "\"Look at my horse!\" he gestures. You turn away. \"LOOK AT MY HORSE!\" he repeats, louder. You stare at your feet. You know you aren't brave enough to look at his horse. He knows, too.", "https://fr.wikipedia.org/wiki/Fichier:Sofa_de_Samory-Woyowoyanko,_Konianbougou_-_Bamako.jpg"),
    new Gacha("Astro the Space Dog", 4, 3, 1, 5, "healWeak2", "This dog has big dreams of going to space, and I'm so proud of him. I love him so much. He's got a little doggy space suit and everything. Isn't that wonderful?", "https://en.wikipedia.org/wiki/File:Space_buddy2.gif"),
    new Gacha("Brain", 4, 0, 2, 4, "ult", "The brain is an important organ that reminds us how to do things like agonize over unimportant details, remember embarrassing childhood memories, communicate with others, and cry.", "https://en.wikipedia.org/wiki/File:The_brain.jpg"),
    new Gacha("Bath Ducks", 4, 1, 2, 3, "cure", "Wen yer in de baf enya wan somefink to fidle wif but ye alredy introduced Palmela to Genny that day ye can toss wun of thees ducks arewnd to okkipy yer hans.", "https://en.wikipedia.org/wiki/File:Three_ducks_in_the_tub.jpg"),
    new Gacha("The Union Man's Burden", 4, 2, 2, 4, "ult", "There's no \"I\" in \"team,\" but there is in \"union,\" because \"I\" think you should unionize your workplace!", "https://en.wikipedia.org/wiki/File:Union_mans_burden.jpg"),
    new Gacha("Yanma Man", 4, 3, 2, 3, "shield2", "His name was Urg and he used his Copper Age powers to make fancy copper tools to share with people he cared about. He was a nice fellow.", "https://en.wikipedia.org/wiki/File:Yamna_culture.jpg"),
    new Gacha("Chloe", 4, 0, 3, 4, "freeze2", "She may be made of wood, but she has a heart of gold! Well, not literally, I mean. Literally her heart is also made of wood. More literally, she doesn't have a heart because she is just a solid wood statue. I'm a lot of fun at parties.", "https://en.wikipedia.org/wiki/File:EmilMilanChloe.jpg"),
    new Gacha("Harnack's Inequality", 4, 1, 3, 4, "weakAll2", "Some math stuff. I dunno. Math is hard. This is a graph of some important function. People always think computer programmers are good at math, but we aren't. Stop asking!!", "https://en.wikipedia.org/wiki/File:Graph_of_Harnack%27s_inequality.png"),
    new Gacha("Joan Beauhamp Procter", 4, 2, 3, 3, "poison", "She was the first female Curator of Reptiles at the London Zoo. She was very good at reptiling, especially Komodo dragoning.", "https://en.wikipedia.org/wiki/File:Joan_Beauchamp_Procter_bust.jpg"),
    new Gacha("Sham Pagan", 4, 3, 3, 3, "buff", "This glass of alcohol tried to convince some Pagans it was one of them, but they saw right through it! Then they were worried that they hurt the alcohol's feelings, but they didn't need to, because it was only faking being sad. Sham Pain.", "https://en.wikipedia.org/wiki/File:Kristian_Regale_champaign.jpg"),
    new Gacha("Mango Tango", 5, 0, 0, 3, "shieldLong", "Mangoes are really tasty but last week I bought orange juice with mango mixed in and it was worse than the sum of its parts, so just remember: just because two things are good, that doesn't mean they're good TOGETHER.", "https://en.wikipedia.org/wiki/File:Mango_Black_and_Rose_fruits_leaves.JPG"),
    new Gacha("Metric Clock", 5, 1, 0, 3, "speedAll", "This is what happens when nerds get too comfortable. It's time to bring back wedgies and-- wait oh no I just remembered I'm a nerd. OH NO LET GO OF MY UNDERW-AAAAAAAAAAAHH!!!!", "https://en.wikipedia.org/wiki/File:Metric_clock.JPG"),
    new Gacha("Cow", 5, 2, 0, 3, "heal", "Cows are good because they are good. That's just a fact of life. The fact that they also make delicious milk is also a point in their favor, though. Or more like a PINT in their FLAVOR. Ha ha! Because a pint of milk would be good. That's the joke. Ha ha.", "https://en.wikipedia.org/wiki/File:RedheiferInThirdYear.jpg"),
    new Gacha("#dog", 5, 3, 0, 3, "healWeak2", "Sometimes when you look at dog and the dog looks back at you please repost if you agree.", "https://en.wikipedia.org/wiki/File:Ruby_the_jack_russell.jpg"),
    new Gacha("Hand Rubbing Faux Fur", 5, 0, 1, 3, "weakAll", "It's pretty cool how most people went \"oh yeah killing animals for their fur is messed up\" and a whole industry of fake fur happened but meanwhile bacon is an epic meme for people with no personality.", "https://en.wikipedia.org/wiki/File:Rubbing_faux-fur,_July_2014.jpg"),
    new Gacha("A Gun!", 5, 1, 1, 4, "freeze2", "Guns are really good at causing and solving problems. They're good at stopping bad governments, but sometimes bad governments have tanks to complicate matters.", "https://en.wikipedia.org/wiki/File:S%26WModel15-4_01.jpg"),
    new Gacha("Sapphire", 5, 2, 1, 5, "healAll2", "I don't know much about gems but I heard on good authority from a children's cartoon that if you rub one of these into a ruby they'll end up making garnet. I don't understand how, though. Science.", "https://en.wikipedia.org/wiki/File:Sapphire.png"),
    new Gacha("Dance Award", 5, 3, 1, 4, "speedAll2", "This is an award you might get if you're really good at dancing. This is also an award you might get if you know someone who is really good at dancing and are not morally opposed to robbing them.", "https://en.wikipedia.org/wiki/File:Statuette_of_the_Bender_Award_for_International_Dance.jpg"),
    new Gacha("Sands", 5, 0, 2, 4, "weakAll2", "You have a hunch that you're gonna have a less-than-positive experience.", "https://en.wikipedia.org/wiki/File:Stills_murmur_auscultation_location.png"),
    new Gacha("Recliner", 5, 1, 2, 3, "healAll", "Kick back on this and let your worries fade away as you snore like a cartoon character going \"SNOOOORK mimimimimimi.\" That's the dream, am I right?", "https://en.wikipedia.org/wiki/File:Suffolk_Recliner_Mk1.jpg"),
    new Gacha("The Cool S", 5, 2, 2, 4, "speed", "If you didn't draw this at least once when you were in grade school then I'd rather not associate with you.", "https://en.wikipedia.org/wiki/File:The_Cool_S.jpg"),
    new Gacha("Henohenomoheji", 5, 3, 2, 5, "revive", "A face made of Japanese hiragana characters. He looks like a friend, but the kind of friend you wouldn't want to get on the bad side of. I mean, ideally you don't want to get on the bad sides of ANY of your friends, but you know what I mean.", "https://en.wikipedia.org/wiki/File:Henohenomoheji.svg"),
    new Gacha("Trilussa Statue", 5, 0, 3, 3, "weak", "This Italian poet was immortalized in a statue that would forever allow him to look down on passersby giving off a \"heard you were talkin' crap about me like I wouldn't notice\" vibe.", "https://en.wikipedia.org/wiki/File:Trilussastatue.jpg"),
    new Gacha("UK 1997 General Election Map", 5, 1, 3, 3, "weak2", "Too bad for that grey-green political party that was only popular in one chunk of the southwest part of the country. I guess in 1997 the UK was really blue - da ba dee da ba daa.", "https://en.wikipedia.org/wiki/File:Uk_%2797.png"),
    new Gacha("Videos Games", 5, 2, 3, 4, "speedAll2", "Nobody good plays video games.", "https://en.wikipedia.org/wiki/File:WPVG_icon_2016.svg"),
    new Gacha("Yield Sign", 5, 3, 3, 5, "revive", "When you want someone to be careful, but not stop entirely, you use this sign. I feel like this sign needs to be following me at all times.", "https://en.wikipedia.org/wiki/File:YieldSign.jpg"),
    new Gacha("Rambunctious Imp", 6, 0, 0, 5, "rage", "This is the kind of critter that is responsible for stuff like when you try to sit back down but your chair is a few inches from where you expected it to be and you fall right on your butt. This imp did that.", "https://openclipart.org/detail/7543/imp"),
    new Gacha("5-D Puzzle Cube", 6, 1, 0, 4, "sand", "The goal of the puzzle is to make each side of the cube to be the all the same color. But now there are two more dimensions involved to complicate things. Good luck solving something your feeble 3D mind can't even perceive, nerd!", "https://en.wikipedia.org/wiki/File:5D_Rubik%27s_Cube.png"),
    new Gacha("Ecuadorian Mantis", 6, 2, 0, 4, "speed2", "Mantises are the insect most likely to be drawn as weirdly sexy anthrpomorphic women by creepy cartoonists. Despite their \"praying mantis\" nickname, most mantises are agnostic or merely spiritual without belonging to any particular religion.", "https://en.wikipedia.org/wiki/File:Acontista_concinna.jpg"),
    new Gacha("The Laughing Hatter", 6, 3, 0, 3, "strong", "You laugh because he's different. He laughs because you're all able to buy hats at affordable prices at his hat store.", "https://en.wikipedia.org/wiki/File:AdvertYoungsTheHatterVictorianEraBridgeportCT.jpg"),
    new Gacha("Milk Conch", 6, 0, 1, 5, "healWeak", "If you're trying to get your daily amount of calcium, milk can maybe help with that. The milk conch probably can't. Unless you maybe teach one to go to the store and pick up a carton of milk for you. That'd be neat.", "https://en.wikipedia.org/wiki/File:Aliger_costatus_colored_drawing.jpg"),
    new Gacha("Yggdrasil", 6, 1, 1, 5, "revive", "The mythical tree of Norse cosmology. The ancient Norse aren't alive to correct me, so I'm just going to say that the secret of the Yggdrasil is that you can make the most comfortable toilet paper from its wood.", "https://en.wikipedia.org/wiki/File:Yggdrasil2.png"),
    new Gacha("The Pig Waltz", 6, 2, 1, 3, "shieldAll2", "You're at the ball. You look across the chamber and see a stunning woman. As your eyes move up her body, you reach her face. Her pig face. And you mean that literally, not that she's unattractive but that there is a pig's head on a human's body. What do you do? You waltz.", "https://en.wikipedia.org/wiki/File:Waltzing_a_Courtship.jpg"),
    new Gacha("Danish Movie Poster", 6, 3, 1, 3, "poison", "A poster for \"Sons of the Soil,\" a film recorded in 1919. It was the first film shot in Iceland.", "https://en.wikipedia.org/wiki/File:SagaBorgar%C3%A6ttarinnar%271919.jpg"),
    new Gacha("Saint Restituta of Africa", 6, 0, 2, 3, "healWeak", "A Tunisian saint who was martyred for, y'know, being a Christian during the whole Roman thing. Legend has it she survived riding a burning boat thanks to God. Take that, viking funerals!", "https://en.wikipedia.org/wiki/File:SaintRestituta.jpg"),
    new Gacha("Reminder of Clothes Past", 6, 1, 2, 3, "shield", "This woman serves as a reminder that, no matter how uncomfortable your clothes may be now, they're not as terrible as they would have been a few hundred years ago. Imagine how long it would take to put this coat on. No thank you.", "https://en.wikipedia.org/wiki/File:Redingote_a_la_hussar.jpg"),
    new Gacha("What Happened Last Night?!", 6, 2, 2, 4, "poisonAll", "You ever have one of those mornings where you wake up naked and a lion and alligator attack you? Me neither, but one day I'm going to ask that question to someone and they're going to say yes, and then I'm going to hear a great story, so, think about that.", "https://en.wikipedia.org/wiki/File:Miloofcrotona.jpg"),
    new Gacha("Weasel Friend", 6, 3, 2, 4, "heal", "Yo check out this weasel I found. Yeah, I said \"found,\" why? What, like you DON'T just pick up animals you find on the street? Get with the times, buddy. Weasels are in this year. Weasels are in every year. Get with it, or get out.", "https://en.wikipedia.org/wiki/File:LDVErmine.jpg"),
    new Gacha("Axe Buddy", 6, 0, 3, 4, "debuff", "Can I hatchet you a question?", "https://en.wikipedia.org/wiki/File:HaroldOfferedTheCrown.jpg"),
    new Gacha("The Pew-Pew Pirate", 6, 1, 3, 4, "freeze2", "It'd be pretty funny if there was like a pirate ship but instead of stealing treasure or whatever they just sailed around with a huge server full of pirated movies and music and just hosted their site in the middle of the ocean. The logistics aren't important. It'd be cool.", "https://en.wikipedia.org/wiki/File:Geo_Hager.jpg"),
    new Gacha("Interesting Cat", 6, 2, 3, 5, "healAll2", "This cat seems like it probably shouldn't be alive still. Black cats, black magic, who knows what's going on these days. I'm just along for the ride. So is this cat, apparently.", "https://en.wikipedia.org/wiki/File:Cat-Came-Back-1893.jpg"),
    new Gacha("A Mouse!", 6, 3, 3, 5, "healAll2", "Hey. Hey. Hey kid. Hey. I'm a fairy. You believe in fairies, don't you? Hey. Hey. I grant wishes. Fairies do that, right? Right. Anyway, hey. Hey. I need cheese. Bring me some cheese and I'll grant your wishes. Hey. Cheese. Bring it over.", "https://openclipart.org/detail/249121/debonair-mouse"),
    new Gacha("Bae-ker", 7, 0, 0, 5, "healWeak2", "This precious little chef is full of love and delicious pastries. Everyone thinks she has a boyfriend or something because she always says she's baking for her one true love, but that's her. She's her one true love. Remember to love yourself! You're worth it!", "https://free-images.com/display/queen_hearts_mother_goose2.html"),
    new Gacha("Goose Gander", 7, 1, 0, 3, "poison2", "Geese look like cute duck-esque birds but they are actually monsters of the highest calibur. Fear the goose.", "https://free-images.com/display/canada_goose_geese_canada.html"),
    new Gacha("L'il Class Traitor", 7, 2, 0, 3, "rage", "Don't let the heart on his baton fool you, he won't hesitate to hit you with it if he thinks he can get away with it. And he can. They always do.", "https://free-images.com/display/knave_hearts_mother_goose2.html"),
    new Gacha("Chumby", 7, 3, 0, 4, "speedAll", "Just as a reminder, because I can NOT stress this enough: cats are good and great and I love cats and you love cats and cats love you and cats are good good good I love cats.", "http://pickupimage.com/free-photos/Red-little-cat-on-the-isolated-background/2331637"),
    new Gacha("Exploding Lemon!!", 7, 0, 1, 4, "weakAll", "You can just eat a lemon. That's allowed. Just eat a whole raw lemon. No one will stop you. Do it. Come on, I dare you. It'll be fun.", "https://commons.wikimedia.org/wiki/File:Food-healthy-flying-kitchen_(23699998213).jpg"),
    new Gacha("Susshy", 7, 1, 1, 3, "buff", "I love susshy! In fact, I love Japan, PERIOD! The tea ceremonies... the J-Rock... and, of course, Girugamesh!", "https://free-images.com/display/food_kim_rice_lol_0.html"),
    new Gacha("Exploding Tomato!!", 7, 2, 1, 4, "freeze", "Imagine like you're biting into a nice juicy apple but then you realize that it's actually a tomato and you have a big mouthful of tomato now wouldn't that be messed up? Imagine. I hope you remember this the next time you see an apple.", "https://commons.wikimedia.org/wiki/File:Food-vegetables-flying-eat_(24326937875).jpg"),
    new Gacha("Balanced Meal", 7, 3, 1, 4, "healAll", "Eat some raw onions, wash it down with some balsamic vinegar, then finish it off with one (1) bell pepper and suck on some peppercorns as an after-dinner mint.", "https://free-images.com/display/food_vegetables_eat_nutrition.html"),
    new Gacha("Garlic", 7, 0, 2, 5, "shieldAll2", "Hey hi if you like garlic and games where you can use garlic as a weapon against foes you should check out Farming Fantasy coming soon from Haunted Bees Productions (that's who made this game too lol). That game was made in more than 2 days, unlike this one! Scoop it!", "https://free-images.com/display/garlic_black_garlic_aged.html"),
    new Gacha("Reverse Burglar", 7, 1, 2, 4, "speed2", "Sometimes people break into your house and take things that are yours. Other people break into your house and give you things that are theirs. This guy is the second one. He does this once a year and no one knows why. It might be like a sex thing.", "https://free-images.com/display/santa_santa_claus_nicholas.html"),
    new Gacha("Too Many Babies??", 7, 2, 2, 3, "speed", "You there! Won't you hear my storey? The strangest thing happened! My wife gave birth to a baby, then she did it three more times! One after another! Now we have to raise FOUR babies! That's Too Many Babies! Gadzooks! Tune in to our radio show to find out what happens next!", "https://commons.wikimedia.org/wiki/File:%22A_full_hand%22_LCCN2001699778.jpg"),
    new Gacha("Boyfriend", 7, 3, 2, 4, "weak2", "Love is a lot like bones and organs, because this boy is full of all of those things! And he wants to share that love with you! Love is always best when it's shared.", "https://commons.wikimedia.org/wiki/File:%22Be_my_Valentine_and_I%27ll_break_the_news_to_Mother.%22.jpg"),
    new Gacha("Suffrage Babies", 7, 0, 3, 5, "weakAll2", "\"Give Mother the Vote! Our Food, Our Health, Our Play, Our Homes, Our Schools, Our Work. Are all regulated by Men's Votes. Think it over and - GIVE MOTHER THE VOTE!\" Oh, how things have changed since the 1910s.", "https://commons.wikimedia.org/wiki/File:%22Give_Mother_the_Vote!%22.jpg"),
    new Gacha("Punkin Demon", 7, 1, 3, 4, "weak2", "He just wants to borrow your ear for a moment and tell you a little story about demon things. But before you know it, it's after sundown and you're late for supper! Mother will be most disappointed in you! Curse you, Punkin Demon! You've rused me for the last time!", "https://commons.wikimedia.org/wiki/File:%22Hallowe%27en.%22_(Devil-demon_seated_on_top_of_a_Jack-O-Lantern).jpg"),
    new Gacha("Beth", 7, 2, 3, 5, "weakAll2", "Yeah, her name's Beth. Why, what'd you think it was? Have you ever ASKED her what her name was? No, you didn't. Don't be rude. Say hello to Beth.", "https://en.wikipedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg"),
    new Gacha("1850's Children's Dress", 7, 3, 3, 3, "shieldLong", "This is what kids wore back in the day. Yep, it does look a lot like a pencil drawing or something but this is a real photograph of a real dress, not a drawing or anything. They really look like 2D drawings. I dunno how. 1850's science.", "https://commons.wikimedia.org/wiki/File:1850%27s_Children%27s_Dress.jpg"),
    new Gacha("The Goat", 8, 0, 0, 4, "strong", "Capricorns, born between December 22 and January 20, bear a strong resemblance to the goats that represent their sign, as evidenced by their natural curiousity, intelligence, and horns.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?CapricornGoat"),
    new Gacha("The Water Bearer", 8, 1, 0, 4, "freeze2", "Born between January 21 and February 19, Aquarians retain water like a sponge, allowing them to make quick getaways from the awkward encounters they often find themselves in by expelling a jet stream of water from their rear, propelling them to safety.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?AquariusTheWaterBearer"),
    new Gacha("The Fishes", 8, 2, 0, 4, "sand", "The Pisces are born between February and March 20, and do not have underwater breathing abilities, so please don't even try that. It won't work. You aren't literally a fish. Stop that.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?PiscesFishes"),
    new Gacha("The Ram", 8, 3, 0, 4, "strong", "The days between March 21 and April 20 are scary days indeed, as every Aries gets superhuman strength and an insatiable craving for ram meat. If you or a loved one is an Aries, please stay safe during these dangerous times.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?AriesRam"),
    new Gacha("The Bull", 8, 0, 1, 4, "aggro", "Those fortunate enough to be born between April 21 and May 21 are blessed with impeccable charm, stunning intellect, amazing good looks, and sexual characteristics (both primary and secondary) that their desired partners will find the most attractive of their peers. If I wasn't a Taurus, I'd at the very least want to marry one.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?TaurusBull"),
    new Gacha("The Twins", 8, 1, 1, 4, "speedAll2", "Born between May 22 and June 21, and May 22 and June 21, respectively, these two babies don't like being mistaken for each other. This trait is reflected in most Geminis, who react very negatively and often violently to being mistaken for someone else.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?GeminiTwinsTheyLookTheSame"),
    new Gacha("The Crab", 8, 2, 1, 4, "shield2", "Cancers are born between June 22 and July 22, and whenever someone tries to pinch you for not wearing green on St. Patrick's Day, you can bet your shamrocks that they're a Cancer!", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?CancerCrab"),
    new Gacha("The Lion", 8, 3, 1, 4, "weak", "You might be a Leo if you were born between July 23 and August 22! This is actually news to me because for the past 28 years my parents kept telling me my dad was a Leo but he was born on August 23 so what the HECK.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?LeoLion"),
    new Gacha("The Maiden", 8, 0, 2, 4, "revive", "Born on or after August 23? Born on or before September 23? Chances are you might be a Virjo! Virjoes are represented by the maiden, because Virjoes were MAIDEN BETWEEN those two dates! Ha ha! That's a nice little joke that prevents this game from being translated into other languages.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?VirgoMaiden"),
    new Gacha("The Scales", 8, 1, 2, 4, "debuff", "The Libras are born between September 24 and October 23, and they like to weigh things. Hand one a kilogramme of steel and a kilogramme of feathers and watch them lift them up and down in their hands and try to figure out which is heavier!", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?ScalesLibra"),
    new Gacha("The Scorpion", 8, 2, 2, 4, "buff", "Snippy snippy! Scorpios are born between October 24 and November 22, which means they are more likely than the average person to get very excited for Halloween. Trick or treat! I hope they aren't wearing a scorpion costume again this year!", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?ScorpioScorpion"),
    new Gacha("The Centaur", 8, 3, 2, 4, "ult", "Born between November 23 and December 21, if you see a Sagittarius, give them a hug (with their consent, of course). They probably need it. Trust me on this one.", "https://www.fromoldbooks.org/HansWeiditz-Remedies/pages/359-zodiac-signs/359-zodiac-signs-q90-2249x1875.jpg?SagittariusCentaur"),
    new Gacha("The Whale", 8, 0, 3, 5, "healWeak2", "Cetus is a non-canon Zodiac sign. Cetuses, along with Ophiuchuses, kind of got the short end of the stick, since nobody is allowed to be born under their constellations. Cetus makes up for this by being a sea monster that eats sailors for fun and profit.", "https://en.wikipedia.org/wiki/File:Sidney_Hall_-_Urania%27s_Mirror_-_Psalterium_Georgii,_Fluvius_Eridanus,_Cetus,_Officina_Sculptoris,_Fornax_Chemica,_and_Machina_Electrica.jpg"),
    new Gacha("Soldier Pete", 8, 1, 3, 3, "weak", "This olde English soldier probably died a coward's death hiding in a bog crying or something. Give him a wedgie if you see him in the afterlife.", "https://www.fromoldbooks.org/OldEngland/pages/0193-Costume-of-Soldier/"),
    new Gacha("Queen Mab", 8, 2, 3, 3, "heal", "If you've read Romeo and Juliet and, for some reason, remember anything about it other than \"they both died of thirst\" then you might recognize Queen Mab as a fairy who pranks sleeping people. You know, standard fairy faire, like putting their hands in a bowl of warm water.", "https://www.fromoldbooks.org/Edgar-TreasuryOfVerse/pages/205-Queen-Mab-no-words/"),
    new Gacha("Booky Bookerson", 8, 3, 3, 3, "poison", "Book it, boys! Booky Bookerson is here and he's gonna book us! How can he move so fast with that weird rectangle body??", "https://www.fromoldbooks.org/Thompson-TheGnomeKingOfOz/pages/175-the-bookman/")
    /*new Gacha("", 9, 0, 0, 3, "", "", ""),
    new Gacha("", 9, 1, 0, 3, "", "", ""),
    new Gacha("", 9, 2, 0, 3, "", "", ""),
    new Gacha("", 9, 3, 0, 3, "", "", ""),
    new Gacha("", 9, 0, 1, 3, "", "", ""),
    new Gacha("", 9, 1, 1, 3, "", "", ""),
    new Gacha("", 9, 2, 1, 3, "", "", ""),
    new Gacha("", 9, 3, 1, 3, "", "", ""),
    new Gacha("", 9, 0, 2, 3, "", "", ""),
    new Gacha("", 9, 1, 2, 3, "", "", ""),
    new Gacha("", 9, 2, 2, 3, "", "", ""),
    new Gacha("", 9, 3, 2, 3, "", "", ""),
    new Gacha("", 9, 0, 3, 3, "", "", ""),
    new Gacha("", 9, 1, 3, 3, "", "", ""),
    new Gacha("", 9, 2, 3, 3, "", "", ""),
    new Gacha("", 9, 3, 3, 3, "", "", "")*/
];