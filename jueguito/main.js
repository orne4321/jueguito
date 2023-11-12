const canvas = document.querySelector('canvas')
const can = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

can.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
class Sprite{
    constructor({posicion, veloz, color, offset}){
        this.posicion = posicion
        this.color = color
        this.veloz = veloz
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            posicion: {
                x: this.posicion.x,
                y: this.posicion.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.attacking 
        this.health = 100
    }

    draw() {
        can.fillStyle = this.color
        can.fillRect(this.posicion.x, this.posicion.y, this.width, this.height)

        if(this.attacking){
            can.fillStyle = 'green'
            can.fillRect(this.attackBox.posicion.x, this.attackBox.posicion.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.posicion.x = this.posicion.x + this.attackBox.offset.x
        this.attackBox.posicion.y = this.posicion.y

        this.posicion.x += this.veloz.x
        this.posicion.y += this.veloz.y

        if(this.posicion.y + this.height + this.veloz.y >= canvas.height){
            this.veloz.y = 0
        }else this.veloz.y += gravity
    }

    attack(){
        this.attacking = true
        setTimeout(() => {
            this.attacking = false
        }, 100)
    }
}

const player1 = new Sprite({
    color: 'red',
    posicion:{
        x: 0,
        y: 0
    },
    veloz:{
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})
player1.draw()

const player2 = new Sprite({
    color: 'blue',
    posicion:{
        x: 400,
        y: 100
    },
    veloz:{
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    }
})
player2.draw()
console.log(player1)

const keys = {
    d:{
        pressed: false
    },
    a:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function colision({ rectangle1, rectangle2 }){
    return(rectangle1.attackBox.posicion.x + rectangle1.attackBox.width >= rectangle2.posicion.x &&
        rectangle1.attackBox.posicion.x <= rectangle2.posicion.x + rectangle2.width &&
        rectangle1.attackBox.posicion.y + rectangle1.attackBox.height >= rectangle2.posicion.y &&
        rectangle1.attackBox.posicion.y <= rectangle2.posicion.y + rectangle2.height)
}

function ganador({player1, player2, relojId}){
    clearTimeout(relojId)
    document.querySelector('#mostrar').style.display = 'flex'
    if(player1.health === player2.health){
        document.querySelector('#mostrar').innerHTML = 'Empate'
    }else if(player1.health > player2.health){
        document.querySelector('#mostrar').innerHTML = 'Ghostface Wins'
    }else if(player1.health < player2.health){
        document.querySelector('#mostrar').innerHTML = 'Michael Myers Wins'
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
cuentaRegresiva()

function animacion(){
    window.requestAnimationFrame(animacion)
    can.fillStyle = 'black'
    can.fillRect(0, 0, canvas.width, canvas.height)
    player1.update()
    player2.update()
    player1.veloz.x = 0
    player2.veloz.x = 0

    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.veloz.x = -3
    }else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.veloz.x = 3
    }

    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.veloz.x = -3
    }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
        player2.veloz.x = 3
    }

    if (colision({
        rectangle1: player1,
        rectangle2: player2 
    }) &&
        player1.attacking){
        player1.attacking = false
        player2.health -= 5
        document.querySelector('#p2Health').style.width = player2.health + '%'
    }

    if (colision({
        rectangle1: player2,
        rectangle2: player1 
    }) &&
        player2.attacking){
        player2.attacking = false
        player1.health -= 5
        document.querySelector('#p1Health').style.width = player1.health + '%'
    }

    if(player2.health <= 0 || player1.health <= 0){
        ganador({player1, player2, relojId})
    }
}

animacion()

window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd': 
          keys.d.pressed = true
          player1.lastKey = 'd'
          break
        case 'a': 
          keys.a.pressed = true
          player1.lastKey = 'a'
          break
        case 'w': 
          player1.veloz.y = -16
          break
        case 'e':
            player1.attack()
            break

        case 'ArrowRight': 
          keys.ArrowRight.pressed = true
          player2.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft': 
          keys.ArrowLeft.pressed = true
          player2.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp': 
          player2.veloz.y = -16
          break
        case 'p':
          player2.attacking = true
          break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd': 
          keys.d.pressed = false
          break
        case 'a': 
          keys.a.pressed = false
          break

        case 'ArrowRight': 
          keys.ArrowRight.pressed = false
          break
        case 'ArrowLeft': 
          keys.ArrowLeft.pressed = false
          break
    }
})