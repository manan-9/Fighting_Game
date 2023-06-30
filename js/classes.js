class Sprite{             //image which will be animated
    constructor({position, imagesrc,scale=1,framesNum=1,offset={x:0,y:0}}){
        this.position=position
        this.height=150
        this.width=50
        this.scale=scale
        this.image=new Image()     //using native API
        this.image.src=imagesrc
        this.framesNum=framesNum    //to give shop animation
        this.framescurrent=0
        this.framesElapsed=0      //to moderate speed of animation
        this.framesHold=7
        this.offset=offset
    }
    draw(){
        c.drawImage(
            this.image,
            this.framescurrent*(this.image.width/this.framesNum),
            0,
            this.image.width/this.framesNum,this.image.height,
            this.position.x-this.offset.x,
            this.position.y-this.offset.y,
            (this.image.width/this.framesNum)*this.scale,
            this.image.height*this.scale
        )
    }
    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed%this.framesHold===0){
            if(this.framescurrent<this.framesNum-1)
            this.framescurrent++
            else this.framescurrent=0
        }
    }
    update(){
        this.draw()
        this.animateFrames()
    }
}
class fighter extends Sprite{
    constructor({
        position,velocity,
        color,imagesrc,
        scale=1,framesNum=1,
        offset={x:0,y:0},
        sprites,
        attackbox={
            offset:{},width:undefined,height:undefined
        }
    }){
        super({
            position,
            imagesrc,scale,
            framesNum,offset
        })
        this.velocity=velocity
        this.height=150
        this.width=50
        this.lastkey              //for accurate movement of player
        this.attackbox={
            position:{
                x:this.position.x,
                y:this.position.y
            },
            offset:attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        }
        this.color=color
        this.isAttacking
        this.health=100
        this.framescurrent=0
        this.framesElapsed=0      //to moderate speed of animation
        this.framesHold=5
        this.sprites=sprites
        this.dead=false

        for(const sprite in this.sprites){  //adding a new js image object for each sprite
            sprites[sprite].image=new Image()
            sprites[sprite].image.src=sprites[sprite].imagesrc
        }
        console.log(sprites)
    }
    update(){
        this.draw()
        if(!this.dead)
        this.animateFrames()    //to animate sprite
        this.attackbox.position.x=this.position.x+this.attackbox.offset.x
        this.attackbox.position.y=this.position.y+this.attackbox.offset.y
        
        // //drawing attack box
        // c.fillRect(this.attackbox.position.x,this.attackbox.position.y,this.attackbox.width,this.attackbox.height)

        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x

        //gravity function
        if(this.position.y+this.height+this.velocity.y>=canvas.height-95){
            this.velocity.y=0
            this.position.y=331     //to avoid flashing while fall sprite animation
        }else{
            this.velocity.y+=gravity      //adding effect of gravity
        }
    }
    attack(){
        this.switchSprite('attack1')
        this.isAttacking=true
    }
    takehit(){
        this.health-=20
        
        if(this.health<=0){
            this.switchSprite('death')
        }else{
            this.switchSprite('takehit')
        }
    }
    switchSprite(sprite){
        if(this.image===this.sprites.death.image){
            if(this.framescurrent===this.sprites.death.framesNum-1){
                this.dead=true
            }
            return
        }
        //overriding all animation with attack
        if(
            this.image===this.sprites.attack1.image && this.framescurrent<this.sprites.attack1.framesNum-1
        ) return
        
        //overriding all animation with takehit
        if(this.image===this.sprites.takehit.image && this.framescurrent<this.sprites.takehit.framesNum-1
        ) return
        
        switch(sprite){
            case 'idle':
                if(this.image!==this.sprites.idle.image){
                    this.image=this.sprites.idle.image
                    this.framesNum=this.sprites.idle.framesNum
                    this.framescurrent=0   //to avoid flashing as different sprites have different number of frames
                }
                break;
            case 'run':
                if(this.image!==this.sprites.run.image){
                    this.image=this.sprites.run.image
                    this.framesNum=this.sprites.run.framesNum
                    this.framescurrent=0
                }
                break;
            case 'jump':
                if(this.image!==this.sprites.jump.image){
                    this.image=this.sprites.jump.image
                    this.framesNum=this.sprites.jump.framesNum
                    this.framescurrent=0
                }
                break;
            case 'fall':
                if(this.image!==this.sprites.fall.image){
                    this.image=this.sprites.fall.image
                    this.framesNum=this.sprites.fall.framesNum
                    this.framescurrent=0
                }
                break;
            case 'attack1':
                if(this.image!==this.sprites.attack1.image){
                    this.image=this.sprites.attack1.image
                    this.framesNum=this.sprites.attack1.framesNum
                    this.framescurrent=0
                }
                break;
            case 'takehit':
                if(this.image!==this.sprites.takehit.image){
                    this.image=this.sprites.takehit.image
                    this.framesNum=this.sprites.takehit.framesNum
                    this.framescurrent=0
                }
                break;
            case 'death':
                if(this.image!==this.sprites.death.image){
                    this.image=this.sprites.death.image
                    this.framesNum=this.sprites.death.framesNum
                    this.framescurrent=0
                }
                break;
        }
    }
    // draw(){     //used while designing fighter mechanics
    //     c.fillStyle=this.color
    //     c.fillRect(this.position.x,this.position.y,50,this.height)
    
    //     //attack box 
    //     if(this.isAttacking){          //make attack box visible only while attacking
    //         c.fillStyle="green"
    //         c.fillRect(this.attackbox.position.x,this.attackbox.position.y,this.attackbox.width,this.attackbox.height)
    //     }
    // }
}