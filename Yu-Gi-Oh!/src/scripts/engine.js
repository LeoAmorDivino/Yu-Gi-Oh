const state = {
    score:{
        playerScore: 0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    button: document.getElementById("next-duel")
}
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

function main(){
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
};

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf: [1]
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}


async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement('img')
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", IdCard)
    cardImage.classList.add("card")

    if(fieldSide === playerSides.player1){
        
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectedCard(IdCard)
        })
        
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        })  
        
    }
    return cardImage;
}


async function setCardsField(cardId){
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

        hiddenCardsDetails()
    
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

   let duelResults = await CheckDuelResults(cardId, computerCardId)

    updateScore()
    drawButton(duelResults)
    
}

async function hiddenCardsDetails(){
    state.cardsSprites.avatar.src = ""
    state.cardsSprites.name.innerText = ""
    state.cardsSprites.type.innerText = ""

}

async function CheckDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate"
    let playerCard = cardData[playerCardId]
    
    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou"
        state.score.playerScore++
        await playAudio(duelResults)
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu"
        state.score.computerScore++  
        await playAudio(duelResults) 
     }

     return duelResults
}

async function drawButton(text){
    state.button.innerText = text.toUpperCase()
    state.button.style.display = "block"
}

async function drawSelectedCard(index){

    state.cardsSprites.avatar.src = cardData[index].img
    state.cardsSprites.name.innerText = cardData[index].name
    state.cardsSprites.type.innerText = "Atribute : " + cardData[index].type
    
}

async function drawCards(cardsNumbers, fieldSide){

    for (let i = 0; i < cardsNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose ${state.score.computerScore}`
}


async function removeAllCardsImages(){
    let cards = document.querySelector(".card-box.framed#computer-cards")
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    
    cards = document.querySelector(".card-box.framed#player-cards")
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function resetDuel(){
    state.cardsSprites.avatar.src = ""
    state.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    main()
}

async function playAudio(status){

     const audio = new Audio(`./src/assets/audios/${status}.wav`)
     audio.play();
}


main()