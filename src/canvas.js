var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var centarX = window.innerWidth/2
var offsetY = 50
var vel = 70 //duzina i sirina celije grida
var rad = 30 //radius cvorova

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
        c.lineWidth = 1
        c.strokeStyle = "black"
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
    c.font =  '15pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(cvor.kljuc /*+ " ("+cvor.x + ", " + cvor.y+") " + cvor.novaPoz*/, centarX + cvor.x*vel,  offsetY + cvor.y*vel)
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
function crtajPutanjuAnimacija(){
    var cvor = animPut[putIndex]
    if (cvor.radius == rad){
        cvor.amount += 0.03
    }
    else if (cvor.amount == 0)
        cvor.radius += 0.5   

    for (var i = 0; i < animPut.length; i++){
        crtajKrug(animPut[i], animPut[i].radius)
        if (i < animPut.length - 1)
            crtajLiniju(animPut[i], animPut[i + 1])
    }

    if (cvor.radius > rad)
        cvor.radius = rad

    if (cvor.amount > 1){
        cvor.amount = 1
        if (putIndex < animPut.length-1)
            putIndex++
        else{
            putIndex = 0
            animPut = null
        }
    }
}

function crtajLiniju(start, end){

    var startX = centarX + start.x * vel
    var startY = offsetY + start.y * vel

    var endX = centarX + end.x * vel
    var endY = offsetY + end.y * vel
    c.beginPath()
    c.strokeStyle = "red";
    c.moveTo(startX, startY);
    c.lineWidth = 10
    c.lineTo(startX + (endX - startX) * start.amount, startY + (endY - startY) * start.amount);
    c.stroke();
    c.closePath()
}

function crtajKrug(centar, rad){
    c.beginPath()
    c.arc(centarX + centar.x*vel, offsetY + centar.y*vel, rad, 0, 360)
    
    c.fillStyle = 'red'
    c.fill()
    //c.fillStyle = "black"
    ////c.font =  '15pt Calibri';
    //c.textAlign = "center"
    //c.textBaseline = "middle"
    //c.fillText(cvor.kljuc /*+ " ("+cvor.x + ", " + cvor.y+") " + cvor.novaPoz*/, centarX + cvor.x*vel,  offsetY + cvor.y*vel)
    c.closePath()
}

var putIndex = 0

function crtaj(){
    if (stablo.korijen){
        c.clearRect(0,0, canvas.width, canvas.height)
        
        stablo.postorder(stablo.korijen, crtajCvor)
        if (animPut){
            crtajPutanjuAnimacija()
        }
        if (stablo.pomjeri && !animPut){ //Pomjeri samo ako je animacija puta gotova
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