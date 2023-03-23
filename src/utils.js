

function loadGame() {

    if(localStorage.getItem('game')) {
        // load and show game page
        showPage(gameBoard);
    } else {
        showPage(loadFilePage);
    }
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


function getGame() {
    return JSON.parse(localStorage.getItem('game'));
}

function writeGame(game) {
    localStorage.setItem('game',JSON.stringify(game));
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

function createScoreCard(team) {

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


function showModal(id,content){
    
    let myId = id+'modal';

    // Add body
    let modal = document.createElement('div');
    modal.id = myId
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

    modal.appendChild(modalContent);

    return modal;

    

}