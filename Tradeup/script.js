createItem(items.playerGold)
createPuzzle()
createPuzzle(true)
if(document.querySelectorAll(".character-questions").length < 3) createPuzzle(true)


window.setInterval(() => {
    //Remove can be filled from all item icons
    document.querySelectorAll(".can-be-filled").forEach((e) => {
        e.classList.remove('can-be-filled')
    })

    if (stateObject.focusedItem != undefined) {
        document.querySelectorAll(`.trade-box:not(.traded)`).forEach((tb) => {
            if (stateObject.focusedItem.isGold === true) {
                tb.querySelectorAll(`.input-box`).forEach((e) => {
                    e.classList.add('can-be-filled')
                })
            }
            else {
                //Add it it all mystery icons
                tb.querySelectorAll(`.item-icon[src='ItemIcons/mystery.svg']`).forEach((e) => {
                    e.classList.add('can-be-filled')
                })
                tb.querySelectorAll(`.input-box[src='ItemIcons/${stateObject.focusedItem.imgsrc}']`).forEach((e) => {
                    e.classList.add('can-be-filled')
                })
            }
        })
    }

    //Check if focused item can be sold
    var focusedItem = document.querySelector("[focused = true]")
    if (focusedItem == null) {
        document.querySelector("#merchant-text").style.display = "block"
        document.querySelector("#sell-text").style.display = "none"
        document.querySelector("#item-description").style.display = "none"
    }
    else {
        document.querySelector("#merchant-text").style.display = "none"
        document.querySelector("#sell-text").style.display = "block"
        if (stateObject.focusedItem != undefined && stateObject.focusedItem.description != undefined) document.querySelector("#item-description").style.display = "block"
    }
}, 100)

var tutorial = document.querySelector("#tutorial")
tutorial.addEventListener("click", () => {
    if (tutorial.classList.contains("close")) tutorial.classList.remove("close")
    else tutorial.classList.add("close")
})

document.querySelector("#reset").addEventListener("click", () => {
    restartTrades()
})
