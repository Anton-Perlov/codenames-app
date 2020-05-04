import $ from 'jquery';
import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './main.css'
import { checkUser,randomString } from './user';
import { getGamesList } from './getGamesList'
import { newGame } from './newGame';
import { loadGame } from './loadGame';



if(!localStorage.getItem('userId')){
    localStorage.setItem('userId', JSON.stringify({id:randomString(32),name:'Anonymous',team:1}) )
}
let userId = JSON.parse(localStorage.getItem('userId'))

if(userId.name == 'Anonymous'){ checkUser() }
window.addEventListener('storage', ()=>{
    let userId = JSON.parse(localStorage.getItem('userId'))
    $('#changeName').html(userId.name).removeClass('btn-outline-primary btn-outline-danger').addClass(userId.team==1?'btn-outline-primary':'btn-outline-danger')
})

$("#changeName").on('click', ()=>{ checkUser() })
$('#changeName').html(userId.name).removeClass('btn-outline-primary btn-outline-danger').addClass(userId.team==1?'btn-outline-primary':'btn-outline-danger')

window.addEventListener('hashchange',()=>{
    if(window.location.hash){
        hashChanged()
    }
})
    
if(window.location.hash){
    hashChanged()
}else{
    getGamesList()
}

function hashChanged(){
    let hash = window.location.hash.substr(1)
    // $("#gameLink").hide()
    $("#gameLink").html(gameLink())
    $("#gameURL").val(window.location.href)
    $("#copyLink").click(copyLink)

    if(hash=='newGame'){
        newGame()
    }else{
        loadGame(hash)
    }
}

function gameLink(){
    let html = `
        <div class="col">
            Ссылка на эту игру: <input type="text" id="gameURL" class="gameUrlLink"><button type="button" class="gameUrlLinkButton" id="copyLink">скопировать</button>
        </div>
    `
    return html

}

function copyLink() {
    var copyText = document.getElementById("gameURL");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
  }