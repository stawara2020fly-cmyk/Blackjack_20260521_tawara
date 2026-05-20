const suits = ["♥", "♦", "♠", "♣"];
const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function createDeck() {
    let deck = [];
    for(let suit of suits){
        for(let rank of ranks){
            let value;
            if (rank === "J" || rank === "Q" || rank === "K"){
            value = 10;
        } else if (rank === "A"){
            value =11;
        } else {
            value = Number(rank);
        }
        deck.push({ suit: suit, rank: rank, value: value});
        }
    }
    return deck;
}
    console.log(createDeck())

function shuffle(deck){
    for (let i =deck.length - 1; i>0; i--){
        let j = Math.floor(Math.random() * (i +1));
        let temp = deck[i];
        deck[i] =deck[j];
        deck[j] =temp;
    }
    return deck;
}
    console.log(shuffle(createDeck()))

function calcScore(hand) {
    let score = 0;
    let aceCount = 0;

    for (let card of hand) {
        score += card.value;
        if (card.rank === "A") aceCount++;
    }
        while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

function dealCard(deck, hand) {
    hand.push(deck.pop());
}

function cpuTurn(deck, cpuHand) {
    while (calcScore(cpuHand) < 17) {
        dealCard(deck, cpuHand);
    }
}

function judgeWinner(playerHand, cpuHand) {
    let playerScore = calcScore(playerHand);
    let cpuScore = calcScore(cpuHand);

    if (playerScore>21) {
        return "負け";
    } else if (cpuScore>21) {
        return "勝ち";
    } else if (playerScore>cpuScore) {
        return "勝ち";
    } else if (playerScore<cpuScore) {
        return "負け";
    } else {
        return "引き分け";
    }
}

let deck, playerHand, cpuHand;

const playerCardsEl = document.getElementById("player-cards");
const cpuCardsEl    = document.getElementById("cpu-cards");
const playerScoreEl = document.getElementById("player-score");
const cpuScoreEl    = document.getElementById("cpu-score");
const messageEl     = document.getElementById("message");
const hitBtn        = document.getElementById("hit-btn");
const standBtn      = document.getElementById("stand-btn");
const resetBtn      = document.getElementById("reset-btn");

function startGame() {
    deck = shuffle(createDeck());
    playerHand = [];
    cpuHand = [];

    // 2枚ずつ配る
    dealCard(deck, playerHand);
    dealCard(deck, cpuHand);
    dealCard(deck, playerHand);
    dealCard(deck, cpuHand);

    // 画面更新
    renderHands();
    messageEl.textContent = "";
}

function createCardEl(card, faceDown = false) {
    const div = document.createElement("div");
    div.classList.add("card");
    if (faceDown) {
        div.classList.add("facedown");
        div.textContent = "🂠";
    } else {
        const isRed = card.suit === "♥" || card.suit === "♦";
        if (isRed) div.classList.add("red");
        div.innerHTML = `
            <span class="corner top">${card.rank}<br>${card.suit}</span>
            <span class="center">${card.suit}</span>
            <span class="corner bottom">${card.rank}<br>${card.suit}</span>
        `;
    }
    return div;
}

function renderHands() {
    playerCardsEl.innerHTML = "";
    cpuCardsEl.innerHTML = "";

    playerHand.forEach(card => {
        playerCardsEl.appendChild(createCardEl(card));
    });

    // CPUの最初の1枚は裏向き
    cpuHand.forEach((card, i) => {
        cpuCardsEl.appendChild(createCardEl(card, i === 0));
    });

    playerScoreEl.textContent = calcScore(playerHand);
    cpuScoreEl.textContent = "?";
}

hitBtn.addEventListener("click", function() {
    dealCard(deck, playerHand);
    renderHands();
    if (calcScore(playerHand) > 21) {
        messageEl.textContent = "バスト！負けです";
        hitBtn.disabled = true;
        standBtn.disabled = true;
    }
});

standBtn.addEventListener("click", function() {
    cpuTurn(deck, cpuHand);
    // スタンド後はCPUの全カードを表向きに
    cpuCardsEl.innerHTML = "";
    cpuHand.forEach(card => {
        cpuCardsEl.appendChild(createCardEl(card));
    });
    cpuScoreEl.textContent = calcScore(cpuHand);
    messageEl.textContent = judgeWinner(playerHand, cpuHand);
    hitBtn.disabled = true;
    standBtn.disabled = true;
});

resetBtn.addEventListener("click", function() {
    hitBtn.disabled = false;
    standBtn.disabled = false;
    startGame();
});

// ゲーム開始
startGame();

