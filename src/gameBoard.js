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
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 20px;
        justify-content: center;
        align-items: center;
        padding-right: 50px;
    `

    game.teams.forEach((t) => {
            scores.appendChild(
                createScoreCard(t,() => openTeamHistory(t))
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

        // check if all questions are answered

        if(checkAnswered()) {
            console.log('Final Jeopardy!')
        }
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
            color: white;
            border: 1px solid white;
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
            if(q.id == teamQuestion.id) {
                console.log(q.id + ' - ' + t.id)
                answered = true;
            }
        })
    })

    return answered;
}

function showDailyDoubleFanfare() {

    // play audio
    let audio = new Audio('src/sounds/Ring08.wav');
    audio.play();

    let modal = document.createElement('div');
    modal.style = `
        width: 480px;
        height: 267px;
    `

    let modalContent = document.createElement('iframe');
    modalContent.src = 'https://giphy.com/embed/2yvoIFyZghBDszbIk3'
    modalContent.width = '480'
    modalContent.height = '267'
    console.log(modalContent)
    
    modal.appendChild(modalContent);

    document.getElementById('modalSection').appendChild(
        showJeopardyModal(modal)
    );

}

function showGameQuestion(c,q) {

    let modal = document.createElement('div');

    if(q.dailyDouble) {

        showDailyDoubleFanfare()
        setTimeout(() =>{ 
            closeModal();
            modal = showBettingQuestion(q)

            document.getElementById('modalSection').appendChild(
                showJeopardyModal(modal)
            );
        }
        ,3000)

    } else {

    let modalContent = document.createElement('div');
    modalContent.id = q.id+'jeopardyQuestion'
    modalContent.className = 'jeopardyCardLarge'

    modalContent.innerHTML = q.question;
    modalContent.onclick = () => {
        modalContent.innerHTML = q.answer;
    }
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

function openTeamHistory(team) {

    let modal = document.createElement('div');
    modal.style = `
        width: 100%;
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(3,200px);
        margin-top: 20px;
        margin-bottom: 20px;
        gap: 20px;
        color: yellow;
        
        text-align: center;
    `

    // add team question history
    team.questions.forEach((q) => {
        let b = document.createElement('div')
        b.style = `
            border-radius: 5px;
            display: flex;
            background-color: blue;
            padding: 10px;
        `;

        // add name
        let name = document.createElement('div');
        name.style = `
            flex-grow: 1;
        `
        name.innerHTML = q.question + ' | ' + q.value;
        b.appendChild(name);

        // add close
        let close = document.createElement('span');
        close.style = `
            font-size: 20px;
            
        `;
        close.innerHTML = '&times;';
        close.onclick = () => removeTeamQuestion(team,q);
        b.appendChild(close);

        modal.appendChild(b);
    })
    

    document.getElementById('modalSection').appendChild(
        showModal(modal)
    );

}

function removeTeamQuestion(team,question) {

    let game = getGame();

    game.teams.forEach((t) => {
        if(t.id == team.id) {
            t.questions.forEach((q,i) => {
                if(q.id == question.id) {
                    t.questions.splice(i,1);
                }
            })
        }
    })

    writeGame(game);
    showPage(gameBoard);
    closeModal()
}

function showBettingQuestion(q) {

    let modal = document.createElement('div');

    let modalContent = document.createElement('div');
    modalContent.id = q.id+'jeopardyQuestion'
    modalContent.className = 'jeopardyCardLarge'

    modalContent.innerHTML = q.question;
    modalContent.onclick = () => {
        modalContent.innerHTML = q.answer;
    }
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
    
    

    // add team betting forms
    let game = getGame();

    game.teams.forEach((t) => {

        if(t.id != 'wrong') {
            let bettingForm = document.createElement('div');
            bettingForm.style = `
                width: 100%;
            `

            bettingForm.appendChild(
                createTextInput(t.id+'bettingForm',t.name + ' Bet','',(e) => updateCurrentTeamBet(t.id,e.target.value))
            )

            let buttonsDiv = document.createElement('div');
            buttonsDiv.style = `
                margin-top: 10px;
                display: grid;
                grid-template-rows: 1fr 1fr;
                gap: 10px;
            `;

            buttonsDiv.appendChild(
                correctButton = createButton(t.id+'bettingFormCorrect','Correct',() => applyCurrentBet(t.id,q,true))
            )

            buttonsDiv.appendChild(
                createButton(t.id+'bettingFormIncorrect','Incorrect',() => applyCurrentBet(t.id,q,false))
            )
            bettingForm.appendChild(buttonsDiv)


            footer.appendChild(bettingForm)
        }

    })

    
    modal.appendChild(footer);

    let doneButtonDiv = document.createElement('div');
    doneButtonDiv.style = `
        width: 99.4%;
        background-color: #FEFEFE;
    `
    doneButtonDiv.appendChild(
        createButton('closeDailyDoubleButton','Done',() => closeModal())
    )

    modal.appendChild(
        doneButtonDiv
    )

    return modal;

}

function updateCurrentTeamBet(teamId,currentBet) {

    let game = getGame();

    game.teams.forEach((t) => {
        if(t.id == teamId) {
            t.currentBet = currentBet
        }
    })

    writeGame(game);
}

function applyCurrentBet(teamId,question,correct) {

    let game = getGame();

    game.teams.forEach((t) => {
        if(t.id == teamId) {
            
            if(correct) {
                question.value = Number(t.currentBet);
            } else {
                question.value = -Number(t.currentBet)
            }

            t.questions.push(question);
            
        }
    })

    writeGame(game)
    showPage(gameBoard)
    alert('Score applied!')
}

function showFinalJeopardy() {
    
    let game = getGame();

    let modal = showBettingQuestion({
        id: 'finalJeopardy',
        question: game.finalJeopardyQuestion
    })

    document.getElementById('modalSection').appendChild(
        showJeopardyModal(modal)
    );

}


function checkAnswered() {

    let game = getGame();

    let totalQuestions = 0;
    game.game.categories.forEach((c) => {
        totalQuestions += c.questions.length;
    })
    
    let teamQuestions = 0
    game.teams.forEach((t) => {
        teamQuestions += t.questions.length;
    })

    // if question lengths are the same then final Jeopardy
    if(teamQuestions == totalQuestions) {
        showFinalJeopardy()
    }
    

}