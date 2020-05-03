
import { getModal } from './modal'
import $ from 'jquery';
import { updateUserNameInCurrentGame, loadGame } from './loadGame'

export async function checkUser(){
    let userId = await JSON.parse(localStorage.getItem('userId'))
    let curName = userId.name
    let checked = ['','checked','']
    userId.team==1 ? checked = ['','checked',''] : checked = ['','','checked']

    const html = getModal(`Представьтесь`,
    `
    <div class="form-group">
        <label for="playerName">Имя</label>
        <input type="text" class="form-control" id="userName" value="${curName}">
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="team" id="team_red" value="1" ${checked[1]}>
        <label class="form-check-label" for="team_red">
            За синих
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="team" id="team_blue" value="2" ${checked[2]}>
        <label class="form-check-label" for="team_blue">
            За красных
        </label>
    </div>
    `,
    `
    <button type="submit" class="btn btn-primary" id="savePlayerName">Сохранить</button>
    `)

    $('body').append(html)
    $('#modal').modal('show')

    
    $('#myForm').on('submit', event=>{
        event.preventDefault()
        updateData(userId)
    })

}


async function updateData(userId){
    
    if($('#userName').val().length<3) {
        $('#modal').click()
    }else{
        const newName = $('#userName').val().trim()
        const newTeam = $( "input[type=radio][name=team]:checked" ).val()
        localStorage.setItem(
            'userId', 
            JSON.stringify({
                id: userId.id,
                name: newName,
                team: newTeam
            })
        )
        $('#changeName').html($('#userName').val().trim())
        $('#changeName').removeClass('btn-primary btn-outline-danger')
        $('#changeName').addClass(newTeam==1?'btn-outline-primary':'btn-outline-danger')
        $('#modal').modal('hide').remove()
        $('.modal-backdrop').remove()
    }
    
    if(window.location.hash!=null){
        let hash = window.location.hash.substr(1)
        // loadGame(hash)
        updateUserNameInCurrentGame(hash)
        
    }
    
}

export function randomString(i) {
    var rnd = '';
    while (rnd.length < i) 
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, i);
}
