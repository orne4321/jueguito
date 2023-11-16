const canvas = document.querySelector('canvas')
const can = canvas.getContext('2d')
paused = false

canvas.width = 1281
canvas.height = 638

can.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
const background = new Sprite({
    posicion:{
        x: 0, 
        y: 0
    },
    srcImage: './img/background.png'
})

const cat = new Sprite({
    posicion:{
        x: 835, 
        y: 541
    },
    srcImage: './img/cat.png',
    scale: 2,
    framesMax: 4
})

const player1 = new Lucha({
    color: 'red',
    posicion:{
        x: 300, 
        y: 0
    },
    veloz:{
        x: 0, 
        y: 0
    },
    offset: {
        x: 0, 
        y: 0
    },
    srcImage: './img/ghostface/quieto.png',
    framesMax: 6,
    scale: 1.2,
    offset: {
        x: 60, 
        y: 83
    },

    sprites: {
        quieto: {
            srcImage: './img/ghostface/quieto.png',
            framesMax: 6
        },
        walk: {
            srcImage: './img/ghostface/walk.png',
            framesMax: 6
        },
        jump: {
            srcImage: './img/ghostface/jump.png',
            framesMax: 2
        },
        fall: {
            srcImage: './img/ghostface/fall.png',
            framesMax: 2
        },
        attack: {
            srcImage: './img/ghostface/attack.png',
            framesMax: 4
        },
        hurt: {
            srcImage: './img/ghostface/hurt.png',
            framesMax: 5
        },
        death: {
            srcImage: './img/ghostface/death.png',
            framesMax: 6
        },
    },
    attackBox: {
        offset: {
            x: 50, 
            y: 0
        },
        width: 80,
        height: 50
    }
})
player1.draw()

const player2 = new Lucha({
    color: 'blue',
    posicion: {
        x: 900, 
        y: 100
    },
    veloz: {
        x: 0, 
        y: 0
    },
    offset: {
        x: -50, 
        y: 0
    },
    srcImage: './img/myers/quieto.png',
    framesMax: 6,
    scale: 1.2,
    offset: {
        x: 100, 
        y: 87
    },
    
    sprites: {
        quieto: {
            srcImage: './img/myers/quieto.png',
            framesMax: 6
        },
        walk: {
            srcImage: './img/myers/walk.png',
            framesMax: 6
        },
        jump: {
            srcImage: './img/myers/jump.png',
            framesMax: 2
        },
        fall: {
            srcImage: './img/myers/fall.png',
            framesMax: 2
        },
        attack: {
            srcImage: './img/myers/attack.png',
            framesMax: 4
        },
        hurt: {
            srcImage: './img/myers/hurt.png',
            framesMax: 5
        },
        death: {
            srcImage: './img/myers/death.png',
            framesMax: 6
        },
    },

    attackBox: {
        offset: {
            x: -30, 
            y: 0
        },
        width: 80,
        height: 50
    }
})
player2.draw()

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

cuentaRegresiva()

function animacion(){
    window.requestAnimationFrame(animacion)
    can.fillStyle = 'black'
    can.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    cat.update()
    player1.update()
    player2.update()
    player1.veloz.x = 0
    player2.veloz.x = 0

    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.veloz.x = -5
        player1.switchSprite('walk')
    }else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.veloz.x = 5
        player1.switchSprite('walk')
    }else {
        player1.switchSprite('quieto')
    }

    if(player1.veloz.y < 0){
        player1.switchSprite('jump')
    }else if(player1.veloz.y > 0){
        player1.switchSprite('fall')
    }

    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.veloz.x = -5
        player2.switchSprite('walk')
    }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
        player2.veloz.x = 5
        player2.switchSprite('walk')
    }else{
        player2.switchSprite('quieto')
    }

    if(player2.veloz.y < 0){
        player2.switchSprite('jump')
    }else if(player2.veloz.y > 0){
        player2.switchSprite('fall')
    }
        
    if (colision({rectangle1: player1, rectangle2: player2 }) &&
        player1.attacking && player1.framesCurrent === 2){
        player2.hurt()
        player1.attacking = false
        if (!player2.dead) {
            score1 += 50;
            document.querySelector('#score1').innerHTML = score1;
        }   
        document.querySelector('#p2Health').style.width = player2.health + '%'
    }

    if(player1.attacking && player1.framesCurrent === 2){
        player1.attacking = false
    }

    if (colision({rectangle1: player2, rectangle2: player1 }) &&
        player2.attacking && player2.framesCurrent === 2){
        player1.hurt()
        player2.attacking = false
        if (!player1.daed) {
            score2 += 50;
            document.querySelector('#score2').innerHTML = score2;
        }
        document.querySelector('#p1Health').style.width = player1.health + '%'
    }

    if(player2.attacking && player2.framesCurrent === 2){
        player2.attacking = false
    }

    if(player2.health <= 0 || player1.health <= 0){
        ganador({player1, player2, relojId});
    }
}
animacion()

window.addEventListener('keydown', (event) => {
    if(!player1.dead){
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
              player1.veloz.y = -12
              break
            case 'e':
                player1.attack()
                break
        }
    }

    if(!player2.dead){
        switch(event.key){
            case 'ArrowRight': 
              keys.ArrowRight.pressed = true
              player2.lastKey = 'ArrowRight'
              break
            case 'ArrowLeft': 
              keys.ArrowLeft.pressed = true
              player2.lastKey = 'ArrowLeft'
              break
            case 'ArrowUp': 
              player2.veloz.y = -12
              break
            case ' ':
              player2.attack()
              break
        }
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
