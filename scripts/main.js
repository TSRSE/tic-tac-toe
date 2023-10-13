const gameStateManager = (function(){

    // const getElementByValue = (object, value) => {return object.find(x => x.)}

    let currentStage = 0
    const gameStages = {none : 0, start : 1, playing : 2, ended: 3}
    const setStage = (newState) => { currentStage = gameStages[newState]; console.log(currentStage) }
    const getCurrentStage = () => currentStage
    

    let turnState = 0
    const turnStates = {X : 0, O : 1}
    const setTurn = (newState) => { turnState = turnStates[newState]; console.log(turnState) }
    const getCurrentTurn = () => { console.log(turnStates[turnState]); return turnStates[turnState]; }
    
    return {setTurn, getCurrentTurn, setStage, getCurrentStage}
})()

function testStateManager(){
    gameStateManager.setStage('start')
    console.log(`${gameStateManager.getCurrentStage()}`)
}

function Cell(cell, index){
    this.index = index
    this.cell = cell
}

const cell = (function(){
    const states = {empty: null, X : 0, O : 1}
    let state = states['empty']

    const setState = (newState) => { state = states[newState]; updateText()}

    const asDomElement = document.createElement('div')
    asDomElement.className = 'cell'
    asDomElement.onclick = () => {asDomElement.innerText = 'clicked!'}

    // const updateText = () => innerText = state == states['X'] ? 'O' : 'X';

    return { setState, state, asDomElement}
})()

function createGrid(array){
    for (let index = 0; index < 9; index++) 
    { array.push(new Cell(cell, index)); }
    // console.log(array)
    // console.log(grid)
}

function drawGrid(array){
    let gridUIElement = document.getElementById('grid')
    gridUIElement.innerHTML = ''
    for (let index = 0; index < array.length; index++) {
        gridUIElement.cloneNode(array[index]['cell']['asDomElement'])
    }
}

const grid = []
createGrid(grid)
drawGrid(grid)

// testStateManager();