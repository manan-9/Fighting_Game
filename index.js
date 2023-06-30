const canvas=document.querySelector("canvas")
const c=canvas.getContext('2d')

canvas.width=1024
canvas.height=576
c.fillRect(0,0,canvas.width,canvas.height)

const gravity=0.7

const background=new Sprite({
    position:{
        x:0,
        y:0
    },
    imagesrc:'./img/background.png'
})
const shop=new Sprite({
    position:{
        x:620,
        y:130
    },
    imagesrc:'./img/shop.png',
    scale:2.75,
    framesNum:6
})
const player=new fighter({
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    color:"red",
    offset:{
        x:0,
        y:0
    },
    imagesrc:'./img/samuraiMack/Idle.png',
    framesNum:8,
    scale:2.5,
    offset:{       //taking care of image padding
        x:215,
        y:158
    },
    sprites:{
        idle:{
            imagesrc:'./img/samuraiMack/Idle.png',
            framesNum:8
        },
        run:{
            imagesrc:'./img/samuraiMack/Run.png',
            framesNum:8
            // image: new Image()
        },
        jump:{
            imagesrc:'./img/samuraiMack/Jump.png',
            framesNum:2
            // image: new Image()
        },
        fall:{
            imagesrc:'./img/samuraiMack/Fall.png',
            framesNum:2
        },
        attack1:{
            imagesrc:'./img/samuraiMack/Attack1.png',
            framesNum:6
        },
        takehit:{
            imagesrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            framesNum:4
        },
        death:{
            imagesrc:'./img/samuraiMack/Death.png',
            framesNum:6
        }
    },
    attackbox:{
        offset:{
            x:100,
            y:50
        },
        width:140,
        height:50
    }
})
const enemy=new fighter({
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color:'blue',
    offset:{
        x:-50,            //attackbox must protude towards left
        y:0
    },
    imagesrc:'./img/kenji/Idle.png',
    framesNum:4,
    scale:2.5,
    offset:{       //taking care of image padding
        x:215,
        y:170
    },
    sprites:{
        idle:{
            imagesrc:'./img/kenji/Idle.png',
            framesNum:4
        },
        run:{
            imagesrc:'./img/kenji/Run.png',
            framesNum:8
            // image: new Image()
        },
        jump:{
            imagesrc:'./img/kenji/Jump.png',
            framesNum:2
            // image: new Image()
        },
        fall:{
            imagesrc:'./img/kenji/Fall.png',
            framesNum:2
        },
        attack1:{
            imagesrc:'./img/kenji/Attack1.png',
            framesNum:4
        },
        takehit:{
            imagesrc:'./img/kenji/Take hit.png',
            framesNum:3
        },
        death:{
            imagesrc:'./img/kenji/Death.png',
            framesNum:7
        }
    },
    attackbox:{
        offset:{
            x:-160,
            y:50
        },
        width:160,
        height:50
    }
})
const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle="black"
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle='rgba(255,255,255,0.05)'    //adding a white overlay to contrast enemy and player wrt background
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()
    player.velocity.x=0       //player must stop if no key pressed
    enemy.velocity.x=0

    //player movement
    
    if(keys.a.pressed && player.lastkey==='a'){         //for better player movement
        player.velocity.x=-5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastkey==='d'){
        player.velocity.x=5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')                 //setting back to idle
    }

    //jumping and falling
    if(player.velocity.y<0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey==='ArrowLeft'){         //for better enemy movement
        enemy.velocity.x=-5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastkey==='ArrowRight'){
        enemy.velocity.x=5
        enemy.switchSprite('run')
    }else{
         enemy.switchSprite('idle')
    }
    
    //jumping and falling
    if(enemy.velocity.y<0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }

    //detect collisions
    //player attacks
    if(rectcollision({
            rect1:player,
            rect2:enemy
        }) && player.isAttacking && player.framescurrent===4){
        enemy.takehit()
        player.isAttacking=false
        // document.querySelector('#enemyhealth').style.width=enemy.health+'%'
        gsap.to('#enemyhealth',{
            width: enemy.health+'%'
        })
    }
    //player misses
    if(player.isAttacking && player.framescurrent===4){
        player.isAttacking=false
    }

    //enemy attacks, player hit
    if(rectcollision({
            rect1:enemy,
            rect2:player
        }) && enemy.isAttacking && enemy.framescurrent===2){
        player.takehit()
        enemy.isAttacking=false            //as each attack must be counted once
        // document.querySelector('#playerhealth').style.width=player.health+'%'
        gsap.to('#playerhealth',{
            width: player.health+'%'
        })
    }
    //enemy misses
    if(enemy.isAttacking && enemy.framescurrent===2){
        enemy.isAttacking=false
    }
    //end game condition due to health
    if(enemy.health<=0 || player.health<=0){
        winner({player,enemy,timerId})
    }
}
animate()

window.addEventListener('keydown',(event)=>{
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed=true
                player.lastkey='d'
                break;
            case 'a':
                keys.a.pressed=true
                player.lastkey='a'
                break;
            case 'w':
                player.velocity.y=-20
                break;
            case ' ':
                player.attack()
                break;
        }
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed=true
                enemy.lastkey='ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed=true
                enemy.lastkey='ArrowLeft'
                break;
            case 'ArrowUp':
                enemy.velocity.y=-20
                break;
            case 'ArrowDown':
                enemy.attack()
                break;
        }
    }
})
window.addEventListener('keyup',(event)=>{
    //player keys
    switch(event.key){
        case 'd':
            keys.d.pressed=false
            break;
        case 'a':
            keys.a.pressed=false
            break;
    }
    //enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed=false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false
            break;
    }
})