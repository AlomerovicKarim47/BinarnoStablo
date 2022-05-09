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

var freeze = false
var animGotova = true

//Html elementi
var btnInsert = document.getElementById('btnInsert')
var btnObilazak = document.getElementById('btnObilazak')
var btnGenerisi = document.getElementById('btnGenerisi')
var inputInsert = document.getElementById('inputInsert')
var slideBrzina = document.getElementById('slideBrzina')
var textBrzina = document.getElementById('textBrzina')
var inputTrazi = document.getElementById('inputTrazi')
var btnTrazi =document.getElementById('btnTrazi')
var btnUnfreeze = document.getElementById('btnUnfreeze')
var txtInfo = document.getElementById('infoText')
var btnPause = document.getElementById('btnPause')
var slideAnim = document.getElementById('slideAnim')

//Brzine animacije
var brzina = slideBrzina.value //* 0.5
var radInc = 0.5 * brzina
var amountInc = 0.01 * brzina 
var pomInc = 0.1 * brzina

var amountInc2 = amountInc
var radInc2 = radInc
var pomInc2 = pomInc

//Slider za brzinu
textBrzina.innerHTML = brzina
slideBrzina.oninput = function(){
    textBrzina.innerHTML = this.value
    brzina = this.value
    if (radInc > 0){
        radInc = 0.5 * brzina
        amountInc = 0.01 * brzina 
        pomInc = 0.1 * brzina
        radInc2 = radInc
        amountInc2 = amountInc
        pomInc2 = pomInc
    }
    else{
        radInc2 = 0.5 * brzina
        amountInc2 = 0.01 * brzina 
        pomInc2 = 0.1 * brzina
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

btnPause.onclick = function(){
    if (btnPause.innerHTML == "Pauziraj"){
        btnPause.innerHTML = "Nastavi"
        radInc = 0
        amountInc = 0
    }
    else{
        btnPause.innerHTML = "Pauziraj"
        radInc = radInc2
        amountInc = amountInc2
        pomInc = pomInc2
    }
}

slideAnim.oninput = function(){
    let frame = parseInt(this.value)
    putIndex = frame
    if (frame < animPut.length)
        btnUnfreeze.disabled = true
    for (var i = 0; i < frame; i++){
        animPut[i].amount = 1
        animPut[i].radius = rad
    }
    for (var i = frame; i < animPut.length; i++){
        animPut[i].amount = 0
        animPut[i].radius = 0
    }
}

btnObilazak.onclick = function(){
    op = "OB"
    stablo.preorder(stablo.korijen, (x) => {}, true)
    animPut = stablo.obilazak
    slideAnim.disabled = false
    slideAnim.value = 0
    slideAnim.max = animPut.length - 1
    stablo.obilazak = []
    btnObilazak.disabled = true
    btnInsert.disabled = true
    btnTrazi.disabled = true
    btnUnfreeze.disabled = true
    btnPause.disabled = false
}

btnTrazi.onclick = function(){
    if (!stablo.korijen || !inputTrazi.value)
        return
    op = "TRA"
    var x = parseInt(inputTrazi.value)
    var rez = stablo.trazi(stablo.korijen, x)
    animPut = rez.put
    slideAnim.max = animPut.length - 1
    slideAnim.disabled = false
    slideAnim.value = 0
    //inputTrazi.value = null
    btnObilazak.disabled = true
    btnInsert.disabled = true
    btnGenerisi.disabled = true
    btnUnfreeze.disabled = true
    btnTrazi.disabled = true
    inputInsert.disabled = true
    inputTrazi.disabled = true
    btnPause.disabled = false
}

btnGenerisi.onclick = function(){
    
    for (var i = 0; i < 9; i++){
        var x = getRndInteger(0,100)
        if (stablo.lista.filter((n) => n.kljuc == x).length > 0)
            continue
        stablo.insert(x)
        //izbjegni animaciju
        if (stablo.pomjeri && !animPut){
            while (stablo.pomjeri){
            stablo.postorder(stablo.korijen, pomjeriCvorAnimacija)
            stablo.progres += 0.1
            if (stablo.progres >= 1){
                stablo.progres = 0
                stablo.pomjeri = false
            }
            }
        }
    }
    stablo.novi = null
    
    btnGenerisi.disabled = true
}

btnUnfreeze.onclick = function(){
    freeze = false
    inputTrazi.value = null
    inputInsert.value = null
    slideAnim.disabled = true
    slideAnim.value = 0
    //animPut = null
    /*for (var i = 0; i < animPut.length; i++){
        animPut[i].amount = 0
        animPut[i].rad = 0
    }*/
}

btnInsert.onclick = function(){

    op = "INS"
    var x = parseInt(inputInsert.value)
    if (stablo.lista.filter((n) => n.kljuc == x).length > 0)
        return
    animPut = stablo.insert(x)
    slideAnim.disabled = false
    slideAnim.max = animPut.length - 1
    slideAnim.value = 0
    //inputInsert.value = null
    
    btnInsert.disabled = true
    btnObilazak.disabled = true
    btnGenerisi.disabled = true
    btnTrazi.disabled = true
    btnUnfreeze.disabled = true
    inputInsert.disabled = true
    inputTrazi.disabled = true
    btnPause.disabled = false
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
var animDio = null

function azurirajKodIndex(cvor){
    if (op == "INS"){
        if (animDio == "maxRad"){ 
            if (!cvor.desno && !cvor.lijevo)
                return
            else if (stablo.novi.kljuc < cvor.kljuc)
                kodIndex = 2
            else
                kodIndex = 4
        }
        else if (animDio == "amount0NotEnd"){   
            if (stablo.novi.kljuc < cvor.kljuc)
                kodIndex = 1
            else
                kodIndex = 3
        }
        else if (animDio == "amount0IsEnd"){
            kodIndex = 5
        }
    }
    else if (op == "OB"){
        if (animDio == "maxRad" && putIndex < animPut.length - 1){
            if (animPut[putIndex + 1].lijevoDijete)
                kodIndex = 3 //lijevo
            else if (animPut[putIndex + 1].desnoDijete)
                kodIndex = 4 //desno
        }
        else if (animDio == "amount0NotEnd"){
            if (animPut[putIndex].backtrack)
                kodIndex = 1
            else
                kodIndex = 2 //obiđi
        }
        else if (animDio == "amount0IsEnd")
            kodIndex = 1 //return
    }
    else if (op == "TRA"){
        var trazeno = parseInt(inputTrazi.value)
        if (animDio == "maxRad" ){
            if (putIndex < animPut.length - 1){
                if (animPut[putIndex + 1].lijevoDijete)
                    kodIndex = 7 //trazi lijevo
                else if (animPut[putIndex + 1].desnoDijete)
                    kodIndex = 5 //traziDesno
            }
            else{
                if (animPut[putIndex].kljuc == trazeno)
                    kodIndex = 3
                else 
                    kodIndex = 1
            }
        }
        else if (animDio == "amount0NotEnd"){
            if (animPut[putIndex + 1].lijevoDijete)
                kodIndex = 6 //if cvor < trazeno
            else if (animPut[putIndex + 1].desnoDijete)
                kodIndex = 4 //if cvor > trazeno
            
        }
        else if (animDio == "amount0IsEnd"){
            if (animPut[putIndex].kljuc == trazeno)
                kodIndex = 2 // if cvor == trazeno
            else
                kodIndex = 0
        }
    }
}

function crtajPutanjuAnimacija(){
    var cvor = animPut[putIndex]
    if (cvor.radius == rad){
        cvor.amount += amountInc
        animDio = "maxRad"
    }
    else if (cvor.amount == 0){
        if (putIndex < animPut.length - 1){
            animDio = "amount0NotEnd"
        }
        else
            animDio = "amount0IsEnd"
        cvor.radius += radInc   
    }

    azurirajKodIndex(cvor)
    
    for (var i = 0; i < animPut.length; i++){
        if (i < animPut.length - 1)
            crtajLiniju(animPut[i], animPut[i + 1], animPut[i].amount)
        crtajKrug(animPut[i], animPut[i].radius)

        if (op == "OB" || (op == "TRA" && animPut[putIndex].kljuc == parseInt(inputTrazi.value))){
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
            btnUnfreeze.disabled = false
            txtInfo.innerHTML = "Animacija gotova"
            if (!freeze){
                btnInsert.disabled = false
                btnObilazak.disabled = false
                btnTrazi.disabled = false
                btnUnfreeze.disabled = true
                inputInsert.disabled = false
                inputTrazi.disabled = false
                btnPause.disabled = true
                txtInfo.innerHTML = "Nema animacije"
                putIndex = 0
                animPut = null
                stablo.novi = null            
                return
            }
        }
        /*if (animPut[putIndex + 1].rezi){
            animPut[putIndex + 1].radius = rad
            putIndex++
            
        }*/
        if (putIndex < animPut.length - 1 && animPut[putIndex + 1].backtrack){
            putIndex++
            slideAnim.value = putIndex
        }
        else
            freeze = true
    }

    if (cvor.amount > 1){
        cvor.amount = 1
        if (putIndex < animPut.length-1)
            putIndex++
            slideAnim.value = putIndex
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
    var kod = null
    if (op == "INS")
        kod = insertKod
    else if (op == "OB")
        kod = obilazakKod
    else if (op == "TRA")
        kod = traziKod
    
    if (kod)
        kod.forEach(l => {
            c.beginPath()
            if (kodIndex == i)
                c.fillStyle = "black"
            else
                c.fillStyle = "white"
            c.fillRect(centarX + 700, offsetY + i*32, 300, 32)
            c.stroke()
            if (kodIndex == i)
                c.fillStyle = "white"
            else
                c.fillStyle = "black"
            c.textAlign = "left"
            c.textBaseline = "top"
            c.fillText(l, centarX + 700, offsetY + i*32)
            c.closePath()
            i++
        });
}

function crtaj(){
    if (stablo.korijen){
        c.clearRect(0,0, canvas.width, canvas.height)
        stablo.postorder(stablo.korijen, crtajCvor)
        if (animPut){   
            txtInfo.innerHTML = "Animacija u toku"       
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
