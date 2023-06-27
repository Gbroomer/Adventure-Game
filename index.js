
//Global variables that are used in several functions
let fetchPlayer, playerCharacter, currentLocation, locationLeft, locationRight, locationForward;
let leaveSwitch = false;

//Handles the searchbar functionality
const charSearch = () => {
    const charSearchForm = document.getElementById("character-search")
    charSearchForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const charSearchInput = document.getElementById("char-search").value

        fetchChar(charSearchInput.toLowerCase()).then(() => {
            if (fetchPlayer) {

                const listCharacter = document.getElementById("characters")
                listCharacter.innerHTML = ""

                const addChar = document.createElement("li")
                addChar.textContent = `${fetchPlayer.name}: Str(${fetchPlayer.str}), Dex(${fetchPlayer.dex}), Con(${fetchPlayer.con}), Wis(${fetchPlayer.wis}), Int(${fetchPlayer.int}), Cha(${fetchPlayer.cha})`

                const addConfirm = document.createElement("button")
                addConfirm.className = "btn btn-pushable btn-pushable--black"
                addConfirm.textContent = "Confirm Character?"
                addConfirm.style.width = "150px"
                addConfirm.style.height = "75px"
                addConfirm.addEventListener("click", () => {
                    generateCharacter(fetchPlayer)
                    startGameFromCharacterSubmission()
                })
                listCharacter.append(addChar, addConfirm)
            } else {
                alert("character not found")
            }
        })
    })
}
//Handles saving a newly created character to the JSON
function postCharacter() {
    fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(playerCharacter)
    })
        .then(console.log(playerCharacter))
}
//Takes an object of character information, either from the db.json or from the (eventually) character creation section and adds their stats to the sidebar)
const generateCharacter = (pcInfo) => {

    playerCharacter = pcInfo

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
//Takes an input and searches the database for a match
async function fetchChar(input) {

    const res = await fetch("http://localhost:3000/characters");

    const characters = await res.json();

    fetchPlayer = characters.find(character => character.name.toLowerCase() === input);

    if (fetchPlayer) {
        return fetchPlayer;
    } else {
        return
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
        if (totalPoints > 0 && totalPoints >= strCost && str <= 15) {
            totalPoints -= strCost;
            str++
            strStatShow.textContent = `Strength: ${str}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(str, totalPoints, strCost)
            if (str >= costBreakpoint) {
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
            if (str < costBreakpoint + 1) {
                strCost = 1
                strCostText.textContent = `cost: ${strCost}`
            }
        }
    })
    dexUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints >= dexCost && dex <= 15) {
            totalPoints -= dexCost;
            dex++
            dexStatShow.textContent = `Dexterity: ${dex}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(dex, totalPoints, dexCost)
            if (dex >= costBreakpoint) {
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
            if (dex < costBreakpoint + 1) {
                dexCost = 1
                dexCostText.textContent = `cost: ${dexCost}`
            }
        }
    })
    conUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints >= conCost && con <= 15) {
            totalPoints -= conCost;
            con++
            conStatShow.textContent = `Constitution: ${con}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(con, totalPoints, conCost)
            if (con >= costBreakpoint) {
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
            if (con < costBreakpoint + 1) {
                conCost = 1
                conCostText.textContent = `cost: ${conCost}`
            }
        }
    })
    wisUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints >= wisCost && wis <= 15) {
            totalPoints -= wisCost;
            wis++
            wisStatShow.textContent = `Wisdom: ${wis}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(wis, totalPoints, wisCost)
            if (wis >= costBreakpoint) {
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
            if (wis < costBreakpoint + 1) {
                wisCost = 1
                wisCostText.textContent = `cost: ${wisCost}`
            }
        }
    })
    intUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints >= intCost && int <= 15) {
            totalPoints -= intCost;
            int++
            intStatShow.textContent = `Intelligence: ${int}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(int, totalPoints, intCost)
            if (int >= costBreakpoint) {
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
            if (int < costBreakpoint + 1) {
                intCost = 1
                intCostText.textContent = `cost: ${intCost}`
            }
        }
    })
    chaUp.addEventListener("click", () => {
        if (totalPoints > 0 && totalPoints >= chaCost && cha <= 15) {
            totalPoints -= chaCost;
            cha++
            chaStatShow.textContent = `Charisma: ${cha}`
            pointBuy.textContent = `Available Points: ${totalPoints}/27`
            console.log(cha, totalPoints, chaCost)
            if (cha >= costBreakpoint) {
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
            if (cha < costBreakpoint + 1) {
                chaCost = 1
                chaCostText.textContent = `cost: ${chaCost}`
            }
        }
    })
    //grab Name input box and submit character Generation
    const nameSubmitBtn = document.getElementById("character-gen")
    nameSubmitBtn.addEventListener("submit", e => {
        e.preventDefault()
        const nameInput = document.getElementById("name").value
        if (totalPoints === 0) {
            const generatedCharacter = {
                "name": nameInput,
                "currentHp": 10,
                "totalHp": 10,
                "AC": Math.floor((dex - 10) / 2) + 10,
                "str": str,
                "dex": dex,
                "con": con,
                "wis": wis,
                "int": int,
                "cha": cha,
                "str-mod": Math.floor((str - 10) / 2),
                "dex-mod": Math.floor((dex - 10) / 2),
                "con-mod": Math.floor((con - 10) / 2),
                "wis-mod": Math.floor((wis - 10) / 2),
                "int-mod": Math.floor((int - 10) / 2),
                "cha-mod": Math.floor((cha - 10) / 2),
                "potions": 0,
                "main-hand": "empty",
                "off-hand": "empty",
                "armor": "empty",
                "ranged": "empty",
                "gold": 0,
                "key": 0,
                "spell-1": "firebolt",
                "spell-2": "empty",
                "spell-3": "empty",
                "spell-4": "empty",
                "spell-5": "empty"
            }
            fetchChar(generatedCharacter.name.toLowerCase()).then(res => {
                console.log(fetchPlayer)
                if (fetchPlayer === undefined) {
                    playerCharacter = generatedCharacter
                    console.log(generatedCharacter)
                    generateCharacter(generatedCharacter)
                    postCharacter(playerCharacter)
                    startGameFromCharacterSubmission()
                } else {
                    alert("A character with this name already exists")
                }
            })
        } else {
            alert('You still have points to spend!')
        }
    })
}
//Generates the Information about the Next Rooms
const runNextRooms = (room, gameText) => {
    
    search("http://localhost:3000/Events/1").then(res => {
        locationLeft = undefined
        locationRight = undefined
        locationForward = undefined
        let left, right, forward
        let events = res
        for(i = 1; i < 4; i++){
            let RNG = Math.floor(Math.random() * 4) + 1
            if(i !== RNG){
                    let eventType = events[i]

                    if (i === 1) {

                        left = eventType

                    } else if (i === 2) {

                        right = eventType

                    } else if (i === 3) {

                        forward = eventType

                    }
                }

        } 
        // console.log(left, right, forward)
        
        if (left === undefined, right === undefined, forward === undefined){

            left = "Monsters"
            right = "Monsters"
            forward = "Monsters"
       
        } 
        let eventsArray = []
        if(left !== undefined){
            eventsArray.push(left)
        }if(right !== undefined) {
            eventsArray.push(right)
        }if(forward !== undefined){
            eventsArray.push(forward)
        }

        let weirdCounter = 0
        for(i = 0; i < eventsArray.length; i++) {
            let idRNG = Math.floor(Math.random() * 2) +1
            weirdCounter ++;
            // console.log(eventsArray, i)
            // console.log(res)
            if(eventsArray.includes(left) && weirdCounter === 1) {
                search(`http://localhost:3000/${eventsArray[i]}/${idRNG}`).then(res => {
                    locationLeft = res
                    console.log(`data: ${res.name}`)
                    console.log(`location: ${locationLeft.name}`)
            })

            } else if(eventsArray.includes(right) && weirdCounter === 2) {
                search(`http://localhost:3000/${eventsArray[i]}/${idRNG}`).then(res => {
                    locationRight = res
                    console.log(`data: ${res.name}`)
                    console.log(`location: ${locationRight.name}`)
                })

            } else if(eventsArray.includes(forward) && weirdCounter === 3) {
                search(`http://localhost:3000/${eventsArray[i]}/${idRNG}`).then(res => {
                    locationForward = res
                    console.log(`data: ${res.name}`)
                    console.log(`location: ${locationForward.name}`)
                })
            }
        }
    })
}
//Runs the Combat Scenario (currently not functional)
const runCombat = () => {
    console.log(currentLocation)
}
//Grabs information about the current Room and checks to make sure that the Input is relevant to the current Room
const runCurrentRoom = (input, room, gameText) => {

    room.textContent = currentLocation.name

    if (leaveSwitch === false) {
        if (currentLocation.type === "treasure") {

            if (input === currentLocation.option1) {

                let skillDC = Math.floor(Math.random() * 11) + 5
                console.log(`skillDC: ${skillDC}`)
                let skillType = currentLocation.option1Test
                let skillCheck = Math.floor(Math.random() * 20) + (playerCharacter[skillType] + 1)
                console.log(`skillCheck: ${skillCheck}`)

                if (skillCheck >= skillDC) {

                    
                    if(currentLocation.option1GoodRes === "key") {

                        playerCharacter.key++
                        gameText.textContent = `${currentLocation.option1Good} You gained A Key!`

                    } if(currentLocation.option1GoodRes === "gold") {

                        playerCharacter.gold += currentLocation.gold
                        gameText.textContent = `${currentLocation.option1Good} You gained ${currentLocation.gold}`

                    } if(currentLocation.option1GoodRes === "item") {

                        //runItemSwap()
                    }

                } else {

                    if(currentLocation.option1BadRes === "HP") {

                        const healthLoss = Math.floor(Math.random() * 3) + 1
                        playerCharacter.currentHp -= healthLoss

                        gameText.textContent = `${currentLocation.option1Bad} You lost ${healthLoss} Health.`

                        const healthBar = document.getElementById("health-number")
                        healthBar.textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`

                    } else {
                        gameText.textContent = currentLocation.option1Bad
                    }
                }

            } if (input === currentLocation.option2) {

                let skillDC = Math.floor(Math.random() * 11) + 5
                console.log(`skillDC: ${skillDC}`)
                let skillType = currentLocation.option2Test
                let skillCheck = Math.floor(Math.random() * 20) + (playerCharacter[skillType] + 1)
                console.log(`skillCheck: ${skillCheck}`)

                if (skillCheck >= skillDC) {

                    
                    if(currentLocation.option2GoodRes === "key") {

                        playerCharacter.key++
                        gameText.textContent = `${currentLocation.option2Good} You gained a Key!`

                    } if(currentLocation.option2GoodRes === "gold") {

                        playerCharacter.gold += currentLocation.gold
                        gameText.textContent = `${currentLocation.option2Good} You gained ${currentLocation.gold} Gold!`

                    } if(currentLocation.option2GoodRes === "item") {

                        //runItemSwap()
                    }

                } else {

                    if(currentLocation.option2BadRes === "HP") {

                        const healthLoss = Math.floor(Math.random() * 3) + 1
                        playerCharacter.currentHp -= healthLoss

                        gameText.textContent = `${currentLocation.option2Bad} You lost ${healthLoss} Health.`

                        const healthBar = document.getElementById("health-number")
                        healthBar.textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`

                    } else {
                        gameText.textContent = currentLocation.option2Bad
                    }
                }
            } if (input === currentLocation.option3) {

                let skillDC = Math.floor(Math.random() * 11) + 5
                console.log(`skillDC: ${skillDC}`)
                let skillType = currentLocation.option3Test
                let skillCheck = Math.floor(Math.random() * 20) + (playerCharacter[skillType] + 1)
                console.log(`skillCheck: ${skillCheck}`)

                if (skillCheck >= skillDC) {

                    
                    if(currentLocation.option3GoodRes === "key") {

                        playerCharacter.key++
                        gameText.textContent = `${currentLocation.option3Good} You gained A Key!`

                    } else if(currentLocation.option3GoodRes === "gold") {

                        playerCharacter.gold += currentLocation.gold
                        gameText.textContent = `${currentLocation.option3Good} You gained ${currentLocation.gold}`

                    } else if(currentLocation.option3GoodRes === "item") {

                        //runItemSwap()
                    }

                } else {
                    if(currentLocation.option3BadRes === "hp") {
                        console.log('test')

                        const healthLoss = Math.floor(Math.random() * 3) + 1
                        playerCharacter.currentHp -= healthLoss

                        gameText.textContent = `${currentLocation.option3Bad} You lost ${healthLoss} Health.`

                        const healthBar = document.getElementById("health-number")
                        healthBar.textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`

                    } else {
                        gameText.textContent = currentLocation.option3Bad
                    }
                }
            }

        } if (currentLocation.type === "Monsters") {

        } if (currentLocation.type === "puzzle") {

        } if (currentLocation.type === "npc") {

        }
    }
}
//Handles leaving a room and entering the next room
const runRoomChange = (input) => {

}
//Handles prompts to the player in regards to what items they would like to have or not have equipped. (currently not functional)
const runItemSwap = () => {

}
//Handles testing the Input field between possible basic options to lead to the proper function to fire
const runInputBox = (gameDialogueInput, room, gameText, gameScreen, startGameForm) => {
    startGameForm.addEventListener("submit", e => {
        e.preventDefault()
        if (gameDialogueInput.value.toLowerCase() === "leave") {

            runNextRooms(room, gameText)

        } if (gameDialogueInput.value.toLowerCase() === "attack") {

            combatEncounter(gameDialogueInput, room, gameText, gameScreen, startGameForm)

        } if (gameDialogueInput.value.toLowerCase() === "left") {

            runRoomChange(gameDialogueInput.value.toLowerCase())

        } if (gameDialogueInput.value.toLowerCase() === "forward") {

            runRoomChange(gameDialogueInput.value.toLowerCase())

        } if (gameDialogueInput.value.toLowerCase() === "right") {

            runRoomChange(gameDialogueInput.value.toLowerCase())

        } else {

            runCurrentRoom(gameDialogueInput.value.toLowerCase(), room, gameText)
        }
        startGameForm.reset()
    })
}
//This function starts the game from the Replay a Previous Character submission or from Character Generation. 
function startGameFromCharacterSubmission() {
    document.getElementById("initialized-character-generator").remove();

    const gameScreen = document.createElement("div")
    gameScreen.id = "game-screen"
    document.body.appendChild(gameScreen)


    search("http://localhost:3000/Treasure/2").then((data) => {

        currentLocation = data

        const clearSearchBar = document.getElementById("top-bar")
        clearSearchBar.innerHTML = ""

        const room = document.createElement('h2')
        room.className = "Location"
        room.textContent = currentLocation.name

        clearSearchBar.append(room)

        const gameText = document.createElement("p")
        gameText.id = "game-dialogue"
        gameText.className = "game-screen"
        gameText.textContent = `Hello, ${playerCharacter.name}. ${currentLocation.description}`
        gameScreen.appendChild(gameText)

        const startGameForm = document.createElement("form")

        const gameDialogueInput = document.createElement("input")
        gameDialogueInput.className = 'submit-button'
        gameDialogueInput.type = 'text'
        gameDialogueInput.placeholder = 'What do you do?'

        const gameSubmitButton = document.createElement("input")
        gameSubmitButton.className = "submit-button"
        gameSubmitButton.type = "submit"
        gameSubmitButton.value = "Proceed"
        runInputBox(gameDialogueInput, room, gameText, gameScreen, startGameForm)
        startGameForm.append(gameDialogueInput, gameSubmitButton)

        gameScreen.append(startGameForm)
    })
}
//Handles the if/then for most Input boxes
//Handles most fetch requests
async function search(argument) {
    const res = await fetch(argument)
    const results = await res.json();
    return results;
}

initCharMaker()
charSearch()

//"Shift" keydown triggers a overlay displaying key player stats 
document.addEventListener("keydown", function (e) { 
    if (e.key == "Shift") {
        document.getElementById("potions").textContent = `Potions: ${playerCharacter["potions"]}`
        document.getElementById("main-hand").textContent = `Main-hand: ${playerCharacter["main-hand"]}`
        document.getElementById("off-hand").textContent = `Off-hand: ${playerCharacter["off-hand"]}`
        document.getElementById("armor").textContent = `Armor: ${playerCharacter["armor"]}`
        document.getElementById("ranged").textContent = `Ranged: ${playerCharacter["ranged"]}`
        document.getElementById("gold").textContent = `Gold: ${playerCharacter["gold"]}`
        document.getElementById("key").textContent = `Key: ${playerCharacter["key"]}`
        document.getElementById("spell-1").textContent = `Spell 1: ${playerCharacter["spell-1"]}`
        document.getElementById("spell-2").textContent = `Spell 2: ${playerCharacter["spell-2"]}`
        document.getElementById("spell-3").textContent = `Spell 3: ${playerCharacter["spell-3"]}`
        document.getElementById("spell-4").textContent = `Spell 4: ${playerCharacter["spell-4"]}`
        document.getElementById("spell-5").textContent = `Spell 5: ${playerCharacter["spell-5"]}`

        let invOverlay = document.getElementById("inventory")
        
        if (invOverlay.style.display == 'none') {
            invOverlay.style.display = 'block';
        } else {
            invOverlay.style.display = 'none';
        }
    }
})
