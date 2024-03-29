var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var stablo = new Stablo()

//Html elementi
var btnInsert = document.getElementById('btnInsert')
var btnObilazak = document.getElementById('btnObilazak')
var btnPostorder = document.getElementById('btnPostorder')
var btnInorder = document.getElementById('btnInorder')
var btnGenerisi = document.getElementById('btnGenerisi')
var inputInsert = document.getElementById('inputInsert')
var slideBrzina = document.getElementById('slideBrzina')
var textBrzina = document.getElementById('textBrzina')
var inputTrazi = document.getElementById('inputTrazi')
var btnTrazi = document.getElementById('btnTrazi')
var btnUnfreeze = document.getElementById('btnUnfreeze')
var txtInfo = document.getElementById('infoText')
var btnPause = document.getElementById('btnPause')
var slideAnim = document.getElementById('slideAnim')
var btnMin = document.getElementById('btnMin')
var btnMax = document.getElementById('btnMax')

//Pozicije
var centarX = window.innerWidth/3
var offsetY = 80
var velX = 60
var velY = 80 //duzina i sirina celije grida
var rad = 30 //radius cvorova
var ispisX = 1200
var ispisY = 400
var kodX = centarX + 700
var kodY = offsetY
var kodRedSirina = 300
var kodRedVisina = 32
var ispisCelijaVisina = 50
var ispisCelijaSirina = 50

//Za kontrolu animacije putanje
var animPut = null
var putIndex = 0
var freeze = false
//Brzine animacije
var brzina = slideBrzina.value //* 0.5
var radInc = 0.5 * brzina
var amountInc = 0.01 * brzina 
var pomInc = 0.1 * brzina
var amountInc2 = amountInc
var radInc2 = radInc
var pomInc2 = pomInc

//Za highlightovanje linije koda
var kod = null
var kodIndex = 0
//Ispis koda
var op = "X"
var animDio = null

//Boje
var boja1 = "green"
var boja2 = "red"
var boja3 = "white"

//Ispis stabla
var ispis = []

//POmocne fje
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

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
    ispis = []
    for (var i = 0; i < frame; i++){
        animPut[i].amount = 1
        animPut[i].radius = rad
        if ((animPut[i].visited || op == "OB") && !ispis.find((x) => x.kljuc == animPut[i].kljuc)){
            ispis.push({...animPut[i], pos: ispis.length})
        }
    }
    for (var i = frame; i < animPut.length; i++){
        animPut[i].amount = 0
        animPut[i].radius = 0
    }
}

function setButtonsDisable(dis, skipSlide = false){
    btnObilazak.disabled = dis
    btnPostorder.disabled = dis
    btnInorder.disabled = dis
    btnInsert.disabled = dis
    btnTrazi.disabled = dis
    btnUnfreeze.disabled = dis
    btnPause.disabled = !dis
    btnMin.disabled = dis
    btnMax.disabled = dis
    btnGenerisi.disabled = dis
    if (!skipSlide){
        slideAnim.disabled = !dis
        slideAnim.value = 0
        slideAnim.max = animPut.length - 1
    }
}

btnMin.onclick = function(){
    op = "MIN"
    let rez = stablo.minimum()
    animPut = rez.put
    setButtonsDisable(true)
    stablo.obilazak = []
}

btnMax.onclick = function(){
    op = "MAX"
    let rez = stablo.maksimum()
    animPut = rez.put
    setButtonsDisable(true)
    stablo.obilazak = []
}

btnInorder.onclick = function(){
    ispis = []
    op = "IN"
    stablo.inorder(stablo.korijen, () => {}, true)
    animPut = stablo.obilazak
    setButtonsDisable(true)
    stablo.obilazak = []
}

btnObilazak.onclick = function(){
    ispis = []
    op = "OB"
    stablo.preorder(stablo.korijen, (x) => {}, true)
    animPut = stablo.obilazak
    setButtonsDisable(true)
    stablo.obilazak = []
}

btnPostorder.onclick = function(){
    ispis = []
    op = "POST"
    stablo.postorder(stablo.korijen, ()=>{}, true)
    animPut = stablo.obilazak
    setButtonsDisable(true)
    stablo.obilazak = []
}

btnTrazi.onclick = function(){
    if (!stablo.korijen || !inputTrazi.value)
        return
    op = "TRA"
    var x = parseInt(inputTrazi.value)
    var rez = stablo.trazi(stablo.korijen, x)
    animPut = rez.put
    setButtonsDisable(true)
}

btnGenerisi.onclick = function(){
    stablo = new Stablo()
    stablo.insert(getRndInteger(40,60))
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
}

btnUnfreeze.onclick = function(){
    freeze = false
    inputTrazi.value = null
    inputInsert.value = null
    slideAnim.disabled = true
    slideAnim.value = 0
}

btnInsert.onclick = function(){
    op = "INS"
    var x = parseInt(inputInsert.value)
    if (stablo.lista.filter((n) => n.kljuc == x).length > 0)
        return
    animPut = stablo.insert(x)
    setButtonsDisable(true)
}

var crtajCvor = function(cvor){
    if (stablo.novi && cvor.kljuc == stablo.novi.kljuc)
        return
    var x = centarX + cvor.x * velX
    var y = offsetY + cvor.y * velY
    
    if (cvor.roditelj){
        c.beginPath()
        c.moveTo(x, y)
        c.lineWidth = 5
        c.strokeStyle = boja1
        c.lineTo(centarX + cvor.roditelj.x*velX, offsetY + cvor.roditelj.y*velY)
        c.stroke()
        c.closePath()
    }

    c.beginPath()
    c.arc(x, y, rad, 0, 360)
    c.fillStyle = boja1
    c.fill()
    c.fillStyle = boja3
    c.font =  'bold 15pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(cvor.kljuc, centarX + cvor.x*velX,  offsetY + cvor.y*velY)
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
            if (animPut[putIndex].backtrack){
                if (!animPut[putIndex].lijevo && !animPut[putIndex].desno)
                    kodIndex = 1
                else
                    kodIndex = 2
            }
            else
                kodIndex = 2 //obiđi
        }
    }
    else if (op == "POST"){
        if (animDio == "maxRad" && putIndex < animPut.length - 1){
            if (!animPut[putIndex + 1].visited && animPut[putIndex].y < animPut[putIndex + 1].y){
                if (animPut[putIndex + 1].lijevoDijete)
                    kodIndex = 2 //lijevo
                else if (animPut[putIndex + 1].desnoDijete)
                    kodIndex = 3 //desno
            }
        }
        else if (animDio == "amount0NotEnd"){
            if (animPut[putIndex].visited)
                kodIndex = 4 //obidji
            else if (!animPut[putIndex].lijevo && !animPut[putIndex].desno)
                kodIndex = 1
        }
    }
    else if (op == "IN"){
        if (animDio == "maxRad" && putIndex < animPut.length - 1){
            
                if (animPut[putIndex + 1].lijevoDijete)
                    kodIndex = 2 //lijevo
                else if (animPut[putIndex + 1].desnoDijete)
                    kodIndex = 4 //desno
            
        }
        else if (animDio == "amount0NotEnd"){
            if (animPut[putIndex].visited)
                kodIndex = 3 //obidji
            else if (!animPut[putIndex].lijevo && !animPut[putIndex].desno)
                kodIndex = 1
        }
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
    else if (op == "MIN"){
        if (animDio == "maxRad" && putIndex < animPut.length - 1){
            kodIndex = 1
        }
        else if (animDio == "amount0NotEnd"){
            kodIndex = 0
        }
        else if (animDio == "amount0IsEnd"){
            kodIndex = 2
        }
    }
    else if (op == "MAX"){
        if (animDio == "maxRad" && putIndex < animPut.length - 1){
            kodIndex = 1
        }
        else if (animDio == "amount0NotEnd"){
            kodIndex = 0
        }
        else if (animDio == "amount0IsEnd"){
            kodIndex = 2
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
        if (i < animPut.length - 1 && animPut[i + 1] && !animPut[i + 1].rezi)
            crtajLiniju(animPut[i], animPut[i + 1], animPut[i].amount)
        crtajKrug(animPut[i], animPut[i].radius, animPut[i].visited == false?false:true)
        
        if (op == "OB" || op == "POST" || op == "IN" || (op == "TRA" && animPut[putIndex].kljuc == parseInt(inputTrazi.value)) 
            || animPut[putIndex].trazeniM){
            c.beginPath()
            c.font = "30pt Calibri"
            c.fillStyle = boja2
            c.fillText("^", centarX + cvor.x*velX, offsetY + cvor.y*velY+ 50)
            c.font = "15pt Calibri"
            c.closePath()
        }
        
    }

    if (cvor.radius >= rad){
        if ((cvor.visited || op == "OB") && !ispis.find((x) => x.kljuc == cvor.kljuc)){
            ispis.push({...cvor, pos: ispis.length})
        }

        cvor.radius = rad
        if (putIndex >= animPut.length-1){
            btnUnfreeze.disabled = false
            txtInfo.innerHTML = "Animacija gotova. "

            c.beginPath()
            c.font = "13pt Calibri"
            c.fillStyle = boja2
            if (op == "TRA"){
                if (animPut[putIndex].kljuc == parseInt(inputTrazi.value))
                    txtInfo.innerHTML += "Ključ pronađen." //c.fillText("Ključ pronađen", centarX + cvor.x*velX, offsetY + cvor.y*velY+ 70)
                else if (putIndex == animPut.length - 1){
                    txtInfo.innerHTML += "Ključ nije pronađen." //c.fillText("Ključ nije pronađen", centarX + cvor.x*velX, offsetY + cvor.y*velY+ 50)
                }   
            }
            else if (op == "OB" || op == "IN" || op == "POST")
                txtInfo.innerHTML += "Obilazak gotov."
            else if (op == "MIN")
                txtInfo.innerHTML += "Minimum pronađen."
            else if (op == "MAX")
                txtInfo.innerHTML += "Maksimum pronađen."
            else if (op == "INS")
                txtInfo.innerHTML += "Ključ umetnut."
            c.closePath()

            if (!freeze){
                setButtonsDisable(false, true)
                txtInfo.innerHTML = "Nema animacije."
                putIndex = 0
                animPut = null
                stablo.novi = null            
                return
            }
        }
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

function dist(start, end){
    var a = start.x - end.x;
    var b = start.y - end.y;
    var c = Math.sqrt( a*a + b*b );
    return c
}

function crtajLiniju(start, end, amount = 1){
    var startX = centarX + start.x * velX 
    var startY = offsetY + start.y * velY 

    var endX = centarX + end.x * velX 
    var endY = offsetY + end.y * velY 
    c.beginPath()
    c.strokeStyle = boja2
    c.moveTo(startX, startY);
    c.lineWidth = 10
    c.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
    c.stroke();
    c.closePath()
}

function crtajKrug(centar, radd, fill = true){
    c.beginPath()
    if (!fill && radd > rad - 5)
        radd = rad - 5  
    c.arc(centarX + centar.x*velX, offsetY + centar.y*velY, radd, 0, 360)
    c.fillStyle = boja2
    if (fill)
        c.fill()
    else{ 
        c.stroke()
        if (radd > 5){
            c.beginPath()
            c.arc(centarX + centar.x*velX, offsetY + centar.y*velY, radd - 5, 0, 360)
            c.fillStyle = boja1
            c.fill()
            c.closePath()
        }
    }
    c.font =  'bold 15pt Calibri';
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillStyle = boja3
    if (radd > 0)
        c.fillText(centar.kljuc, centarX + centar.x*velX,  offsetY + centar.y*velY)
    c.closePath()
}

var vuci = false
var startKodX = kodX
var startKodY = kodY
var mx, my
var BB = canvas.getBoundingClientRect()
var ofX = BB.left
var ofY = BB.top
var moveTarget = null
canvas.onmousedown = onDown
canvas.onmousemove = onMove
canvas.onmouseup = onUp

function onDown(e){
    e.preventDefault()
    e.stopPropagation()

    mx = parseInt(e.clientX - ofX)
    my = parseInt(e.clientY - ofY) 
    vuci = false

    if (kod && mx > kodX && mx <  kodX + kodRedSirina && my > kodY && my < kodY + kod.length*kodRedVisina){
        vuci = true
        moveTarget = "kod"
    }
    else if (ispis.length > 0 && mx > ispisX && mx < ispisX + ispis.length*ispisCelijaSirina
                && my > ispisY && my < ispisY + ispisCelijaVisina){
        vuci = true
        moveTarget = "ispis"
    }
    else
        moveTarget = "x"

    startKodX = mx
    startKodY = my
}

function onUp(e){
    e.preventDefault()
    e.stopPropagation()
    vuci = false
}

function onMove(e){
    e.preventDefault()
    e.stopPropagation()
    if (vuci){
        mx=parseInt(e.clientX - ofX)
        my=parseInt(e.clientY - ofY)
        var dx = mx - startKodX
        var dy = my - startKodY
        if (moveTarget == "kod"){
            kodX += dx
            kodY += dy
        }
        else if (moveTarget == "ispis"){
            ispisX += dx
            ispisY += dy
        }
    }
}

function crtajKod(){
    var i = 0
    kod = null
    if (op == "INS")
        kod = insertKod
    else if (op == "OB")
        kod = obilazakKod
    else if (op == "TRA")
        kod = traziKod
    else if (op == "POST")
        kod = postOrderKod
    else if (op == "IN")
        kod = inOrderKod
    else if (op == "MIN")
        kod = minKod
    else if (op == "MAX")
        kod = maxKod
    
    if (kod)
        kod.forEach(l => {
            c.beginPath()
            if (kodIndex == i)
                c.fillStyle = boja2
            else
                c.fillStyle = boja1
            c.fillRect(kodX, kodY + i*32, kodRedSirina, kodRedVisina)
            c.stroke()
            if (kodIndex == i)
                c.fillStyle = boja2
            else
                c.fillStyle = boja1
            c.textAlign = "left"
            c.textBaseline = "top"
            c.fillStyle = boja3
            c.fillText(l, kodX, kodY + i*32)
            c.closePath()
            i++
        });
}

function crtajIspis(){
    for (var i = 0; i < ispis.length; i++){
        c.beginPath()
        var ofsx = ispisX
        var ofsy = ispisY
        c.rect(ofsx + ispis[i].pos*ispisCelijaSirina, ofsy, ispisCelijaSirina, ispisCelijaVisina)
        c.fillStyle = boja1
        c.fill()
        c.fillStyle = boja3
        c.font = "bold 15pt calibri"
        c.textAlign = "left"
        c.textBaseline = "top"
        c.fillText(ispis[i].kljuc, ofsx + ispis[i].pos*ispisCelijaSirina + 15, ofsy + 15)  
        c.closePath()
    }
}

function crtaj(){
    if (stablo.korijen){
        c.clearRect(0,0, canvas.width, canvas.height)
        stablo.postorder(stablo.korijen, crtajCvor)
        if (animPut){   
            txtInfo.innerHTML = "Animacija u toku"       
            crtajKod()
            crtajPutanjuAnimacija()
            crtajIspis()
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
    startKodX = mx
    startKodY = my
    requestAnimationFrame(crtaj) 
}

crtaj()
