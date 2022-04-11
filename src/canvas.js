var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var centarX = window.innerWidth/2
var offsetY = 50
var vel = 32 //duzina i sirina celije grida
var rad = 15 //radius cvorova

var c = canvas.getContext('2d');
var stablo = new Stablo()

var btnInsert = document.getElementById('btnInsert')
var btnPrint = document.getElementById('btnPrint')
var btnGenerisi = document.getElementById('btnGenerisi')
var inputInsert = document.getElementById('inputInsert')

btnGenerisi.onclick = function(){ 
    stablo.insert(6)
    stablo.insert(3)
    stablo.insert(4)
    stablo.insert(5)
    stablo.insert(2)
    stablo.insert(9)
    stablo.insert(8)
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
    c.font = rad + 'pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(cvor.kljuc, centarX + cvor.x*vel,  offsetY + cvor.y*vel)
    c.closePath()
}

var crtaj = function(){
    if (!stablo.korijen) return
    stablo.postorder(stablo.korijen, crtajCvor)
}

setInterval(crtaj, 150)