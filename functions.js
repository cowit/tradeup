function createItem(item) {
    var itemElement = document.createElement("img")
    itemElement.classList.add("item-icon")
    itemElement.src = `ItemIcons/${item.imgsrc}`
    document.querySelector("#items").appendChild(itemElement)
    itemElement.addEventListener("click", () => {
        if (itemElement.getAttribute("focused") == "true") {
            itemElement.setAttribute("focused", false)
            stateObject.focusedItem = undefined
            return
        }
        document.querySelectorAll(".item-icon").forEach((e) => {
            e.setAttribute("focused", false)
            stateObject.focusedItem = item
            if (item == stateObject.finalItem) {
                document.querySelector("#sell-text").innerHTML = `Turn in to complete quest!`
            }
            else if (item.value > 1) {
                document.querySelector("#sell-text").innerHTML = `Sell ${item.name} for ${item.value - 1}`
            }
            else if (item.value <= 1) {
                document.querySelector("#sell-text").innerHTML = `This item would not provide gold if sold, try bartering!`
            }
            document.querySelector("#item-description").innerHTML = item.description
        })
        itemElement.setAttribute("focused", true)
    })
}

function createTrade(trade) {
    var character = document.querySelector(`#${trade.occupation.id}`)

    //#region Create Character Box
    if (character === null) {
        var characterDetails = `
        <img class="character-portrait" src="portraits/${trade.occupation.icon}">
        <p class="character-name">${trade.occupation.name} the ${trade.occupation.title}</p>
        <p class="character-text">${trade.occupation.startingText}</p>
        <div class="trade-boxes"></div>`

        character = document.createElement("div")
        character.classList.add("character-questions")
        character.innerHTML = characterDetails
        character.id = trade.occupation.id
        document.querySelector("#characters").appendChild(character)
    }
    //#endregion

    if (trade.out === undefined) {
        console.warn(`Item is undefined!`)
        console.log(trade)
    }

    var tradeBox = document.createElement("div")
    tradeBox.classList.add("trade-box")
    tradeBox.innerHTML = `
        <img class="item-icon input-box" src="ItemIcons/mystery.svg">
        <img class="item-icon trade-icon" src="ItemIcons/trade-arrow.svg">
        <img class="item-icon" src="ItemIcons/${trade.out.imgsrc}">
        <img class="price-icon" src="priceIcons/${trade.out.value}.svg">`
    character.querySelector(".trade-boxes").appendChild(tradeBox)
    //Only allow each trade to happen once
    tradeBox.addEventListener("click", () => {
        var traded = tradeBox.classList.contains("traded")
        if (stateObject.focusedItem == undefined || traded === true) return
        //If trade is succesful
        if (stateObject.focusedItem == trade.in || stateObject.focusedItem.isGold == true && stateObject.playerGold >= trade.out.value) {
            traded = true
            tradeBox.classList.add("traded")
            //Inputs
            if (stateObject.focusedItem.isGold == true) {
                stateObject.playerGold -= trade.out.value
            }
            //Outputs
            if (trade.out.isGold === true) {
                stateObject.playerGold += trade.out.value
            }
            else {
                createItem(trade.out)
            }

            //Remove item from state object and ui.
            if (stateObject.focusedItem.isGold != true) document.querySelector("[focused=true]").remove()
            stateObject.focusedItem = undefined
            var mysteryBox = tradeBox.querySelector(".item-icon[src='ItemIcons/mystery.svg']")
            if (mysteryBox) mysteryBox.src = `ItemIcons/${trade.in.imgsrc}`
        }
        else {
            //If trade was wrong, reveal hints
            var mysteryBox = tradeBox.querySelector(".item-icon[src='ItemIcons/mystery.svg']")
            if (mysteryBox) mysteryBox.src = `ItemIcons/${trade.in.imgsrc}`
            stateObject.attempts += 1
            if (stateObject.focusedItem.isGold) {
                character.querySelector(".character-text").innerHTML = `You don't seem to have enough coin for that. I might be able to cut the price a bit for a ${trade.in.name}`
            }
            else {
                character.querySelector(".character-text").innerHTML = `That's not the item I'm looking for. Although I could use a ${trade.in.name}`
            }

        }

        //After All trades, update values
        document.querySelector("#attempts-counter").innerHTML = `Attempts: ${stateObject.attempts}`
        document.querySelector("#gold-counter").innerHTML = `Gold: ${stateObject.playerGold}`
    })
}

function createPuzzle(secondaryPuzzle = false) {
    var itemsArray = Object.entries(items)
    var starterItem
    while (starterItem === undefined) {
        var randomItem = itemsArray[Math.floor(Math.random() * itemsArray.length)][1]
        if (randomItem.value < 3 && randomItem.isGold !== true && !stateObject.activeItems.includes(randomItem)) {
            starterItem = randomItem
        }

    }

    if (secondaryPuzzle === false) {
        createItem(starterItem)
        stateObject.starterItem = starterItem
    }
    var lastItem
    var currentItem = starterItem
    var safetySwitch = 0
    var possibleGold = 0

    while (currentItem !== lastItem && safetySwitch < 100) {
        var eligableTrades = []
        //Set the last item. If the algorthym finds the same item twice, choose it.
        lastItem = currentItem

        //Push all trades that accept the current item into the eligible list.
        trades.forEach(trade => {
            if (stateObject.activeTrades.includes(trade)) return
            if (trade.in === currentItem) eligableTrades.push(trade)
        })

        //Get a random trade from the eligible list.
        if (eligableTrades.length > 0) {
            var chosenTrade = eligableTrades[Math.floor(Math.random() * eligableTrades.length)]
            createTrade(chosenTrade)
            stateObject.activeTrades.push(chosenTrade)
            if (chosenTrade.in !== currentItem) {
                possibleGold -= chosenTrade.in.value
                possibleGold += chosenTrade.out.value - 1
            }
            else {
                possibleGold -= chosenTrade.in.value - 1
                possibleGold += chosenTrade.out.value - 1
            }
            stateObject.activeItems.push(currentItem)
            currentItem = chosenTrade.out
        }

        //While statement overrun safety
        safetySwitch++
        if (safetySwitch > 99) console.log("Too many iterations passed.")
    }
    if (secondaryPuzzle === false) setTheMerchant(starterItem, currentItem)
}

function setTheMerchant(starterItem, finishItem) {
    stateObject.finalItem = finishItem
    var traded = false
    document.querySelector("#merchant-text").innerHTML = `I'm looking for a ${finishItem.name}. Go out and get me one. I'm sure you can manage to get a hold of one using this ${starterItem.name}`
    document.querySelector("#the-merchant").addEventListener("click", () => {
        if (stateObject.focusedItem == null || traded == true) return
        if (stateObject.focusedItem === stateObject.finalItem && traded == false) {
            traded = true
            document.querySelector("[focused=true]").remove()
            document.querySelector("#merchant-text").innerHTML = `Good job getting me that ${finishItem.name}. Take a few copper pieces and go buy a candy.`
        }
        else if (stateObject.focusedItem.value > 1) {
            document.querySelector("#merchant-text").innerHTML = `Not bad, here's some cash. Keep on getting me that ${finishItem.name}!`
            stateObject.playerGold += stateObject.focusedItem.value - 1
            document.querySelector("#gold-counter").innerHTML = "Gold: " + stateObject.playerGold
            document.querySelector("[focused=true]").remove()
        }
    })
}

function restartTrades() {
    stateObject.playerGold = 0;
    document.querySelector("#gold-counter").innerHTML = "Gold: " + stateObject.playerGold
    document.querySelectorAll(".traded").forEach(e => {
        e.classList.remove("traded")
    })
    document.querySelectorAll(".items>.item-icon").forEach((e) => {
        if (e.getAttribute("src") != "ItemIcons/gold.svg") e.remove()
    })
    stateObject.focusedItem = null
    createItem(stateObject.starterItem)
}