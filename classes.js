class Sprite{
    constructor({posicion, srcImage, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){
        this.posicion = posicion
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = srcImage
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.offset = offset
    }

    draw() {
        can.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.posicion.x - this.offset.x, 
            this.posicion.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale)
    }

    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            }else{
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Lucha extends Sprite{
    constructor({posicion, veloz, color, srcImage, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, sprites, 
        attackBox = {offset:{}, width: undefined, height: undefined}}){
        super({posicion, srcImage, scale, framesMax, offset})
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.attacking 
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.sprites = sprites
        this.dead = false

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].srcImage
        }
    }

    update() {
        this.draw()
        if(!this.dead) this.animateFrames()
        this.attackBox.posicion.x = this.posicion.x + this.attackBox.offset.x
        this.attackBox.posicion.y = this.posicion.y + this.attackBox.offset.y

        this.posicion.x += this.veloz.x
        this.posicion.y += this.veloz.y

        if(this.posicion.y + this.height + this.veloz.y >= canvas.height - 51){
            this.veloz.y = 0
            this.posicion.y = 437
        }else this.veloz.y += gravity
    }

    attack(){
        this.switchSprite('attack')
        this.attacking = true
    }

    hurt(){
        this.health -= 5
        if(this.health <= 0){
            this.switchSprite('death')
        }else this.switchSprite('hurt')
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true
            return}
        if(this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1) return
        if(this.image === this.sprites.hurt.image && this.framesCurrent < this.sprites.hurt.framesMax - 1) return

        switch (sprite){
            case 'quieto':
                if(this.image !== this.sprites.quieto.image){
                    this.image = this.sprites.quieto.image
                    this.framesMax = this.sprites.quieto.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'walk':
                if(this.image !== this.sprites.walk.image){
                    this.image = this.sprites.walk.image
                    this.framesMax = this.sprites.walk.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack':
                if(this.image !== this.sprites.attack.image){
                    this.image = this.sprites.attack.image
                    this.framesMax = this.sprites.attack.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'hurt':
                if(this.image !== this.sprites.hurt.image){
                    this.image = this.sprites.hurt.image
                    this.framesMax = this.sprites.hurt.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break;
        }
    }
}

