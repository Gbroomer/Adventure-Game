
//Global variables that are used in several functions
let fetchPlayer, playerCharacter, currentLocation, locationLeft = {}, locationRight = {}, locationForward = {}
let leaveSwitch = false
let lookSwitch = false
let left = []
let right = []
let forward = []
let items = []

//Handles the searchbar functionality
const charSearch = () => {
    const charSearchForm = document.getElementById("character-search")
    charSearchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log('test')
        const charSearchInput = document.getElementById("char-search").value
        console.log(charSearchInput)

        fetchChar(charSearchInput.toLowerCase()).then(() => {
            console.log(fetchPlayer)
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
//Handles Treasure Rooms
const treasureRoom = (inputOption, gameText) => {

    let skillDC = Math.floor(Math.random() * 11) + 5
    console.log(`skillDC: ${skillDC}`)

    let skillType = currentLocation[`option${inputOption}Test`]
    let skillCheck = Math.floor(Math.random() * 20) + (playerCharacter[skillType] + 1)
    console.log(`skillCheck: ${skillCheck}`)

    if (skillCheck >= skillDC) {
        console.log(typeof currentLocation[`option${inputOption}GoodRes`])

        if (currentLocation[`option${inputOption}GoodRes`] === "key") {

            playerCharacter.key++
            gameText.textContent = `${currentLocation[`option${inputOption}Good`]} You gained A Key!`

        } else if (currentLocation[`option${inputOption}GoodRes`] === "gold") {

            playerCharacter.gold += currentLocation.gold
            gameText.textContent = `${currentLocation[`option${inputOption}Good`]} You gained ${currentLocation.gold} gold!`

        } else if (currentLocation[`option${inputOption}GoodRes`] === "item") {

            //runItemSwap() 
        } else {
            gameText.textContent = `${currentLocation[`option${inputOption}Good`]}`
            console.log('missfired')
        }

    } else {

        if (currentLocation[`option${inputOption}BadRes`] === "HP") {

            const healthLoss = Math.floor(Math.random() * 3) + 1
            playerCharacter.currentHp -= healthLoss

            gameText.textContent = `${currentLocation[`option${inputOption}Bad`]} You lost ${healthLoss} Health.`

            const healthBar = document.getElementById("health-number")
            healthBar.textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`

        } else {
            gameText.textContent = currentLocation[`option${inputOption}Bad`]
        }
    }
    leaveSwitch = true;
}
//Pushes the available Event Types into the left, right and forward arrays to be called on later
async function generateAvailableRooms() {

    const monstersRes = await fetch('http://localhost:3000/Monsters')
    monsters = await monstersRes.json()

    const npcRes = await fetch(`http://localhost:3000/NPC`)
    npc = await npcRes.json()

    const puzzleRes = await fetch('http://localhost:3000/Puzzle')
    puzzle = await puzzleRes.json()

    const treasureRes = await fetch('http://localhost:3000/Treasure')
    treasure = await treasureRes.json()

    const itemRes = await fetch('http://localhost:3000/Items')
    itemCount = await itemRes.json()


    monsters.forEach(e => {
        console.log(e)
        let RNG = Math.floor(Math.random() * 3) + 1
        if (RNG === 1) {
            left.push(e)
        } if (RNG === 2) {
            right.push(e)
        } if (RNG === 3) {
            forward.push(e)
        }
    })
    npc.forEach(e => {
        console.log(e)
        let RNG = Math.floor(Math.random() * 3) + 1
        if (RNG === 1) {
            left.push(e)
        } if (RNG === 2) {
            right.push(e)
        } if (RNG === 3) {
            forward.push(e)
        }
    })
    puzzle.forEach(e => {
        console.log(e)
        let RNG = Math.floor(Math.random() * 3) + 1
        if (RNG === 1) {
            left.push(e)
        } if (RNG === 2) {
            right.push(e)
        } if (RNG === 3) {
            forward.push(e)
        }
    })
    treasure.forEach(e => {
        console.log(e)
        let RNG = Math.floor(Math.random() * 3) + 1
        if (RNG === 1) {
            left.push(e)
        } if (RNG === 2) {
            right.push(e)
        } if (RNG === 3) {
            forward.push(e)
        }
    })

    itemCount.forEach(e => {
        items.push(e)
    })
    console.log(left, forward, right, items)

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

    const gameMusic = document.getElementById("dungeon-music")
    gameMusic.volume = 0.5
    gameMusic.play()
    
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
const runNextRooms = (gameText) => {

    locationLeft = undefined
    locationRight = undefined
    locationForward = undefined

    let locationLeftText, locationRightText, locationForwardText
    locationLeftText = "", locationRightText = "", locationForwardText = ""

    let leftRNG = Math.floor(Math.random() * left.length)
    let rightRNG = Math.floor(Math.random() * right.length)
    let forwardRNG = Math.floor(Math.random() * forward.length)
    // console.log(leftRNG, rightRNG, forwardRNG)

    locationLeft = left[leftRNG]
    console.log(locationLeft)
    if (locationLeft === undefined) {
        locationLeftText = ""
    } else if (left === []) {
        locationLeftText = ""
    } else {
        locationLeftText = `There is a room to your Left. ${locationLeft.prelude}`
        left.splice(leftRNG, 1)
    }

    locationRight = right[rightRNG]
    if (locationRight === undefined) {
        locationRightText = ""
    } else if (right === []) {
        locationRightText = ""
    } else {
        locationRightText = `There is a room to your Right. ${locationRight.prelude}`
        right.splice(rightRNG, 1)
    }


    locationForward = forward[forwardRNG]
    if (locationForward === undefined) {
        locationForwardText = ""
    } else if (forward === []) {
        locationForwardText = ""
    } else {
        locationForwardText = `There is a room in Front of you. ${locationForward.prelude}`
        forward.splice(forwardRNG, 1)
    }

    // console.log(left, right, forward)
    // console.log(locationLeftText, locationRightText, locationForwardText)

    lookSwitch = true;

    gameText.textContent = `${locationLeftText} ${locationRightText} ${locationForwardText} `

}
//Runs the Combat Scenario (currently not functional)
const runCombat = (input, gameText) => {
    const mainHand = playerCharacter[`main-hand`]
    const offHand = playerCharacter[`off-hand`]
    const spellOne = playerCharacter[`spell-1`]
    const spellTwo = playerCharacter[`spell-2`]
    const spellThree = playerCharacter[`spell-3`]
    const spellFour = playerCharacter[`spell-4`]
    const spellFive = playerCharacter[`spell-5`]
    let statType, dice
    if (input === "leave") {
        let skillDC = Math.floor(Math.random() * 11) + 5
        console.log(`skillDC: ${skillDC}`)
        let skillCheck = Math.floor(Math.random() * 20) + (playerCharacter[`dex-mod`] + 1)
        console.log(`skillCheck: ${skillCheck}`)
        let damageType
        if (skillCheck > skillDC) {

            runInputBox(input, gameText, room, gameScreen, startGameForm)
            runNextRooms(gameText)

        } else {

            if (currentLocation[`dex-mod`] > currentLocation[`str-mod`]) {
                damageType = currentLocation[`dex-mod`]
            } else {
                damageType = currentLocation[`str-mod`]
            }

            let attackDC = playerCharacter.AC
            console.log(`skillDC: ${attackDC}`)
            let attackRoll = Math.floor(Math.random() * 20) + (damageType + 1)
            console.log(`skillCheck: ${attackRoll}`)

            if (attackRoll > attackDC) {
                let damage = Math.floor(Math.random() * 5) + damageType
                playerCharacter.currentHp -= damage
                gameText.textContent = `You failed to get away! ${currentLocation.attack} You take ${damage} damage! ${currentLocation.combat}`
                document.getElementById("health-number").textContent = `${playerCharacter.currentHp}/${playerCharacter.totalHp}`
                if (playerCharacter.currentHp <= 0) {
                    gameOver()
                }
            }
        }
    } if (input === mainHand) {

    } if (input === offHand) {

    } if (input === spellOne) {}
}
//Grabs information about the current Room and checks to make sure that the Input is relevant to the current Room, then runs the correct room function
const runCurrentRoom = (input, room, gameText) => {

    room.textContent = currentLocation.name

    if (leaveSwitch === false) {
        if (currentLocation.type === "treasure") {
            let inputOption
            if (input === currentLocation.option1) {
                inputOption = "1"
                if (currentLocation.option1 === "key") {
                    if (playerCharacter.key > 0) {
                        playerCharacter.key--
                        treasureRoom(inputOption, gameText)
                    } else {
                        alert('You do not have a key')
                    }
                } else {
                    treasureRoom(inputOption, gameText)
                }

            } if (input === currentLocation.option2) {
                inputOption = "2"
                if (currentLocation.option2 === "key") {
                    if (playerCharacter.key > 0) {
                        playerCharacter.key--
                        treasureRoom(inputOption, gameText)
                    } else {
                        alert('You do not have a key')
                    }
                } else {
                    treasureRoom(inputOption, gameText)
                }
            } if (input === currentLocation.option3) {
                inputOption = "3"
                if (currentLocation.option3 === "key") {
                    if (playerCharacter.key > 0) {
                        playerCharacter.key--
                        treasureRoom(inputOption, gameText)
                    } else {
                        alert('You do not have a key')
                    }
                } else {
                    treasureRoom(inputOption, gameText)
                }
            }
        } if (currentLocation.type === "monster") {
            runCombat(input, gameText)
        }
        if (currentLocation.type === "puzzle") {

        } if (currentLocation.type === "npc") {

        }
    }


}
//Handles leaving a room and entering the next room
const runRoomChange = (input, room, gameText) => {
    lookSwitch = false;
    if (input === "left") {
        currentLocation = locationLeft
        room.textContent = currentLocation.name
        gameText.textContent = `You leave the room you're in and head left. ${currentLocation.description}`
        runCurrentRoom(input, room, gameText)

    } if (input === "right") {
        currentLocation = locationRight
        room.textContent = currentLocation.name
        gameText.textContent = `You leave the room you're in and head right. ${currentLocation.description}`
        runCurrentRoom(input, room, gameText)

    } if (input === "forward") {
        currentLocation = locationForward
        room.textContent = currentLocation.name
        gameText.textContent = `You leave the room you're in and head forward. ${currentLocation.description}`
        runCurrentRoom(input, room, gameText)
    }
}
//Handles prompts to the player in regards to what items they would like to have or not have equipped. (currently not functional)
const runItemSwap = (gameText) => {

}
//Handles testing the Input field between possible basic options to lead to the proper function to fire
const runInputBox = (gameDialogueInput, room, gameText, gameScreen, startGameForm) => {
    startGameForm.addEventListener("submit", e => {
        e.preventDefault()
        if (leaveSwitch === true) {
            if (gameDialogueInput.value.toLowerCase() !== "leave") {
                alert('You have exhausted this room, its time to move on.')
            } else {
                leaveSwitch = false;
                runNextRooms(gameText)
            }
        } else {

            if (gameDialogueInput.value.toLowerCase() === "leave") {

                if (currentLocation.type === 'monster') {
                    runCombat(gameDialogueInput.value.toLowerCase(), gameText) 
                }else {
                    runNextRooms(gameText)
                }

            } if (lookSwitch === true) {

                if (gameDialogueInput.value.toLowerCase() === "left") {

                    runRoomChange(gameDialogueInput.value.toLowerCase(), room, gameText)

                } if (gameDialogueInput.value.toLowerCase() === "forward") {

                    runRoomChange(gameDialogueInput.value.toLowerCase(), room, gameText)

                } if (gameDialogueInput.value.toLowerCase() === "right") {

                    runRoomChange(gameDialogueInput.value.toLowerCase(), room, gameText)
                }

            }
            else {

                runCurrentRoom(gameDialogueInput.value.toLowerCase(), room, gameText)
            }
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


    search("http://localhost:3000/Monsters/1").then((data) => {

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
        startGameForm.id = "input-form"

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
//Currently nothing crazy, just a Game Over notice
function gameOver(gameText) {
    gameText.textContent = `GAME OVER! You have died.`
    document.getElementById('input-form').removeEventListener()
}
function characterInventory() {
    document.addEventListener("keyup", function (e) {
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
}
characterInventory()
initCharMaker()
charSearch()
generateAvailableRooms()
// "i" keydown event to display inventory of main hand, off hand, armor, spells, etc.

//"Shift" keydown triggers a overlay displaying key player stats 
