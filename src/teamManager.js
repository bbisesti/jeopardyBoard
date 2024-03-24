function teamManager() {

    let teamManager = document.createElement('div');
    teamManager.style = `
        width: 800px;
        height: 90vh;
        padding: 20px;
        overflow-y: auto;
    `

    // show teams
    teamManager.appendChild(
        createHeader2('Current Teams')
    )
    teamManager.appendChild(
        createHr('98%')
    )

    let teamsBlock = document.createElement('div');
    teamsBlock.style = `
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3,200px);
        margin-top: 20px;
        margin-bottom: 20px;
        gap: 20px;
    `;


    let game = getGame();
    console.log(game)

    game.teams.forEach((t) => {

        let b = document.createElement('div')
        b.style = `
            border-radius: 5px;
            display: flex;
            background-color: ` + t.color + `;
            padding: 10px;
        `;

        // add name
        let name = document.createElement('div');
        name.style = `
            flex-grow: 1;
        `
        name.innerHTML = t.name;
        b.appendChild(name);

        // add close
        let close = document.createElement('span');
        close.style = `
            font-size: 20px;
            
        `;
        close.innerHTML = '&times;';
        close.onclick = () => removeTeam(t);
        b.appendChild(close);

        teamsBlock.appendChild(b)
    })
    teamManager.appendChild(teamsBlock);
    
    // add Team form

    teamManager.append(
        createHeader2('Add Team')
    )
    teamManager.appendChild(
        createHr('98%')
    )


    teamManager.appendChild(
        teamForm()
    )

    return teamManager;
}

function addTeam(name,color) {

    let game = getGame();

    game.teams.push({
        id: uuidv4(),
        name: name,
        color: color,
        questions: []
    })

    writeGame(game);
    showPage(gameBoard);
    updateModal(teamManager);

}

function editTeam(id,name,color) {

    let game = getGame();

    game.teams.forEach((t) => {
        if(t.id == id) {
            t.name = name;
            t.color = color;
        }
    })

    writeGame(game);
    showPage(gameBoard);
    updateModal(teamManager);

}

function removeTeam(team) {

    let game = getGame();

    game.teams.forEach((t,i) => {
        if(t.id == team.id) {
            game.teams.splice(i,1);
        }
    })

    
    writeGame(game);
    showPage(gameBoard);
    updateModal(teamManager);

}

function teamForm(team=null) {

    let teamName = '';
    let teamColor = '';

    if(team) {
        teamName = team.name;
        teamColor = team.color;
    }

    let teamForm = document.createElement('div');
    teamForm.style = `
        width: 50%;
    `

    teamForm.appendChild(
        createTextInput('EditTeamName','Name',teamName,(e) => teamName = e.target.value)
    )

    teamForm.appendChild(
        createTextInput('EditTeamColor','Color',teamColor,(e) => teamColor = e.target.value)
    )

    teamForm.appendChild(
        document.createElement('br')
    )

    

    if(team) {
        teamForm.appendChild(
            createButton('teamUpdate','Update',() => editTeam(team.id,teamName,teamColor))
        )
    } else {
        teamForm.appendChild(
            createButton('teamAddNew','Save',() => addTeam(teamName,teamColor))
        )
    }

    return teamForm;


}