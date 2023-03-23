
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
        width: 100%;
        height: 90%;
        display: flex;
    `;

    bodyRow.appendChild(showBoard())

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

function showBoard() {

    let game = getGame();

    let gameBoard = document.createElement('div');
    gameBoard.style = `
        display: flex;
        flex-grow: 1;
        width: 100%;
        flex-direction: row;
        gap: 10px;
        margin: 20px 10px 0px 10px;
    `;


    // show titles
    game.game.categories.forEach((c) => {
        
        let categoryDiv = document.createElement('div');
        categoryDiv.style = `
            width: 100%;
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
            align-content: center;
        `

        // title
        let title = document.createElement('div');
        title.className = 'jeopardyCard'
        title.innerHTML = c.name
        categoryDiv.appendChild(title);

        // add questions
        c.questions.forEach((q) => {

            let question = document.createElement('div');
            question.className = 'jeopardyCard'
            question.innerHTML = q.value
            categoryDiv.appendChild(question)

        })

        gameBoard.appendChild(categoryDiv);
    })

    return gameBoard;

}