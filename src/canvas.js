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

btnGenerisi.onclick = function(){ 
    stablo.insert(6)
    stablo.insert(9)
  
    stablo.insert(10)
}

btnInsert.onclick = function(){
    var x = parseInt(inputInsert.value)
    stablo.insert(x)
    inputInsert.value = null //NaN?
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

var pomjeriCvor = function(cvor){
    if (cvor.x > 0 && cvor.x < cvor.novaPoz){
        cvor.x += 0.1
    }
    else if (cvor.x < 0 && cvor.x > cvor.novaPoz){
        cvor.x -= 0.1
    }
    else if (cvor.x >= cvor.novaPoz){
        stablo.korijenPomjeranja = null
        cvor.x = Math.round(cvor.x)
        console.log(cvor.x)
        cvor.novaPoz = null
    }
}

var crtaj = function(){
    if (!stablo.korijen) return
    c.clearRect(0,0, canvas.width, canvas.height)
    if (stablo.korijenPomjeranja){
        if (!stablo.korijenPomjeranja.novaPoz)
            stablo.postorder(stablo.korijenPomjeranja, function(cvor){cvor.novaPoz = cvor.x + 1})
        stablo.postorder(stablo.korijenPomjeranja, pomjeriCvor)
    }
    stablo.postorder(stablo.korijen, crtajCvor)
}
setInterval(crtaj, 60)