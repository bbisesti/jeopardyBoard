

function loadGame() {

    let game = getGame();

    if(game) {
        
        // load game
        if(game.game) {
            showPage(gameBoard)
        } else {
            showPage(gameBoard);
        }
    } else {
        showPage(loadFilePage);
    }
}

function createGame() {

    // get game
    let game = getGame();

    let newGame = {
        categories: []
    }

    game.categories.forEach((c) => {
        newGame.categories.push({
            id: c.id,
            name: c.name,
            questions: []
        })
    })

    // add random question worth correct amount of points to game
    newGame.categories.forEach((c) => {
        let gameCategory = game.categories.filter((gc) => gc.id == c.id)[0]

        c.questions.push(getQuestion(gameCategory.questions,10))
        c.questions.push(getQuestion(gameCategory.questions,20))
        c.questions.push(getQuestion(gameCategory.questions,30))
        c.questions.push(getQuestion(gameCategory.questions,40))
        c.questions.push(getQuestion(gameCategory.questions,50))

        c.questions.sort((a,b) => a.value - b.value)
    })

    
    game.game = newGame;
    writeGame(game);


}

function getQuestion(allQuestions,pointValue) {
    console.log('here!')
    let pertinentQuestions = allQuestions.filter((q) => q.value == pointValue)
    let index = Math.round(Math.random() * (pertinentQuestions.length - 1) + 0)
    let question = pertinentQuestions[index]
    question.answered = false;
    return question
}

/**
 * 
 * 
 * For opening and saving JSON file
 * 
 * 
 */

async function loadFile() {

    try {

        let [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'JSON',
                    accept: {
                        'image/*': ['.json']
                    }
                },
                
            ],
            excludeAcceptAllOption: true,
            multiple: false
        });
    
        let data = await fileHandle.getFile();
    
        let text = await data.text();

        localStorage.setItem('game',text);

        showPage(gameBoard);
        

    }catch(e) {

        console.error('Error on opening file: ' + e);
        return e;
    }

    
}

async function saveFile() {

    let fileHandle = await window.showSaveFilePicker(
        {
            types: [
                {
                    description: 'JSON file',
                    accept: {'image/*': ['.json']},
                }
            ],
          });

    let stream = await fileHandle.createWritable();

    await stream.write(localStorage.getItem('game'));
    await stream.close();

    alert('file saved!')
}

function showPage(page) {
    // empty all the elements
    document.getElementById('game').replaceChildren([]);

    // load page given
    document.getElementById('game').appendChild(page());
}

function closeModal() {
    document.getElementById('modalSection').replaceChildren([])
}

function updateModal(modal) {
    // empty all the elements
    document.getElementById('modalSection').replaceChildren([]);

    // load page given
    document.getElementById('modalSection').appendChild(
        showModal(modal())
    );
}


function getGame() {
    return JSON.parse(localStorage.getItem('game'));
}

function writeGame(game) {
    localStorage.setItem('game',JSON.stringify(game));
}

/**
 * For Generating Guid
 * @returns GUID
 */
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }


/**
 * Common HTML Elements
 */
function createButton(id,label,onClick) {

    let button = document.createElement('div');
    button.id = id;
    button.style = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        background-color: #060ce9;
        color: yellow;
        `;

    button.innerHTML = label;
    button.onclick = onClick;

    return button;
}

function createScoreCard(team,onClick) {

    let card = document.createElement('div');
    card.id = team.name + 'scoreCard'
    card.style = `
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    background-color: ` + team.color +`;
    color: white;
    
    `;
    card.onclick = onclick;
    
    let name = document.createElement('div');
    name.style = `
        width: 100%;
    `
    name.innerHTML = team.name + '<br />'

    let teamScore = 0;
    team.questions.forEach((q) => {
        teamScore += q.value;
    });

    let score = document.createElement('span');
    score.style = `
    `;
    score.innerHTML = teamScore;
    card.appendChild(name);
    card.appendChild(score);
    

    return card;
}


function showModal(content){

    // Add body
    let modal = document.createElement('div');
    modal.style = `
        display: inline-flex;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgb(0,0,0,0.4);
    `

    // Add Content
    let modalContent = document.createElement('div');
    modalContent.style = `
        position: relative;
        display: inline-flex;
        justify-content: center;
        margin: auto;
        background-color: #FEFEFE;
        padding: 0;
        animation-name: animatetop;
        animation-duration: 0.4s
    `
    modalContent.appendChild(content);

    let closeButton = document.createElement('div');
    closeButton.style = `
        font-size: 40px;
        font-weight: bold;
        margin-top: 20px;
        margin-right: 20px;
    `
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => closeModal();
    modalContent.appendChild(closeButton);

    modal.appendChild(modalContent);

    return modal;

    

}

function showJeopardyModal(content){

    // Add body
    let modal = document.createElement('div');
    modal.style = `
        display: inline-flex;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgb(0,0,0,0.4);
    `

    // Add Content
    let modalContent = document.createElement('div');
    modalContent.style = `
        position: relative;
        display: inline-flex;
        justify-content: center;
        margin: auto;
        padding: 0;
        animation-name: animatetop;
        animation-duration: 0.4s
    `
    modalContent.appendChild(content);

    let closeButton = document.createElement('div');
    closeButton.style = `
        font-size: 40px;
        font-weight: bold;
        color: white;
    `
    closeButton.onclick = () => closeModal();
    let closeIcon = document.createElement('span');
    closeIcon.style = `
        background-color: #060ce9;
    `
    closeIcon.innerHTML = '&times;'
    closeButton.appendChild(closeIcon);
    modalContent.appendChild(closeButton);

    modal.appendChild(modalContent);


    return modal;

    

}

function createCard(id,title,body,width,height,closeID=null) {

    // Create Card
    let card = document.createElement('div');
    card.id = id;
    card.classList= ['shadow'];
    card.style = `
        width: ` + width + `;
        height: ` + height + `;
        overflow-y: auto;
        padding: 5px;
        padding-bottom: 20px;
    `;

    // add title
    let cardHeader = document.createElement('div');
    cardHeader.style = `
        padding: 10px;
        display: flex;
    `

    let cardTitle = document.createElement('span')
    cardTitle.style = `
        flex-grow: 1;
        font-size: 20px;
        font-weight: bold;
    `
    cardTitle.innerHTML = title;
    cardHeader.appendChild(cardTitle);

    if(closeID) {
        let cardClose = document.createElement('span');
        cardClose.style = `
            font-size: 20px;
            font-weight: bold;
        `
        cardClose.onClick = () => {
            document.getElementById(closeID).style.display = 'none';
        }
        cardClose.innerHTML = '&times;'
        cardHeader.appendChild(cardClose);
    }
    
    let headerSpacer = document.createElement('hr');
    headerSpacer.style = `
        margin: 2px;
        opacity: 0.75;
    `
    cardHeader.appendChild(headerSpacer);
    

    card.appendChild(cardHeader);

    // add body
    let cardBody = document.createElement('div');
    cardBody.style = `
        margin-top: 20px;
        padding-left: 5px;
        padding-right: 5px;
    `

    cardBody.appendChild(body);

    card.appendChild(cardBody);

    return card;

}


/*
    This function creates an input group
*/
function createTextInput(id,label,initialValue='',onChange) {

    // create parent element
    let textInput = document.createElement('div');
    textInput.style = `
        margin-top: 20px;
    `

    // add label
    let textInputLabel = document.createElement('div');
    textInputLabel.style = `
        align-self: center;
        margin-right: 5px;
        font-weight: bold;
    `
    textInputLabel.innerHTML = label;
    textInput.appendChild(textInputLabel);

    // add input
    let textInputField = document.createElement('input');
    textInputField.type = 'text';
    textInputField.id = id;
    textInputField.style = `
        width: 90%;
        border-radius: 10px;
        padding: 10px;
        margin-top: 5px;
    `
    textInputField.onchange = onChange;
    textInputField.value = initialValue;
    textInput.append(textInputField);
        
    // return
    return textInput;
} 

/*
    This function creates an text area group
*/
function createTextAreaInput(id,label,rows,initialValue='',onChange) {

    let textAreaInput = document.createElement('div');
    textAreaInput.style=`
        margin-top: 20px;
    `;

    // add label
    let textInputLabel = document.createElement('div');
    textInputLabel.style = `
        align-self: center;
        margin-right: 5px;
        font-weight: bold;
    `
    textInputLabel.innerHTML = label;
    textAreaInput.appendChild(textInputLabel);

    // add input
    let textInputField = document.createElement('textarea');
    textInputField.id = id;
    textInputField.rows = rows;
    textInputField.style = `
        width: 90%;
    `
    textInputField.onchange = onChange;
    textInputField.innerHTML = initialValue;
    textAreaInput.append(textInputField);

    return textAreaInput;
} 

/*
    This function creates an text area group
*/
function createSelectInput(id,label,options,initialValue,onChange) {

    let selectInput = document.createElement('div');

    selectInput.style = `
        margin-top: 20px;
    `;

    // add label
    let selectLabel = document.createElement('div');
    selectLabel.style = `
        align-self: center;
        margin-right: 5px;
        font-weight: bold;
    `;
    selectLabel.innerHTML = label;
    selectInput.appendChild(selectLabel);

    // add select
    let select = document.createElement('select');
    select.style = `
        width: 100%;
        border-radius: 5px;
        padding: 5px;
        font-size: 15px;
    `;
    select.onchange = onChange

    // add options
    options.forEach((o) => {
        
        let option = document.createElement('option');
        if(o == initialValue) {
            option.selected = true;
        }
        option.id = id +o;
        option.value = o;
        option.innerHTML = o;

        select.appendChild(option);

    })

    selectInput.appendChild(select);

    return selectInput;

} 

function createHr(width) {

    let hr = document.createElement('hr');
    hr.style = `
        width: `+ width +`
    `

    return hr;
}

function createHeader2(text) {

    let h4 = document.createElement('h2');
    h4.style = `
        margin-top: 50px;
    `;
    h4.innerHTML = text;

    return h4;
}

function createHeader3(text) {

    let h4 = document.createElement('h3');
    h4.innerHTML = text;

    return h4;
}

function createHeader4(text) {

    let h4 = document.createElement('h4');
    h4.innerHTML = text;

    return h4;
}