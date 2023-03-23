
function gameBoard() {

    let game = getGame();

    let gb = document.createElement('div');
    gb.style = ``

    // Menu Row
    let menuRow = document.createElement('div');
    menuRow.style = `
        width: 100%;
        display: flex;
        color: yellow;
        text-align: center;
        padding: 5px;
        gap: 20px;
    `
    // menu buttons
    let menuButtons = document.createElement('div');
    menuButtons.style = `
        display: grid;
        grid-template-columns: repeat(4,100px);
        color: yellow;
        gap: 10px;

    `
    
    // New Game
    menuButtons.appendChild(
        createButton('newGame','New Game',() => {
            if(confirm('Are you sure?')) {
                newGame()
            }
        })
    )

    menuButtons.appendChild(
        createButton('saveGame','Save Game',() => saveGame())
    )

    menuButtons.appendChild(
        createButton('addTeam','Team Manager',() => manageTeams())
    )

    menuButtons.appendChild(
        createButton('questionButton','Question Manager',() => manageQuestions())
    )

    menuRow.appendChild(menuButtons)

    // scores
    let scores = document.createElement('div');
    scores.style = `
        flex-grow: 1;
        display: grid;
        grid-template-columns: repeat(` + game.teams.length + `,400px);
        gap: 20px;
        justify-content: right;
        padding-right: 50px;
    `

    game.teams.forEach((t) => {
        scores.appendChild(
            createScoreCard(t)
        )
    })

    menuRow.appendChild(scores)
    

    gb.appendChild(menuRow);


    // Cards
    let bodyRow = document.createElement('div');
    bodyRow.style = `
        flex-grow: 1;
        display: grid;
        border: 1px solid red;
        color: yellow;
        text-align: center;
    `;
    bodyRow.innerHTML = 'cards'
    gb.appendChild(bodyRow);


    return gb;
}

function newGame() {
    // clear local storage
    localStorage.clear();

    showPage(loadFilePage);
}

function saveGame() {
    saveFile();
}

function manageTeams() {

    updateModal(teamManager)
    
}

function manageQuestions() {
    updateModal(questionManager);
}