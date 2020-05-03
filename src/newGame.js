import { getDatabase } from './firebaseConfig'

const database = getDatabase()

export async function newGame (){

    const wordsObj = await getNewWords()
    const userId = JSON.parse(localStorage.getItem('userId'))
    const game = {
        date: new Date().toJSON(),
        creater: userId.id,
        isActive: true,
        firstTurn: wordsObj.firstTurn,
        players: {
            [userId.id]: {
                name: userId.name,
                team: 0,
                isCaptain: false
            }
        },
        words: wordsObj.words
    }

    let newPostKey = database.ref('games').push().key
    let db = database.ref('games').child(newPostKey)
    db.set(game)
    window.location.hash = '#'+newPostKey
}

async function getNewWords(specialWords = false){

    let allWords = {}
    await database.ref('words').once('value').then(snapshot=>{
        allWords = snapshot.val()
    })
    const words = shuffleArray(allWords, 25)
    const colors = [shuffleArray([1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3]),shuffleArray([2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3])]
    const firstTurn = Math.floor(Math.random() * 2)
    const wordsObj = {firstTurn:0, words:{}}
    wordsObj.firstTurn = firstTurn+1
    for (let i = 0; i < 25 ; i++){
        wordsObj['words'][i] = new Object({
            text: words[i],
            isOpen: false,
            color: colors[firstTurn][i],
            changeColor: colors[firstTurn][i]
        })
    }
    return wordsObj
}

function shuffleArray(array, limit=0) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    if(limit>0){
        array = array.slice(0, limit);
    }
    return array
}