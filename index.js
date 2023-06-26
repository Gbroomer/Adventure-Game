
//Currently the only two global variables that hold character information. Likely we can use more for things like Monsters and location data
let fetchPlayer, playerCharacter;

//Handles the searchbar functionality

const charSearch = () => {
    const charSearchForm = document.getElementById("character-search")
    charSearchForm.addEventListener("submit", (e) => {
        e.preventDefault()

            const charSearchInput = document.getElementById("char-search").value

            console.log(charSearchInput)
            fetchChar(charSearchInput.toLowerCase()).then(() => {

                const listCharacter = document.getElementById("characters")
                listCharacter.innerHTML = ""

                const addChar = document.createElement("li")
                addChar.textContent = `${fetchPlayer.name}: Str(${fetchPlayer.str}), Dex(${fetchPlayer.dex}), Con(${fetchPlayer.con}), Wis(${fetchPlayer.wis}), Int(${fetchPlayer.int}), Cha(${fetchPlayer.cha})`

                const addConfirm = document.createElement("button")
                addConfirm.id = "confirm-character-button"
                addConfirm.className = "btn btn-pushable btn-pushable--black"
                addConfirm.textContent = "Confirm Character?"
                addConfirm.style.width = "150px"
                addConfirm.style.height = "75px"
                addConfirm.addEventListener("click", () => {
                    generateCharacter(fetchPlayer)
                })
                listCharacter.append(addChar, addConfirm)

                startGameFromCharacterSubmission()
            })
        })
}

//Confirm character selection from db.json and start game (remove stat selection box and character-generator, create new screen)

function startGameFromCharacterSubmission(){
    document.getElementById("confirm-character-button").addEventListener("click", (e) => {
        e.preventDefault(); 
        document.getElementById("initialized-character-generator").remove();

        const newGameScreen = document.createElement("div")
        newGameScreen.id = "game-screen"
        document.body.appendChild(newGameScreen)

        const startGameForm = document.createElement("p")
        startGameForm.id = "game-dialogue"
        startGameForm.className = "game-screen"
        startGameForm.textContent = `Hello, ${fetchPlayer.name}. You have awoken in a dark cell. It is dimly lit with torches on the wall. The room is bare except for a bed and a bucket, what do you do?`
        newGameScreen.appendChild(startGameForm)

        const gameDialogueInput = document.createElement("input")
        gameDialogueInput.className = 'submit-button'
        gameDialogueInput.type = 'text'
        const gameDialogueSubmit = document.createElement("input")
        gameDialogueSubmit.className = "submit-button"
        gameDialogueSubmit.type = "submit"
        gameDialogueSubmit.value = "Submit"
        startGameForm.appendChild(gameDialogueInput)
        startGameForm.appendChild(gameDialogueSubmit)
        
        
        
    })
}


//Takes an object of character information, either from the db.json or from the (eventually) character creation section and adds their stats to the sidebar)
const generateCharacter = (pcInfo) => {

    playerCharacter = pcInfo

    const clearSearchBar = document.getElementById("top-bar")
    clearSearchBar.innerHTML = ""

    const startGame = document.createElement('h2')
    startGame.className = ".stat"
    startGame.textContent = "Good Luck!"

    clearSearchBar.append(startGame)

    const charName = document.getElementById("char-name")
    charName.textContent = playerCharacter.name

    const charHP = document.getElementById("health-number")
    charHP.textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`

    const charStr = document.getElementById("str")
    charStr.textContent = `STR: ${playerCharacter.str}`

    const charDex = document.getElementById("dex")
    charDex.textContent = `DEX: ${playerCharacter.dex}`

    const charCon = document.getElementById("con")
    charCon.textContent = `CON: ${playerCharacter.con}`

    const charWis = document.getElementById("wis")
    charWis.textContent = `WIS: ${playerCharacter.wis}`

    const charInt = document.getElementById("int")
    charInt.textContent = `INT: ${playerCharacter.int}`

    const charCha = document.getElementById("cha")
    charCha.textContent = `CHA: ${playerCharacter.cha}`
    
}
//Takes an input and fetches a character with a matching name; currently only used in charSearch() but could be used elsewhere
async function fetchChar(input) {

    const res = await fetch("http://localhost:3000/characters");

    const characters = await res.json();
    
    fetchPlayer = characters.find(character => character.name.toLowerCase() === input);

    if(fetchPlayer) {
        return fetchPlayer;
    } else {
        alert ('character not found')
    }
}
//Initialize the character creation menu on the front page
const initCharMaker = () => {
    //JS side stats
    let str = 8
    let dex = 8
    let con = 8
    let wis = 8
    let int = 8
    let cha = 8
    let totalPoints = 27
    //JS side cost per point
    let strCost = 1
    let dexCost = 1
    let conCost = 1
    let wisCost = 1
    let intCost = 1
    let chaCost = 1
    //breakpoint for point-buy
    const costBreakpoint = 13
    //Point Buy Counter
    const pointBuy = document.getElementById("point-buy")
    //All textboxes related to the shown stats
    const strStatShow = document.getElementById("strength")
    const dexStatShow = document.getElementById("dexterity")
    const conStatShow = document.getElementById("constitution")
    const wisStatShow = document.getElementById("wisdom")
    const intStatShow = document.getElementById("intelligence")
    const chaStatShow = document.getElementById("charisma")
    //All up and down buttons for the point-buy
    const strUp = document.getElementById("str-up")
    const strDown = document.getElementById("str-down")
    const dexUp = document.getElementById("dex-up")
    const dexDown = document.getElementById("dex-down")
    const conUp = document.getElementById("con-up")
    const conDown = document.getElementById("con-down")
    const wisUp = document.getElementById("wis-up")
    const wisDown = document.getElementById("wis-down")
    const intUp = document.getElementById("int-up")
    const intDown = document.getElementById("int-down")
    const chaUp = document.getElementById("cha-up")
    const chaDown = document.getElementById("cha-down")
    //Grab the Cost text for each
    const strCostText = document.getElementById("str-cost")
    const dexCostText = document.getElementById("dex-cost")
    const conCostText = document.getElementById("con-cost")
    const wisCostText = document.getElementById("wis-cost")
    const intCostText = document.getElementById("int-cost")
    const chaCostText = document.getElementById("cha-cost")
    //Assign and handle up/down arrow functionality to change the values of the stats.
    strUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > strCost && str <= 15) {
            totalPoints -= strCost;
            str++
            strStatShow.textContent = `Strength: ${str}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(str, totalPoints, strCost)
            if(str >= costBreakpoint){
                strCost = 2
                strCostText.textContent = `cost: ${strCost}`
            }
          } 
    })
    strDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + strCost < 28 && str > 8) {
            totalPoints += strCost;
            str--
            strStatShow.textContent = `Strength: ${str}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(str, totalPoints, strCost)
            if(str < costBreakpoint + 1){
                strCost = 1
                strCostText.textContent = `cost: ${strCost}`
            }
          } 
    })
    dexUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > dexCost && str <= 15) {
            totalPoints -= dexCost;
            dex++
            dexStatShow.textContent = `Dexterity: ${dex}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(dex, totalPoints, dexCost)
            if(dex >= costBreakpoint){
                dexCost = 2
                dexCostText.textContent = `cost: ${dexCost}`
            }
          } 
    })
    dexDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + dexCost < 28 && dex > 8) {
            totalPoints += dexCost;
            dex--
            dexStatShow.textContent = `Dexterity: ${dex}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(dex, totalPoints, dexCost)
            if(dex < costBreakpoint + 1){
                dexCost = 1
                dexCostText.textContent = `cost: ${dexCost}`
            }
          } 
    })
    conUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > conCost && con <= 15) {
            totalPoints -= conCost;
            con++
            conStatShow.textContent = `Constitution: ${con}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(con, totalPoints, conCost)
            if(con >= costBreakpoint){
                conCost = 2
                conCostText.textContent = `cost: ${conCost}`
            }
          } 
    })
    conDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + conCost < 28 && con > 8) {
            totalPoints += conCost;
            con--
            conStatShow.textContent = `Constitution: ${con}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(con, totalPoints, conCost)
            if(con < costBreakpoint + 1){
                conCost = 1
                conCostText.textContent = `cost: ${conCost}`
            }
          } 
    })
    wisUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > wisCost && wis <= 15) {
            totalPoints -= wisCost;
            wis++
            wisStatShow.textContent = `Wisdom: ${wis}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(wis, totalPoints, wisCost)
            if(wis >= costBreakpoint){
                wisCost = 2
                wisCostText.textContent = `cost: ${wisCost}`
            }
          } 
    })
    wisDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + wisCost < 28 && wis > 8) {
            totalPoints += wisCost;
            wis--
            wisStatShow.textContent = `Wisdom: ${wis}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(wis, totalPoints, wisCost)
            if(wis < costBreakpoint + 1){
                wisCost = 1
                wisCostText.textContent = `cost: ${wisCost}`
            }
          } 
    })
    intUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > intCost && int <= 15) {
            totalPoints -= intCost;
            int++
            intStatShow.textContent = `Intelligence: ${int}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(int, totalPoints, intCost)
            if(int >= costBreakpoint){
                intCost = 2
                intCostText.textContent = `cost: ${intCost}`
            }
          } 
    })
    intDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + intCost < 28 && int > 8) {
            totalPoints += intCost;
            int--
            intStatShow.textContent = `Intelligence: ${int}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(int, totalPoints, intCost)
            if(int < costBreakpoint + 1){
                intCost = 1
                intCostText.textContent = `cost: ${intCost}`
            }
          } 
    })
    chaUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints > chaCost && cha <= 15) {
            totalPoints -= chaCost;
            cha++
            chaStatShow.textContent = `Charisma: ${cha}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(cha, totalPoints, chaCost)
            if(cha >= costBreakpoint){
                chaCost = 2
                chaCostText.textContent = `cost: ${chaCost}`
            }
          } 
    })
    chaDown.addEventListener("click", () => {
        if (totalPoints <= 27 && totalPoints + chaCost < 28 && cha > 8) {
            totalPoints += chaCost;
            cha--
            chaStatShow.textContent = `Charisma: ${cha}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(cha, totalPoints, chaCost)
            if(cha < costBreakpoint + 1){
                chaCost = 1
                chaCostText.textContent = `cost: ${chaCost}`
            }
          } 
    })
}

initCharMaker()
charSearch()
