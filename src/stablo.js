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
                posX--
            }
            else{ 
                x = x.desno
                posX++
            }
            posY++
        }
        z.roditelj = y
        if (y == null)
            this.korijen = z
        else if (z.kljuc < y.kljuc)
            y.lijevo = z
        else
            y.desno = z
        z.x = posX
        z.y = posY
    }
    postorder(x, operacija){
        if (x.lijevo)
            this.postorder(x.lijevo, operacija)
        if (x.desno)
            this.postorder(x.desno, operacija)
            operacija(x)
    }
}