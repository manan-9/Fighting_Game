function rectcollision({rect1,rect2}){
    return (
        rect1.attackbox.position.x+rect1.attackbox.width>=rect2.position.x 
        && rect1.attackbox.position.x<=rect2.position.x+rect2.width
        && rect1.attackbox.position.y+rect1.attackbox.height>=rect2.position.y 
        && rect1.attackbox.position.y<=rect2.position.y+rect2.height
    )
}

function winner({player,enemy,timerId}){
    clearTimeout(timerId)                     //to make timer stop
    document.querySelector('#display').style.display='flex'              //to make it visible on screen
    if(player.health===enemy.health){
        document.querySelector('#display').innerHTML='Tie'
    }else if(player.health>enemy.health){
        document.querySelector('#display').innerHTML='Player 1 wins'
    }else if(player.health<enemy.health){
        document.querySelector('#display').innerHTML='Player 2 wins'
    }
}

let timer=60
let timerId
function decreaseTimer(){
    if(timer>0){
        timerId=setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#timer').innerHTML=timer
    }
    if(timer===0){
        winner({player,enemy,timerId})
    }
}