class Cvor{
    constructor(kljuc){
        this.kljuc = kljuc
        this.lijevo = null
        this.desno = null
        this.roditelj = null
    }
}

class Stablo{
    korijen = null
    korijenPomjeranja = null
    novi = null
    insert(kljuc){
        if (!kljuc)
            return
        var z = new Cvor(kljuc)
        var y = null
        var x = this.korijen
        var posX = 0
        var posY = 0
        while (x != null){
            y = x
            if (z.kljuc < x.kljuc){
                x = x.lijevo
                //posX--
            }
            else{ 
                x = x.desno
                //posX++
            }
            posY++
        }
        z.roditelj = y
        if (y == null){
            this.korijen = z
            z.x = 0
        }
        else if (z.kljuc < y.kljuc){
            y.lijevo = z
            z.x = z.roditelj.x - 1
        }
        else{
            y.desno = z
            z.x = z.roditelj.x + 1
        }
        //z.x = posX
        z.y = posY
        this.novi = z
        var c = z
        if (c.roditelj && c.roditelj.lijevo && c.roditelj.lijevo.kljuc == c.kljuc) //ako je lijevo dijete
        {
            while (c.roditelj && c.roditelj.lijevo && c.roditelj.lijevo.kljuc == c.kljuc){ //dok god je lijevo dijete i penje se desno
                c = c.roditelj
            }
            if (c.kljuc != this.korijen.kljuc && c.roditelj.x == z.x){ //ako nismo dosli do korijena i ako se x-evi poklapaju
                this.korijenPomjeranja = c
                
            }
        }
    }
    postorder(x, operacija){
        if (x.lijevo)
            this.postorder(x.lijevo, operacija)
        if (x.desno)
            this.postorder(x.desno, operacija)
        operacija(x)
    }
}