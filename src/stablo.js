class Cvor{
    constructor(kljuc){
        this.kljuc = kljuc
        this.lijevo = null
        this.desno = null
        this.roditelj = null
        this.novaPoz = null
        this.desnoDijete = false
        this.lijevoDijete = false
    }
}

class Stablo{
    korijen = null
    //korijenPomjeranja = null
    pomjeri = false
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
            z.lijevoDijete = true
        }
        else{
            y.desno = z
            z.x = z.roditelj.x + 1
            z.desnoDijete = true
        }
        
        z.y = posY
        this.novi = z

        //provjeri ima li cvorova sa istim x koordinatama 
        var c = z.roditelj
        while (c){
            if (c.x == z.x){
                this.pomjeri = true
                /*if (c.x > 0)
                    c.novaPoz = c.x + 1
                else if (c.x < 0)
                    c.novaPoz = c.x - 1*/
                break
            }
            c = c.roditelj
        }
        //pomjeriti ih ako ih ima
        if (this.pomjeri){
            if (z.lijevoDijete && z.novaPoz == null)
                z.novaPoz = z.x + 1
            c = z.roditelj
            while (c){
                if (c.novaPoz == null)
                    if (c.x > z.x)
                        c.novaPoz = c.x + 1
                    else if (c.x < z.x)
                        c.novaPoz = c.x - 1
                    else if (z.desnoDijete && c.x == z.x){
                        if (c.x > 0)
                            c.novaPoz = c.x + 1
                        else if (c.x < 0)
                            c.novaPoz = c.x - 1
                    }
                c = c.roditelj
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