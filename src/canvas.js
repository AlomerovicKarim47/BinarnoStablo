var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var centarX = window.innerWidth/2
var offsetY = 50
var vel = 80 //duzina i sirina celije grida
var rad = 50 //radius cvorova

var c = canvas.getContext('2d');
var stablo = new Stablo()

var btnInsert = document.getElementById('btnInsert')
var btnPrint = document.getElementById('btnPrint')
var btnGenerisi = document.getElementById('btnGenerisi')
var inputInsert = document.getElementById('inputInsert')

var animPut = null

btnGenerisi.onclick = function(){ 
    stablo.insert(6)
    stablo.insert(9)
    stablo.insert(10)
    stablo.insert(90)
    stablo.insert(89)
    stablo.insert(1)
    stablo.insert(4)
}

btnInsert.onclick = function(){
    var x = parseInt(inputInsert.value)
    animPut = stablo.insert(x)
    inputInsert.value = null
}

btnPrint.onclick = function(){
    stablo.postorder(stablo.korijen, function(x){console.log(x.kljuc, x.x, x.y)})
}

var crtajCvor = function(cvor){
    var x = centarX + cvor.x * vel
    var y = offsetY + cvor.y * vel
    
    if (cvor.roditelj){
        c.beginPath()
        c.moveTo(x, y)
        c.lineTo(centarX + cvor.roditelj.x*vel, offsetY + cvor.roditelj.y*vel)
        c.stroke()
        c.closePath()
    }

    c.beginPath()
    c.arc(x, y, rad, 0, 360)
    c.fillStyle = 'green'
    c.fill()
    c.stroke()
    c.fillStyle = "black"
    c.font =  '8pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(cvor.kljuc + " ("+cvor.x + ", " + cvor.y+") " + cvor.novaPoz, centarX + cvor.x*vel,  offsetY + cvor.y*vel)
    c.closePath()
}

var pomjeriCvorAnimacija = function(cvor){
    if (cvor.x >= 0 && cvor.x < cvor.novaPoz){
        cvor.x += 0.1
    }
    else if (cvor.x <= 0 && cvor.x > cvor.novaPoz){
        cvor.x -= 0.1
    }
    if (cvor. x > 0 && cvor.x >= cvor.novaPoz){
        cvor.x = Math.round(cvor.x)
        cvor.novaPoz = null
    }
    else if (cvor.x < 0 && cvor.x <= cvor.novaPoz){
        cvor.x = Math.round(cvor.x)
        cvor.novaPoz = null
    }
    
}
let radd = 0
var amount = 0;
function crtajPutanjuAnimacija(){   
    //let start = put[i]
    //let end = put [i + 1]
    
    /*radd++
    if (radd > 50)
    return
    c.beginPath()
    c.arc(50, 50, radd, 0, 360)
    c.fillStyle = 'green'
    c.fill()
    c.stroke()
    c.closePath()*/
    let start = {x:50, y:50} //animPut[animIndex]
    let end = {x:100, y:100}//animPut[animIndex + 1]

    
    var done = false
    const crtajLinijuAnimacija = () => {

        amount += 0.05; // change to alter duration
        if (amount >= 1){ 
            console.log("DONE")
            done = true
            return
        }
        c.beginPath()
        //c.clearRect(0, 0, canvas.width, canvas.height);
        c.strokeStyle = "black";
        c.moveTo(start.x, start.y);
        c.lineWidth = 10
        c.lineTo(start.x + (end.x - start.x) * amount, start.y + (end.y - start.y) * amount);
        c.stroke();
        c.closePath()
        requestAnimationFrame(crtajLinijuAnimacija)
    }
    if (done){
        animPut = null
        return
        }
    crtajLinijuAnimacija()

      
}

var animIndex = 0

function crtaj(){
    if (stablo.korijen){
        c.clearRect(0,0, canvas.width, canvas.height)
        if (animPut){
            crtajPutanjuAnimacija()
            //animPut = null
        }
        stablo.postorder(stablo.korijen, crtajCvor)
        if (stablo.pomjeri){
            stablo.postorder(stablo.korijen, pomjeriCvorAnimacija)
            stablo.progres += 0.1
            if (stablo.progres >= 1){
                stablo.progres = 0
                stablo.pomjeri = false
            }
        }
    }
    requestAnimationFrame(crtaj)
    
}

crtaj()
//setInterval(crtaj, 60)