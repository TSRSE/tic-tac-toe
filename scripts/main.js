const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

const gameStateManager = (function(){
    let grid = []

    let currentStage = 0
    const gameStages = { 0 : 'none' , 1 : 'start', 2 : 'playing', 3 : 'ended' }
    const setStage = (newState) => { currentStage = gameStages[newState]; console.log(currentStage) }
    const getCurrentStage = () => currentStage
    
    let turnState = 0
    const turnStates = { 0 : 'X', 1 : 'O' }
    const toggleTurn = () => { turnState = turnState == 0 ? 1 : 0; }
    const getCurrentTurn = () => { console.log(turnStates[turnState]); return turnStates[turnState]; }

    function startGame(){
        setStage(2);
        grid = gridController.createGrid()
        gridController.drawGrid(grid)
    }
    
    return {getCurrentTurn, setStage, getCurrentStage, toggleTurn, startGame}
})()

function testStateManager(){
    gameStateManager.setStage('start')
    console.log(`${gameStateManager.getCurrentStage()}`)
}

const gridController = (function(){
    function Cell(){
        this.states = { null: 'empty', 0 : 'X', 1 : 'O' }
        this.state = this.states['empty']
    
        this.setState = (newState) => { 
            this.state = this.states[newState]; this.updateText()
            gameStateManager.toggleTurn()
        }
    
        this.asDomElement = document.createElement('div')
        this.asDomElement.className = 'cell'
        this.asDomElement.onclick = () => {
            if (this.state != this.states['empty']) { return; }
            if (gameStateManager.getCurrentStage() != 'playing') { return; }
            
            this.setState(getKeyByValue(this.states, gameStateManager.getCurrentTurn()));
            checkGridForCondition(gameStateManager.grid);
        }
    
        this.updateText = () => { this.asDomElement.innerText = this.state;}
    }


    function createGrid(){
        let _array = [];
        for (let index = 0; index < 9; index++) 
        { _array.push(new gridController.Cell()); }
        return _array;
    }
    
    function drawGrid(array){
        const gridUIElement = document.getElementById('grid')
        gridUIElement.innerHTML = ''
        for (let index = 0; index < array.length; index++) {
            let linkedCell = array[index]['asDomElement']; linkedCell.setAttribute('id', index);
            gridUIElement.appendChild(linkedCell)
        }
    }

    function checkGridForCondition(array){
        for (let index = 0; index <= 6; index += 3) {
            if (array[index].state == array[index+1].state && array[index].state == array[index+2].state && array[index].state != null) {
                alert('SAME Horizontal!')
                gameStateManager.setStage(3);
            }
        }

        for (let index = 0; index < 3; index++) {
            if (array[index].state == array[index+3].state && array[index].state == array[index+6].state && array[index].state != null) {
                alert('SAME Vertical!')
                gameStateManager.setStage(3);
            }
        }

        if (array[0].state == array[4].state && array[0].state == array[8].state && array[0].state != null) {
            alert('Left to right')
            gameStateManager.setStage(3);
        }
        
        if (array[2].state == array[4].state && array[2].state == array[6].state && array[2].state != null) {
            alert('Right to left')
            gameStateManager.setStage(3);
        }
    }

    return { Cell, createGrid, drawGrid }
})()


gameStateManager.startGame()