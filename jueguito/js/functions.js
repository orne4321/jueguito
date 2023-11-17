function colision({rectangle1, rectangle2}){
    return(rectangle1.attackBox.posicion.x + rectangle1.attackBox.width >= rectangle2.posicion.x &&
        rectangle1.attackBox.posicion.x <= rectangle2.posicion.x + rectangle2.width &&
        rectangle1.attackBox.posicion.y + rectangle1.attackBox.height >= rectangle2.posicion.y &&
        rectangle1.attackBox.posicion.y <= rectangle2.posicion.y + rectangle2.height)
}
 
var score1 = 0
var score2 = 0

function ganador({player1, player2, relojId}){
    clearTimeout(relojId)
    document.querySelector('#mostrar').style.display = 'flex'
    if(player1.health === player2.health){
        document.querySelector('#mostrar').innerHTML = 'Empate'
    }else if(player1.health > player2.health){
        document.querySelector('#mostrar').innerHTML = 'Ghostface Wins'
        document.querySelector('#score1').innerHTML = score1
    }else if(player1.health < player2.health){
        document.querySelector('#mostrar').innerHTML = 'Michael Myers Wins'
        document.querySelector('#score2').innerHTML = score2
    }
} 

let reloj = 60
let relojId
function cuentaRegresiva(){
    if(reloj > 0){
        relojId = setTimeout(cuentaRegresiva, 1000)
        reloj--
        document.querySelector('#reloj').innerHTML = reloj
    }
    if(reloj === 0){
        ganador({player1, player2, relojId})
    }
}

