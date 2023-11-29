const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value)

function Player(elementID){
    this.score = 0
    this.updatableLabel = document.getElementById(elementID).lastElementChild

    this.reset = () => { this.score = 0; this.renderScores() }
    this.addScore = () => { this.score++; this.renderScores() }
    
    this.renderScores = () => {this.updatableLabel.innerText = this.score}
    this.renderScores()
}

const Player1 = new Player('player1')
const Player2 = new Player('player2')

const gameStateManager = (function(){
    let grid = []

    let currentStage = 0
    const gameStages = { 0 : 'none' , 1 : 'start', 2 : 'playing', 3 : 'ended' }
    const setStage = (newState) => { 
        currentStage = gameStages[newState];
        if (currentStage == 'ended' && document.getElementById('next-game').hasAttribute('disabled')) {
            document.getElementById('next-game').toggleAttribute('disabled')
        }
        // currentStage == 'ended' ? document.getElementById('next-game').setAttribute('disabled', 'false') : document.getElementById('next-game').setAttribute('disabled', 'true'); 
        console.log(currentStage) }
    const getCurrentStage = () => currentStage
    
    let turnState = 0
    const turnStates = { 0 : 'X', 1 : 'O' }
    const toggleTurn = () => { turnState = turnState == 0 ? 1 : 0; }
    const resetTurns = () => (turnState = 0)
    const getCurrentTurn = () => { console.log(turnStates[turnState]); return turnStates[turnState]; }

    document.getElementById('reset').addEventListener('click', () => {reset(); startGame()})

    document.getElementById('next-game').addEventListener('click', () => {startGame();})

    // const toggleNextGameButton = () => { document.getElementById('next-game').toggleAttribute('disabled') }

    function reset(){
        Player1.reset()
        Player2.reset()
        document.getElementById('next-game').setAttribute('disabled', 'true')
        startGame()
    }

    function startGame(){
        setStage(2);
        resetTurns()
        grid = gridController.createGrid()
        gridController.drawGrid(grid)
    }

    const getGrid = () => grid
    
    return {getCurrentTurn, setStage, getCurrentStage, toggleTurn, startGame, getGrid, reset}
})()

const gridController = (function(){
    function Cell(){
        this.states = { null: 'empty', 0 : 'X', 1 : 'O' }
        this.state = this.states['empty']
    
        this.isWonCell = false;

        this.colorToggle = () => {
            this.isWonCell = !this.isWonCell
            if (this.isWonCell) { this.asDomElement.classList.toggle('cell--won') }
        }

        this.setState = (newState) => { 
            this.state = this.states[newState]; this.updateText()
            drawGrid(gameStateManager.getGrid())
            gameStateManager.toggleTurn()
        }

        this.asDomElement = document.createElement('div')
        this.asDomElement.className = 'cell'
        
        this.asDomElement.onclick = () => {
            if (this.state != this.states['empty']) { return; }
            if (gameStateManager.getCurrentStage() != 'playing') { return; }
            
            this.setState(getKeyByValue(this.states, gameStateManager.getCurrentTurn()));
            checkGridForCondition(gameStateManager.getGrid());
        }
        
    
        this.updateText = () => { 
            this.asDomElement.innerText = this.state;
        }
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
            let linkedCell = array[index].asDomElement;
            linkedCell.setAttribute('id', index);
            gridUIElement.appendChild(linkedCell)
        }
    }

    function checkGridForCondition(array){

        function minimize(index){
            array[index].state == 'X' ? Player1.addScore() : Player2.addScore()
            gameStateManager.setStage(3);
            
        }

        for (let index = 0; index <= 6; index += 3) {
            if (array[index].state == array[index+1].state && array[index].state == array[index+2].state && array[index].state != null) {
                // alert('SAME Horizontal!')

                array[index].colorToggle()
                array[index+1].colorToggle()
                array[index+2].colorToggle()

                minimize(index)
            }
        }

        for (let index = 0; index < 3; index++) {
            if (array[index].state == array[index+3].state && array[index].state == array[index+6].state && array[index].state != null) {
                // alert('SAME Vertical!')

                array[index].colorToggle()
                array[index+3].colorToggle()
                array[index+6].colorToggle()
                
                minimize(index)
            }
        }

        if (array[0].state == array[4].state && array[0].state == array[8].state && array[0].state != null) {
            // alert('Left to right')

            array[0].colorToggle()
            array[4].colorToggle()
            array[8].colorToggle()

            minimize(0)
        }

        if (array[2].state == array[4].state && array[2].state == array[6].state && array[2].state != null) {
            // alert('Right to left')

            array[2].colorToggle()
            array[4].colorToggle()
            array[6].colorToggle()
            
            minimize(2)
        }

        if (array.find(x => x.state == undefined) == undefined) {
            alert('DRAW!')
            // gameStateManager.reset()
            return;
        }
    }

    return { Cell, createGrid, drawGrid }
})()

gameStateManager.startGame()