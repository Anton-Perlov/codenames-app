import $ from 'jquery'
import { getDatabase } from './firebaseConfig'
const database = getDatabase()

export async function loadGame(hash) {
    // $('#body').html('loading...')

    await updateUserNameInCurrentGame(hash)

    database.ref('games').child(hash).on('value',async game=>{ 
        if(game.exists()){
            await $('#body').html()
            $('#body').html(renderBody())
            $('#gameField').html(renderGame(game))
            $('#playerList').html(renderPlayers(game))
            $('#gameProps').html(renderOptions(game))

            const userId = JSON.parse(localStorage.getItem('userId'))
            if(userId.id==game.val().creater){
                $('.captainFlag').change(async function() {
                    if(this.checked) {
                        let returnVal = confirm("Are you sure?");
                        $(this).prop("checked", returnVal);
                    }
                    let db = database.ref('games').child(hash).child('players').child(this.id.substr(3))
                    await db.child('isCaptain').set(this.checked)
                })
            }
            

            if(game.val().players[userId.id].isCaptain){
                $('.isOpenWordFlag').change(async function() {
                    if(this.checked) {
                        let returnVal = confirm("Are you sure?");
                        $(this).prop("checked", returnVal);
                    }
                    let db = database.ref('games').child(hash).child('words').child(this.id.substr(3))
                    await db.child('isOpen').set(this.checked)
                })
                $('input[type=radio]').change(async function() {
                    // if(this.checked) {
                    //     let returnVal = confirm("Are you sure?");
                    //     $(this).prop("checked", returnVal);
                    // }
                    let db = database.ref('games').child(hash).child('words').child(this.name.substr(3))
                    await db.child('changeColor').set(this.value)
                })


                
            }

            
            


        }else{
            $('#body').html("<h1>Ошибка! 404</h1>")
        }
    })
    
}


function renderBody(){
    
    const html = `
    <div class="row">
        <div class="col" id="gameProps"></div>
    </div>
    <div class="row">
        <div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
            <h6>Игроки:</h6>
            <ul class="list-group" id="playerList"></ul>
        </div>
        <div class="col" id="gameField"></div>
    </div>
    `
    return html
}

function renderGame(game){

    const userId = JSON.parse(localStorage.getItem('userId'))
    const data = game.val()
    let html = ''
    const btnColors = ['warning','primary','danger','dark','light']
    const btnColorsOL = ['outline-warning','outline-primary','outline-danger','outline-dark','light']
    
    for (const word in data.words) {
        let curColor = btnColors[4]
        let curColorOriginal = btnColors[4]
        if(data.words[word].isOpen) {
            curColor = btnColors[data.words[word].changeColor] 
            curColorOriginal = btnColors[data.words[word].color] 
        }else{
            curColor = btnColors[4]
        }
        if(data.players[userId.id].isCaptain){
            if(data.words[word].isOpen) {
                curColor = btnColors[data.words[word].changeColor] 
            }else{
                curColor = btnColorsOL[data.words[word].color] 
            }
        }
        html += `
            <span class="btn btn-${curColor} m-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 game-words" ${data.players[userId.id].isCaptain?'wordId='+word:''} >
                    
                ${(data.words[word].changeColor!=data.words[word].color && data.words[word].isOpen)?'<span class="btn-'+curColorOriginal+'">!!!</span>':''}

                ${data.words[word].text}
                
                ${data.players[userId.id].isCaptain?'<button class="btn btn-sm dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>':''}
                ${data.players[userId.id].isCaptain?getButtonsMenu(word, data.words[word].isOpen, data.words[word].changeColor):''}
            </span>
        `
    }
    return html 
}

function renderPlayers(game){
    
    const userId = JSON.parse(localStorage.getItem('userId'))
    const data = game.val()
    let html = ''
    const btnColors = ['warning','primary','danger','dark','light']
    
    for (const player in data.players) {
        
        let curColor = data.players[player].team
        html += `
        <li class="list-group-item list-group-item-${btnColors[curColor]} ${data.players[player].isCaptain ?'font-weight-bold':''}" playerId="${player}">
        ${userId.id==data.creater?'<button class="btn btn-sm dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>':''}
        ${userId.id==data.creater?getOptionsMenu(player, data.players[player].isCaptain):''}
        ${data.players[player].name}
        ${player==userId.id ? '<small>(вы)</small>' : ''}
        </li>
        `
    }
    return html 
}

function renderOptions(game){

    const gameinfo = `
    <div class="row">
    <b>ВСЕГО</b>&nbsp;слов:&nbsp;<span class="list-group-item-primary m-x-1">${game.val().firstTurn==1?'9':'8'}</span> / <span class="list-group-item-danger m-x-1">${game.val().firstTurn==2?'9':'8'}</span>&nbsp;
    Первыми ходят&nbsp;${game.val().firstTurn==1?'<span class="list-group-item-primary  m-x-1">синяя</span>':'<span class="list-group-item-danger m-x-1">красная</span>'}&nbsp;команда </div>
    `

    return gameinfo
}


function getOptionsMenu(player, isCaptain){
    const html = `
    <div class="dropdown-menu p-1" aria-labelledby="dropdownMenuLink">
            <div class="form-check">
                <label  class="form-check-label">
                    <input type="checkbox" class="form-check-input captainFlag" id="cb_${player}" ${isCaptain?'checked':''} >Капитан
                </label>
            </div>
        </div>
    `
    return html
}


function getButtonsMenu(id, isOpen, changeColor){
    const html = `
    <div class="dropdown-menu p-1" aria-labelledby="dropdownMenuLink">
            <div class="form-check">
                <label  class="form-check-label">
                    <input type="checkbox" class="form-check-input isOpenWordFlag" id="cb_${id}" ${isOpen?'checked':''} >Показать слово
                </label>
            </div>

            <div class="dropdown-divider"></div>
            
            <div class="form-check">
                <input class="form-check-input" type="radio" name="rb_${id}" id="rb_0_${id}" value="0" ${changeColor==0?'checked':''}>
                <label class="form-check-label" for="rb_0_${id}">
                <span class="text-warning">нейтральный</span>
                </label>
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="radio" name="rb_${id}" id="rb_1_${id}" value="1" ${changeColor==1?'checked':''}>
                <label class="form-check-label" for="rb_1_${id}">
                <span class="text-primary">синий</span>
                </label>
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="radio" name="rb_${id}" id="rb_2_${id}" value="2" ${changeColor==2?'checked':''}>
                <label class="form-check-label" for="rb_2_${id}">
                <span class="text-danger">красный</span>
                </label>
            </div>
        </div>
    `
    return html
}

export async function updateUserNameInCurrentGame(hash){
    let userId = JSON.parse(localStorage.getItem('userId'))
    let db = database.ref('games').child(hash).child('players').child(userId.id)
    await db.child('name').set(userId.name)
    await db.child('team').set(userId.team)
    return true
}