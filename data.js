var stateObject = {
    focusedItem: null,
    starterItem: null,
    finalItem: null,
    playerGold: 0,
    attempts: 0,
    activeTrades: [],
    activeItems: []
}

var items = {
    playerGold: { name: "Bag of Gold", imgsrc: "gold.svg", value: 0, isGold: true, description: "Your lucky coin purse! Use this to trade for items using gold. It will take their full value in gold to purchase any item with it." },
    //Value 1
    axe: { name: "Strong Axe", imgsrc: "axe.svg", value: 1, description: "A strong, well-made axe that can fetch a good price from the right buyer." },
    shears: { name: "Quality set of Shears", imgsrc: "shears.svg", value: 1, description: "A finely sharpened pair of shears. Especially good for lightening the load of a sheep." },
    gold1: { name: "Bag of Gold", imgsrc: "gold1.svg", value: 1, isGold: true },
    //Value 2
    fruit: { name: "Crate of Fruit", imgsrc: "apple.svg", value: 2, description: "A small crate of fruit, a bit annoying to lug around. At least the fruit smell nice." },
    wool: { name: "Bag of wool", imgsrc: "wool.svg", value: 2, description: "A large sack of quality wool. Hard to find stuff this good at this time of year." },
    gold2: { name: "Bag of Gold", imgsrc: "gold2.svg", value: 2, isGold: true },
    //Value 3
    clothing: { name: "Fine Clothing", imgsrc: "shirt.svg", value: 3, description: "Clothing made to exacting quality. They put the wool to it's best use." },
    pineapple: { name: "Pineapple", imgsrc: "pineapple.svg", value: 3, description: "A large fruit only gotten from merchants at the port. Quite a fascination for many of the royal and artistic set." },
    gold3: { name: "Bag of Gold", imgsrc: "gold3.svg", value: 3, isGold: true },
    //Value 4 this value should be skipped to show that more valuable items are worth significantly more
    //Value 5
    art: { name: "Art", imgsrc: "art.svg", value: 4, description: "A beautiful rendering of it's subject. Truly inspired." },
    jam: { name: "Jars of Artisan Jam", imgsrc: "jam.svg", value: 5, description: "Delicious jam fit for a baron or a particularly wealthy fellow." },
    jailWaiver: { name: "Jail Waiver", imgsrc: "jail-waiver.svg", value: 5, description: "A so-called 'get out of jail free' card from someone with quite some sway. What could have such a value to be worth this?" },
    //Value 6
    landTitle: { name: "Land Title", imgsrc: "land-title.svg", value: 6, description: "The title to a small portion of land, gifted by a noble who surely has better things to do than oversee some carrots." },
    antique: { name: "Antique Lamp", imgsrc: "antique-lamp.svg", value: 6, description: "A pristine, golden lamp with odd, ancient markings on it. Too valuable to be worth using." },
}

var occupations = {
    //A knowledgable farmer
    farmer: { name: "Rolph", icon: "rolph.png", title: "Farmer", id: "farmer", startingText: "Always looking for hard work and good tools." },
    //An italian goods flipper
    merchant: { name: "Anfrione", icon: "anfrione.png", title: "Merchant", id: "merchant", startingText: "Like the Doge, I don't argue over price. The ducats are what is shown." },
    //A secluded and floaty minded sort of fellow, obsessed to an unhealthy degree with pineapple?
    noble: { name: "Gawin", icon: "gawin.png", title: "Noble", id: "noble", startingText: "I'd be delighted to get fineries and exotic fruit." },
    //An over-excitable artist type. Always looking for a subject
    artist: { name: "Briggete", icon: "briggite.png", title: "Artist", id: "artist", startingText: "Oh! oh to find a subject to paint!" },
    //A smarmy, but smart on her feet thief who is temporarily emberassed by being in jail
    thief: { name: "Sybbyl", icon: "sybbyl.png", title: "Thief", id: "thief", startingText: "Hey, spring me out of here and I'll fetch you something worth twice it's weight in gold!" },
    //A kindly old man who just wants to make some nice clothing.
    clothier: { name: "Garrat", icon: "garrat.png", title: "Clothier", id: "clothier", startingText: "Ah, this time of year it's so hard to find quality materials. Seems I'm going back to the scraps of last year." },
}

var trades = [
    //Farmer
    { in: items.axe, out: items.fruit, occupation: occupations.farmer, completeText: "This will do a fine job clearing some more land." },
    { in: items.shears, out: items.wool, occupation: occupations.farmer, completeText: "My old shears have been getting a bit dull, Dolly has been needing a trim too." },
    { in: items.clothing, out: items.jam, occupation: occupations.farmer, completeText: "This is some of the finest sewing I've seen on a set of good clothing. This would look fine at the ball coming up. How about a fine collection of jam for it." },
    //Fruit Merchant
    { in: items.fruit, out: items.gold3, occupation: occupations.merchant, completeText: "Juicy, Ripe, practically worth it's weight in gold!" },
    { in: items.gold3, out: items.pineapple, occupation: occupations.merchant, completeText: "Happy doing business with'ya. Don't lose that now, I only ever get a couple from La Serenissima a month!" },
    //Noble
    { in: items.pineapple, out: items.jailWaiver, occupation: occupations.noble, completeText: "And of which foreign land could such a fantastical thing come from! I must study this at once." },
    { in: items.art, out: items.landTitle, occupation: occupations.noble, completeText: "How beautifully rendered. This should be worth an entire kingdom! Although sadly I must offer you this title of a smaller portion." },
    //Artist
    { in: items.pineapple, out: items.art, occupation: occupations.artist, completeText: "It's a fruit? Of which I've never seen, this will inspire me greatly! To be free from the grips of dis-creativity!" },
    //Thief
    { in: items.jailWaiver, out: items.antique, occupation: occupations.thief, completeText: "Thanks, kid. Got this from my last haul that got me tossed in here. Don't go rubbing it! You'll wear the coating." },
    //Clothier
    { in: items.wool, out: items.clothing, occupation: occupations.clothier, completeText: "Finally some quality wool, I'll be sure to make something worth of this un-seasonably soft wool." },
]