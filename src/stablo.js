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
        while (x != null){
            y = x
            if (z.kljuc < x.kljuc)
                x = x.lijevo
            else x = x.desno
        }
        z.roditelj = y
        if (y == null)
            this.korijen = z
        else if (z.kljuc < y.kljuc)
            y.lijevo = z
        else
            y.desno = z
    }
}