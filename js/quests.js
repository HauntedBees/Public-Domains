const quests = { // prize type: 0 = eploids, 1 = coinies
    "eventApr0": {
        name: "The Big Goof", recommendedLevel: 40, firstClear: 10, prizeType: 0, 
        enemies: [ new EnemyData(34, 20), new EnemyData(36, 35), new EnemyData(35, 20) ]
    },
    "eventApr1": {
        name: "Just a Prank!", recommendedLevel: 30, firstClear: 5, prizeType: 0, 
        enemies: [ new EnemyData(35, 20), new EnemyData(35, 20) ]
    },
    "eventApr2": {
        name: "Laugh Track", recommendedLevel: 20, firstClear: 5, prizeType: 0,
        enemies: [ new EnemyData(33, 10), new EnemyData(26, 10), new EnemyData(27, 10) ]
    },
    "eventApr3": {
        name: "The April Fool", recommendedLevel: 10, firstClear: 5, prizeType: 0,  
        enemies: [ new EnemyData(34, 15) ]
    },
    "eventApr4": {
        name: "Silly String", recommendedLevel: 5, firstClear: 2, prizeType: 0, 
        enemies: [ new EnemyData(32, 1), new EnemyData(33, 2), new EnemyData(32, 1) ]
    },
    "story0-0": {
        name: "The Beginning", recommendedLevel: 1, firstClear: 2, prizeType: 0, storyId: 1, map: "bg0",
        enemies: [ new EnemyData(7, 1) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: You made it! I'm so glad you're here, I've been waiting a long time for a hero to show up!" },
            { speaker: 37, left: true, text: "Dover Scout: You're in the Public Domains, an afterlife of sorts where things go when they die." },
            { speaker: 37, left: true, text: "Dover Scout: Well, at least, that's how it's supposed to be..." },
            { speaker: 37, left: true, text: "Dover Scout: A mysterious force known only as the mucky mouse has been doing some strange things, and now a lot of spirits are stuck wandering the earth, unable to move on to the Public Domains!" },
            { speaker: 37, left: true, text: "Dover Scout: I need your help to fight through the wandering spirits and find the mucky mouse, so I can get to the bottom of this!" },
            { speaker: 37, left: true, text: "Dover Scout: So enough talking for now, let's go!" }
        ]
    },
    "story0-1": {
        name: "The Journey Begins", recommendedLevel: 2, firstClear: 2, prizeType: 0, storyId: 2, map: "bg0",
        enemies: [ new EnemyData(15, 1), new EnemyData(15, 1) ]
    },
    "story0-2": {
        name: "Through the Fields", recommendedLevel: 2, firstClear: 2, prizeType: 0, storyId: 3, map: "bg0",
        enemies: [ new EnemyData(8, 1), new EnemyData(0, 1) ]
    },
    "story0-3": {
        name: "Deeper We Plunge", recommendedLevel: 3, firstClear: 2, prizeType: 0, storyId: 4, map: "bg0",
        enemies: [ new EnemyData(18, 1), new EnemyData(19, 1), new EnemyData(18, 1) ]
    },
    "story0-4": {
        name: "The Forest Guardian", recommendedLevel: 3, firstClear: 4, prizeType: 0, storyId: 5, map: "bg0",
        enemies: [ new EnemyData(23, 6) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: We're almost at the forest! What's that up ahead, though?" },
            { speaker: 23, left: false, text: "???: If you want to enter this forest, you'll have to get through me!" },
            { speaker: 37, left: true, text: "Dover Scout: Okay." }
        ]
    },
    "story1-0": {
        name: "Into the Forest", recommendedLevel: 5, firstClear: 2, prizeType: 0, storyId: 6, map: "bg1",
        enemies: [ new EnemyData(53, 4), new EnemyData(48, 4), new EnemyData(53, 4) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: We've made it to the forest... progress! We'll have to be careful though, there are a lot of dangerous animals here. Keep your eyes open!" },
            { speaker: 37, left: true, text: "Dover Scout: Past this forest is the Museum of Lost Art. We'll find more clues as to where the mucky mouse is in there. Let's keep moving!" }
        ]
    },
    "story1-1": {
        name: "Bird Trouble", recommendedLevel: 7, firstClear: 2, prizeType: 0, storyId: 7, map: "bg1",
        enemies: [ new EnemyData(65, 4), new EnemyData(7, 4), new EnemyData(65, 4), new EnemyData(7, 4) ]
    },
    "story1-2": {
        name: "Something's Bugging Me", recommendedLevel: 8, firstClear: 2, prizeType: 0, storyId: 8, map: "bg1",
        enemies: [ new EnemyData(68, 9), new EnemyData(68, 9) ]
    },
    "story1-3": {
        name: "Bark and Bite", recommendedLevel: 10, firstClear: 2, prizeType: 0, storyId: 9, map: "bg1",
        enemies: [ new EnemyData(66, 6), new EnemyData(83, 10), new EnemyData(66, 6) ]
    },
    "story1-4": {
        name: "The Sacred Cow", recommendedLevel: 12, firstClear: 4, prizeType: 0, storyId: 10, map: "bg1",
        enemies: [ new EnemyData(82, 16) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: We're out of the forest! But what ho, a large creature stands before us!" },
            { speaker: 82, left: false, text: "???: I am cow, hear me moo. I'm gonna murder you. There'll be nothing left once I'm through." },
            { speaker: 37, left: true, text: "Dover Scout: I didn't know cows could rhyme." },
            { speaker: 82, left: false, text: "???: I studied hard at Cow Academy." }
        ]
    },
    "story2-0": {
        name: "A Night at the Museum", recommendedLevel: 20, firstClear: 2, prizeType: 0, storyId: 11, map: "bg2",
        enemies: [ new EnemyData(0, 20), new EnemyData(4, 20) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: This is it -- the Museum of Lost Art. Many old art pieces went here after their creators died, but the mucky mouse wants to keep some art pieces out of the Public Domains forever!" },
            { speaker: 37, left: true, text: "Dover Scout: Rumor has it the mucky mouse itself is an art piece of some sort, whose creator died centuries ago... hopefully we'll find some clues in this museum!" }
        ]
    },
    "story2-1": {
        name: "Art Royalty", recommendedLevel: 22, firstClear: 2, prizeType: 0, storyId: 12, map: "bg2",
        enemies: [ new EnemyData(9, 19), new EnemyData(12, 19), new EnemyData(14, 19) ]
    },
    "story2-2": {
        name: "What a Cartoon!", recommendedLevel: 24, firstClear: 2, prizeType: 0, storyId: 13, map: "bg2",
        enemies: [ new EnemyData(31, 20), new EnemyData(22, 20), new EnemyData(26, 20), new EnemyData(30, 20) ]
    },
    "story2-3": {
        name: "Uncharted Territory", recommendedLevel: 26, firstClear: 2, prizeType: 0, storyId: 14, map: "bg2",
        enemies: [ new EnemyData(8, 23), new EnemyData(3, 23), new EnemyData(18, 23), new EnemyData(93, 23) ]
    },
    "story2-4": {
        name: "Restricted Area", recommendedLevel: 30, firstClear: 4, prizeType: 0, storyId: 15, map: "bg2",
        enemies: [ new EnemyData(50, 40) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: Hey, check this out! A restricted area! I'm sure there's something interesting in here!" },
            { speaker: 37, left: true, text: "Dover Scout: ..." },
            { speaker: 37, left: true, text: "Dover Scout: Woah, look at this... is this... a drawing of the mucky mouse? It's so cute... to think this adorable scamp is behind such things..." },
            { speaker: 50, left: false, text: "???: Who goes there?!" },
            { speaker: 37, left: true, text: "Dover Scout: Uh oh, it looks like we've been found out! Looks like we're gonna have to fight our way out of this one!" }
        ]
    },
    "story3-0": {
        name: "War Never Changes", recommendedLevel: 35, firstClear: 2, prizeType: 0, storyId: 16, map: "bg3",
        enemies: [ new EnemyData(4, 35), new EnemyData(5, 35), new EnemyData(4, 35) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: If that drawing I found really was the mucky mouse, then the signature on it is a clue! It was signed by a \"Wint D.\" The only Wint D. I've ever heard of is Prince Wint Diskey of the Diskey Kingdom!" },
            { speaker: 37, left: true, text: "Dover Scout: The only problem is the Diskey Kingdom has been in a constant state of war for the past thousand years or so. If we're going to confront Wint, we're gonna have to run through an active battlefield." },
            { speaker: 37, left: true, text: "Dover Scout: And that's exactly how I wanted to spend my Monday, so let's do this!" }
        ]
    },
    "story3-1": {
        name: "Infantry Interruptions", recommendedLevel: 38, firstClear: 2, prizeType: 0, storyId: 17, map: "bg3",
        enemies: [ new EnemyData(13, 34), new EnemyData(13, 34), new EnemyData(13, 34), new EnemyData(13, 34) ]
    },
    "story3-2": {
        name: "oh dear they have guns", recommendedLevel: 42, firstClear: 2, prizeType: 0, storyId: 18, map: "bg3",
        enemies: [ new EnemyData(29, 40), new EnemyData(38, 40), new EnemyData(85, 40), new EnemyData(70, 40) ]
    },
    "story3-3": {
        name: "Heavy Artillery", recommendedLevel: 45, firstClear: 2, prizeType: 0, storyId: 19, map: "bg3",
        enemies: [ new EnemyData(58, 50), new EnemyData(58, 50) ]
    },
    "story3-4": {
        name: "The General's Orders", recommendedLevel: 50, firstClear: 4, prizeType: 0, storyId: 20, map: "bg3",
        enemies: [ new EnemyData(62, 60) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: We're almost at the castle! I can see it--EEK that was a bullet!" },
            { speaker: 62, left: false, text: "???: You won't be advancing any further, young man." },
            { speaker: 37, left: true, text: "Dover Scout: G-g-g-GENERAL GINGER!! The most ruthless fighter in the Diskey Military!" },
            { speaker: 62, left: false, text: "General Ginger: I don't know what your business is, but I'm on strict orders to let NOBODY into the Kingdom. And if that includes me and my finest soldiers, it certainly includes strangers like you!" },
            { speaker: 37, left: true, text: "Dover Scout: If they're not even letting their own soldiers back into the Kingdom they have to be hiding something big... we've got to get through this!" }
        ]
    },
    "story4-0": {
        name: "Diskey World", recommendedLevel: 50, firstClear: 2, prizeType: 0, storyId: 21, map: "bg4",
        enemies: [ new EnemyData(9, 60) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: This is it... Wint's Diskey Castle!" },
            { speaker: 9, left: false, text: "???: Um, yeah. Yeah it is. But why are you here tho." },
            { speaker: 37, left: true, text: "Dover Scout: Who are you?" },
            { speaker: 9, left: false, text: "???: I'm Princelet Basarab. I'm in charge while Prince Diskey is working in secret." },
            { speaker: 37, left: true, text: "Dover Scout: Oh. Can you take us to him?" },
            { speaker: 9, left: false, text: "Basarab: Not without a fight I can't!" }
        ]
    },
    "story4-1": {
        name: "Basrab Busted", recommendedLevel: 51, firstClear: 2, prizeType: 0, storyId: 22, map: "bg4",
        enemies: [ new EnemyData(64, 48), new EnemyData(69, 48), new EnemyData(91, 46) ],
        cutscene: [
            { speaker: 9, left: false, text: "Basrab: Enough... enough... I admit defeat. I'll take you to where Wint is hiding." },
            { speaker: 37, left: true, text: "Dover Scout: Lead the way." },
            { speaker: 9, left: false, text: "Basarab: Down this tunnel there are some guards blocking the entrance to the Cryogenic Chambers. Wint is past those doors." },
            { speaker: 37, left: true, text: "Dover Scout: Well, let's get through those guards and find Wint!" }
        ]
    },
    "story4-2": {
        name: "The Guardian Twins", recommendedLevel: 52, firstClear: 2, prizeType: 0, storyId: 23, map: "bg4",
        enemies: [ new EnemyData(88, 55), new EnemyData(88, 55) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: Those guards were tough... but now we're here in the Cryogenic Chambers... why does a castle even have something like this?" },
            { speaker: 88, left: false, text: "???: that is not for you to know." },
            { speaker: 37, left: true, text: "Dover Scout: Oh dear, a thing." },
            { speaker: 88, left: false, text: "???: We are the Twin Guardians of the muckey mouse. You will not proceed any further." },
            { speaker: 37, left: true, text: "Dover Scout: That's what they all say!" }
        ]
    },
    "story4-3": {
        name: "Wint Diskey", recommendedLevel: 55, firstClear: 2, prizeType: 0, storyId: 24, map: "bg4",
        enemies: [ new EnemyData(96, 60), new EnemyData(99, 60) ],
        cutscene: [
            { speaker: 37, left: true, text: "Dover Scout: Wint Diskey! We know you're in here! Show yourself!" },
            { speaker: 99, left: false, text: "Wint: WHO ARE YOU? WHAT ARE YOU DOING IN MY CHAMBERS?!" },
            { speaker: 37, left: true, text: "Dover Scout: We know you're behind the muckey mouse! Probably! And we're here to stop you!" },
            { speaker: 99, left: false, text: "Wint: STOP ME!? YOU FOOLS COULDN'T STOP A FAUCET THAT'S ALREADY ALMOST ALL THE WAY OFF!! GIVE ME A HAND HERE, SCOOPY!" },
            { speaker: 96, left: false, text: "???: I guess my name's Scoopy now." }
        ]
    },
    "story4-4": {
        name: "The Mucky Mouse", recommendedLevel: 65, firstClear: 20, prizeType: 0, storyId: 24, map: "bg4",
        enemies: [ new EnemyData(110, 45), new EnemyData(111, 75), new EnemyData(97, 60), new EnemyData(98, 65) ],
        cutscene: [
            { speaker: 99, left: false, text: "Wint: HRGHH... HOW COULD I LOSE TO YOU?" },
            { speaker: 37, left: true, text: "Dover Scout: The power of the Public Domains is stronger than anything you have, Wint! Now talk! What is the muckey mouse?!" },
            { speaker: 99, left: false, text: "Wint: MANY YEARS AGO, I CREATED A CREATURE, NO, A FORCE, CALLED THE MUCKEY MOUSE... ITS POWER WAS SO VAST... AND YET, IT, LIKE ALL GOOD THINGS, HAD TO COME TO AN END, AND MOVE ON TO THE PUBLIC DOMAINS." },
            { speaker: 99, left: false, text: "Wint: BUT I KNEW THAT IF I COULD... HHRGHHH....." },
            { speaker: 37, left: true, text: "Dover Scout: What?! He died right before explaining everything?! That's rude." },
            { speaker: 37, left: true, text: "Dover Scout: But it looks like the muckey mouse is behind that door... I guess this is it..." },
            { speaker: 37, left: true, text: "Dover Scout: Let's save the Public Domains!" }
        ]
    }
};
const buddyMessages = [
    "Did you know eggs are technically a fruit? It's true! Just don't quote me on it.",
    "Remember to save the bees!",
    "It is 12:40 AM on April 1st right now and I have work in the morning! I should sleep!",
    "I never sleep. I only wait.",
    "Wanna make out?",
    "Hey hi welcome back. Be sure to spend lots of money on summons!",
    "Ha ha, this newspaper comic about a fat cat is hilarious. He sure loves his Mondays!",
    "Fight the system.",
    "Happy April Fool's 2019 from Haunted Bees Productions!",
    "Bread is tasty. Cheese is tasty. Grilled cheese sandwiches are extra tasty.",
    "Do you like anime?",
    "I invested in cryptocurrencies and now my life is a lot worse, but correlation doesn't imply causation! Right??",
    "The only good genre of music is ska.",
    "Hey can I borrow like five bucks?",
    "You know when you feel your phone vibrate in your pocket, but it didn't actually vibrate? Weird stuff, huh? My theory: a ghost is trying to sext you.",
    "Isn't it past your bedtime?",
    "Some BODY once told me... something. I forget what they said, though."
];

function GetRandomEnemySet(recLevel, maxEnemies) {
    let numEnemies = Math.ceil(Math.random() * maxEnemies);
    const minLevel = Math.ceil(recLevel / 4);
    const maxLevel = recLevel, dLevel = maxLevel - minLevel;
    const arr = [];
    while(numEnemies-- > 0) {
        const myLevel = minLevel + Math.floor(Math.random() * dLevel);
        arr.push(new EnemyData(-1, myLevel));
    }
    return arr;
}