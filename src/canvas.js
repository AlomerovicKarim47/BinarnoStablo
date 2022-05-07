var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var centarX = window.innerWidth/3
var offsetY = 50
var vel = 70 //duzina i sirina celije grida
var rad = 30 //radius cvorova

//Za kontrolu animacije putanje
var animPut = null
var putIndex = 0

//Za highlightovanje linije koda
var kod = null
var kodIndex = 0

var c = canvas.getContext('2d');
var stablo = new Stablo()

//Html elementi
var btnInsert = document.getElementById('btnInsert')
var btnObilazak = document.getElementById('btnObilazak')
var btnGenerisi = document.getElementById('btnGenerisi')
var inputInsert = document.getElementById('inputInsert')
var slideBrzina = document.getElementById('slideBrzina')
var textBrzina = document.getElementById('textBrzina')

//Brzine animacije
var brzina = slideBrzina.value //* 0.5
var radInc = 0.5 * brzina
var amountInc = 0.01 * brzina 
var pomInc = 0.1 * brzina

//Slider za brzinu
textBrzina.innerHTML = brzina
slideBrzina.oninput = function(){
    textBrzina.innerHTML = this.value //* 0.5
    brzina = this.value //* 0.5
    radInc = 0.5 * brzina
    amountInc = 0.01 * brzina 
    pomInc = 0.1 * brzina
}


//---------------



btnObilazak.onclick = function(){
    stablo.preorder(stablo.korijen, (x) => console.log(x.kljuc), true)
    animPut = stablo.obilazak
    stablo.obilazak = []
    op = "OB"
}


btnGenerisi.onclick = function(){ 
    stablo.insert(6)
    stablo.insert(9)
    stablo.insert(10)
    stablo.insert(90)
    stablo.insert(89)
    stablo.insert(1)
    stablo.insert(4)
    stablo.novi = null
}

btnInsert.onclick = function(){
    var x = parseInt(inputInsert.value)
    animPut = stablo.insert(x)
    inputInsert.value = null
    op = "INS"
}

var crtajCvor = function(cvor){

    if (stablo.novi && cvor.kljuc == stablo.novi.kljuc)
        return
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
    //c.stroke()
    c.fillStyle = "black"
    c.font =  '15pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(cvor.kljuc /*+ " ("+cvor.x + ", " + cvor.y+") " + cvor.novaPoz*/, centarX + cvor.x*vel,  offsetY + cvor.y*vel)
    c.closePath()
}

var pomjeriCvorAnimacija = function(cvor){
    if (cvor.x >= 0 && cvor.x < cvor.novaPoz){
        cvor.x += pomInc
    }
    else if (cvor.x <= 0 && cvor.x > cvor.novaPoz){
        cvor.x -= pomInc
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

var op = "X"

function crtajPutanjuAnimacija(){
    var cvor = animPut[putIndex]
    if (cvor.radius == rad){
        cvor.amount += amountInc
        if (op == "INS")
            if (stablo.novi.kljuc < cvor.kljuc)
                kodIndex = 2
            else
                kodIndex = 4
    }
    else if (cvor.amount == 0){
        if (putIndex < animPut.length - 1){
            if (op == "INS")
                if (stablo.novi.kljuc < cvor.kljuc)
                    kodIndex = 1
                else
                    kodIndex = 3
        }
        else
            if (op == "INS")
                kodIndex = 5
        cvor.radius += radInc   
    }

    for (var i = 0; i < animPut.length; i++){
        if (i < animPut.length - 1)
            crtajLiniju(animPut[i], animPut[i + 1], animPut[i].amount)
        crtajKrug(animPut[i], animPut[i].radius)

        if (op == "OB"){
            c.beginPath()
            c.font = "30pt Calibri"
            c.fillStyle = "red"
            c.fillText("^", centarX + cvor.x*vel, offsetY + cvor.y*vel+ 50)
            c.closePath()
        }
    }

    if (cvor.radius >= rad)
    {
        cvor.radius = rad
        if (putIndex >= animPut.length-1){
            putIndex = 0
            animPut = null
            stablo.novi = null
            return
        }
        /*if (animPut[putIndex + 1].rezi){
            animPut[putIndex + 1].radius = rad
            putIndex++
            
        }*/
        if (animPut[putIndex + 1].backtrack){
            putIndex++
        }
    }

    if (cvor.amount > 1){
        cvor.amount = 1
        if (putIndex < animPut.length-1)
            putIndex++
    }
}

function crtajLiniju(start, end, amount = 1){

    var startX = centarX + start.x * vel
    var startY = offsetY + start.y * vel

    var endX = centarX + end.x * vel
    var endY = offsetY + end.y * vel
    c.beginPath()
    c.strokeStyle = "red";
    c.moveTo(startX, startY);
    c.lineWidth = 10
    c.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
    c.stroke();
    c.closePath()
}

function crtajKrug(centar, rad){
    c.beginPath()
    c.arc(centarX + centar.x*vel, offsetY + centar.y*vel, rad, 0, 360)
    
    c.fillStyle = 'red'
    c.fill()
    c.fillStyle = "black"
    c.font =  '15pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    if (rad > 0)
        c.fillText(centar.kljuc, centarX + centar.x*vel,  offsetY + centar.y*vel)
    c.closePath()
}

function crtajKod(){
    var i = 0
    insertKod.forEach(l => {
        c.beginPath()
        if (kodIndex == i)
            c.fillStyle = "black"
        else
            c.fillStyle = "white"
        c.fillRect(centarX + 400, offsetY + i*32, 300, 32)
        c.stroke()
        if (kodIndex == i)
            c.fillStyle = "white"
        else
            c.fillStyle = "black"
        c.textAlign = "left"
        c.textBaseline = "top"
        c.fillText(l, centarX + 400, offsetY + i*32)
        c.closePath()
        i++
    });
}

function crtaj(){
    if (stablo.korijen){
        c.clearRect(0,0, canvas.width, canvas.height)
        stablo.postorder(stablo.korijen, crtajCvor)
        if (animPut){          
            crtajKod()
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
