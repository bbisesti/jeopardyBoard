
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
        grid-template-columns: repeat(5,100px);
        color: yellow;
        gap: 10px;

    `
    
    menuButtons.appendChild(
        createButton('loadFile','Load File',() => loadFile())
    )

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

    if(game.game) {
        bodyRow.appendChild(showBoard())
    }

    gb.appendChild(bodyRow);


    return gb;
}

function newGame() {
    // Generate New Game
    createGame();
    showPage(gameBoard)
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
        title.style = `
            text-decoration: underline;
        `
        categoryDiv.appendChild(title);

        // add questions
        c.questions.forEach((q) => {

            if(!questionAnswered(q)) {
                let question = document.createElement('div');
                question.className = 'jeopardyCard'
                question.innerHTML = q.value
                question.onclick = () => showGameQuestion(c,q);
                categoryDiv.appendChild(question)
            } else {
                let question = document.createElement('div');
                question.className = 'jeopardyCard'
                question.innerHTML = 'X'
                categoryDiv.appendChild(question)
            }
            

        })

        gameBoard.appendChild(categoryDiv);
    })

    return gameBoard;

}

function questionAnswered(q) {

    let game = getGame();

    let answered = false;

    game.teams.forEach((t) => {
        t.questions.forEach((teamQuestion) => {
            if(q.question == teamQuestion.question) {
                answered = true;
            }
        })
    })

    return answered;
}

function showGameQuestion(c,q) {
    

    let modal = document.createElement('div');

    let modalContent = document.createElement('div');
    modalContent.id = q.id+'jeopardyQuestion'
    modalContent.className = 'jeopardyCardLarge'

    modalContent.innerHTML = q.question;
    modal.appendChild(modalContent)

    // add footer
    let footer = document.createElement('div');
    footer.style = `
        width: 98.3%;
        display: inline-flex;
        gap: 10px;
        justify-content: center;
        padding: 5px;
        background-color: white;
        color: black;
        border-radius-bottom-right: 5px;
        border-radius-botom-left: 5px;
    `

    let game = getGame();

    game.teams.forEach((t) => {

        let teamButton = document.createElement('div')
        teamButton.style = `
            display: flex;
            flex-grow: 1;
            padding: 10px;
            align-self: center;
            align-content: center;
            justify-content: center;
            color: white;
            background-color: ` + t.color +`;
        `
        teamButton.innerHTML = t.name;
        teamButton.onclick = () => updateTeamScore(t,c,q);

        footer.appendChild(teamButton)

    })
    
    modal.appendChild(footer);
    



    document.getElementById('modalSection').appendChild(
        showJeopardyModal(modal)
    );

    
}

function updateTeamScore(team,category,question) {


    let game = getGame();

    // update team questions
    game.teams.forEach((t) => {
        if(t.id == team.id) {
            t.questions.push(question);
        }
    })

    writeGame(game);
    showPage(gameBoard);
    closeModal();

}