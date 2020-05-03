import $ from 'jquery'
import { getDatabase } from './firebaseConfig'

const database = getDatabase()


export function getGamesList(){
    // console.log('fn getGamesList is started')
    database.ref('games')
        .limitToLast(10)
        .on('value',snapshot=>{
            createList(snapshot.val())
        })
}

function createList (data){
    const newData = reverseObject(data)

    let html = `
    <div class="row">
        <div class="col m-4">${newGameHtml()}</div>
    </div>
    <div class="row">
    <div class="col">`
    for (let key in newData){
        html += `<li>
            <a href="/#${key}">${newData[key].date}</a>
        </li>
        `
    }

    html += `</div></div>`
    
    $('#body').html(html)
}

function newGameHtml(){

    let html = `
    <a class="btn btn-primary" href="./#newGame">Создать новую игру</a>
    `
    return html
}

function reverseObject(object) {
    let newObject = {}
    let keys = []

    for (let key in object) {
        keys.push(key)
    }
    for (let i = keys.length - 1; i >= 0; i--) {
      let value = object[keys[i]]
      newObject[keys[i]]= value
    } 
    return newObject
  }