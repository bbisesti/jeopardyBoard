let category = null;

function questionManager() {
    return showCategories()
}

function showCategories() {
    let questionManagerDiv = document.createElement('div');
    questionManagerDiv.style = `
        width: 800px;
        height: 90vh;
        padding: 20px;
        overflow-y: auto;
    `

    // show teams
    questionManagerDiv.appendChild(
        createHeader2('Current Categories')
    )
    questionManagerDiv.appendChild(
        createHr('98%')
    )

    let categoriesBlock = document.createElement('div');
    categoriesBlock.style = `
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3,200px);
        margin-top: 20px;
        margin-bottom: 20px;
        gap: 20px;
        color: yellow;
        font-weight: bold;
        text-align: center;
    `;


    let game = getGame();

    game.categories.forEach((c) => {

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
        name.innerHTML = c.name;
        name.onclick = () => showQuestions(c);
        b.appendChild(name);

        // add close
        let close = document.createElement('span');
        close.style = `
            font-size: 20px;
            font-weight: bold;
        `;
        close.innerHTML = '&times;';
        close.onclick = () => removeCategory(c);
        b.appendChild(close);

        categoriesBlock.appendChild(b)
    })
    questionManagerDiv.appendChild(categoriesBlock);

    // add category button
    questionManagerDiv.appendChild(
        createButton('addCategory','Add Category',() => addCategory())
    );

    let questionsDiv = document.createElement('questionsDiv');
    questionsDiv.id = 'QuestionsDiv';
    questionManagerDiv.appendChild(questionsDiv);

    let questionsFormDiv = document.createElement('questionsFormmDiv')
    questionsFormDiv.id = 'QuestionsFormDiv';
    questionManagerDiv.appendChild(questionsFormDiv)

    return questionManagerDiv;
}


function showQuestions(category) {

    document.getElementById('QuestionsFormDiv').replaceChildren([])

    let questions = document.createElement('div');

    let questionsBlock = document.createElement('div');
    questionsBlock.style = `
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3,200px);
        margin-top: 20px;
        margin-bottom: 20px;
        gap: 20px;
        color: yellow;
        font-weight: bold;
        text-align: center;
    `;

    questions.append(
        createHeader2(category.name)
    )
    questions.appendChild(
        createHr('98%')
    )

    category.questions.forEach((q) => {

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
        name.innerHTML = q.question;
        name.onclick = () => {
            showQuestionsForm(category,q)
        }
        b.appendChild(name);

        // add close
        let close = document.createElement('span');
        close.style = `
            font-size: 20px;
            font-weight: bold;
        `;
        close.innerHTML = '&times;';
        close.onclick = () => removeQuestion(category,q);
        b.appendChild(close);

        questionsBlock.appendChild(b)

    })

    questions.appendChild(questionsBlock);

    questions.append(
        createButton('addQuestinosButton','Add Question',() => {
            showQuestionsForm(category,null)
        })
    )

    document.getElementById('QuestionsDiv').replaceChildren([]);
    document.getElementById('QuestionsDiv').appendChild(questions);
    

}

function showQuestionsForm(category,q=null) {
    document.getElementById('QuestionsFormDiv').replaceChildren([]);
    document.getElementById('QuestionsFormDiv').appendChild(questionsForm(category,q));
}

function addCategory() {

    let name = prompt('Please input category name');

    if(name) {

        let game = getGame();

        game.categories.push({
            'id': uuidv4(),
            'name': name,
            'questions': []
        });

        writeGame(game);
        updateModal(questionManager)
        showPage(gameBoard)

    }

}

function removeCategory(category) {

    let game = getGame();

    game.categories.forEach((c,i) => {
        if(c.id == category.id) {
            game.categories.splice(i,1)
        }
    })

    writeGame(game);
    showPage(gameBoard);
    updateModal(questionManager);

}


function addQuestion(category,question,answer,type,value,dailyDouble) {
    console.log(dailyDouble)

    let game = getGame();

    game.categories.forEach((c) => {
        if(c.id == category.id) {
            c.questions.push({
                id: uuidv4(),
                question: question,
                answer: answer,
                type: type,
                value: value,
                dailyDouble: dailyDouble
            })
        }
    })

    writeGame(game);
    updateModal(questionManager)
    showPage(gameBoard)

}

function editQuestion(category,question,questionQuestion,answer,type,value,dailyDouble) {
    let game = getGame();

    game.categories.forEach((c) => {
        if(c.id == category.id) {
            
            c.questions.forEach((q) => {
                if(q.id == question.id) {
                    q.question = questionQuestion;
                    q.answer = answer;
                    q.type = type;
                    q.value = value;
                    q.dailyDouble = dailyDouble;
                }
            })
        }
    })

    writeGame(game);
    updateModal(questionManager)
    showPage(gameBoard)
}

function removeQuestion(category,question) {

    let game = getGame();

    game.categories.forEach((c) => {
        if(c.id == category.id) {
            c.questions.forEach((q,i) => {
                if(q.id == question.id) {
                    c.questions.splice(i,1)
                }
            })
        }
    })

    writeGame(game);
    updateModal(questionManager)
    showPage(gameBoard)

}

function questionsForm(category,q=null) {

    
    let question = '';
    let answer = '';
    let type = 'text';
    let value = 10;
    let dailyDouble = false;
    let possibleTypes = ['text','image','video']
    let possibleValues = [10,20,30,40,50]

    if(q) {
        question = q.question;
        answer = q.answer;
        type = q.type;
        value = q.value;
        dailyDouble = q.dailyDouble;
    }

    let form = document.createElement('div');
    form.style = `
    
    `

    // add question fields

    
    form.appendChild(
        createTextAreaInput('questionQuestion' + category.id + 'form','Question',10,question,(e) => question = e.target.value)
    )
    
    form.appendChild(
        createTextAreaInput('questionAnswer' + category.id,'Answer',10,answer,(e) => answer = e.target.value)
    )

    form.appendChild(
        createSelectInput('questionType' + category.id,'Type',possibleTypes,type,(e) => type = e.target.value)
    )

    form.appendChild(
        createSelectInput('questionValues'+category.id,'Value',possibleValues,value,(e) => value = e.target.value)
    )

    form.appendChild(
        createCheckboxInput('questionDailyDouble','Daily Double',dailyDouble,(e) => {
            if(e.target.checked) {
                dailyDouble = true;
            } else {
                dailyDouble = false;
            }
        })
    )

    let spacer = document.createElement('div')
    spacer.style = `
        margin-top: 10px;
    `;
    form.appendChild(spacer);
    
    if(q) {
        form.appendChild(
            createButton('questionUpdate'+category.id,'Update',() => editQuestion(category,q,question,answer,type,value,dailyDouble))
        )
    } else {
        form.appendChild(
            createButton('questionSave'+category.id,'Save',() => addQuestion(category,question,answer,type,value,dailyDouble))
        )
    }



    return form;

}