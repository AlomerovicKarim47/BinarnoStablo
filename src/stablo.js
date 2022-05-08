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
    pomjeri = false
    novi = null
    lista = []
    insert(kljuc){
        if (!kljuc)
            return
        var z = new Cvor(kljuc)
        this.lista.push(z)
        var y = null
        var x = this.korijen
        var posY = 0
        var put = []
        while (x != null){
            y = x
            put.push(x)
            if (z.kljuc < x.kljuc){
                x = x.lijevo
            }
            else{
                x = x.desno
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
        put.push(z)

        //provjeri ima li cvorova sa istim x koordinatama 
        var c = z.roditelj
        while (c){
            if (c.x == z.x){
                this.pomjeri = true
                this.progres = 0
                break
            }
            c = c.roditelj
        }
        //pomjeriti ih ako ih ima
        if (this.pomjeri){
            let pomjeri = function (c){
                if (c.kljuc != z.kljuc){
                    if (c.x > z.x)
                        c.novaPoz = c.x + 1
                    else if (c.x < z.x)
                        c.novaPoz = c.x - 1
                    else if (c.x == z.x && z.desnoDijete &&  c.x > 0)
                        c.novaPoz = c.x + 1
                    else if (c.x == z.x && z.lijevoDijete && c.x < 0)
                        c.novaPoz = c.x - 1
                }
            }
            if (z.x > 0)
                this.postorder(this.korijen.desno, pomjeri)
            else if (z.x < 0)
                this.postorder(this.korijen.lijevo, pomjeri)
            
            if (z.x == 0 && z.lijevoDijete){
                z.novaPoz = 1
                this.postorder(this.korijen.desno, pomjeri)
            }
            else if (z.x == 0 && z.desnoDijete){
                z.novaPoz = -1
                this.postorder(this.korijen.lijevo, pomjeri)
            }

            if (z.x > 0 && z.lijevoDijete)
                z.novaPoz = z.x + 1
            else if (z.x < 0 && z.desnoDijete)
                z.novaPoz = z.x - 1        
        }

        put.forEach((a)=>{
            a.radius = 0
            a.amount = 0
        })
        return put
    }
    obilazak = []
    postorder(x, operacija, napraviPut = false){
        
        /*if (napraviPut){
            if (x.desnoDijete && x.roditelj.lijevo)
                this.obilazak.push({...x.roditelj, radius:0, amount:0, rezi: true})
            this.obilazak.push({...x, radius: 0, amount: 0})
        }*/
        if (x.lijevo)
            this.postorder(x.lijevo, operacija, napraviPut)
        if (x.desno)
            this.postorder(x.desno, operacija, napraviPut)
        operacija(x)
    }

    preorder(x, operacija, napraviPut = false){
        if (napraviPut){
            //if (x.desnoDijete && x.roditelj.lijevo)
            //    this.obilazak.push({...x.roditelj, radius:0, amount:0, rezi: true})
            this.obilazak.push({...x, radius: 0, amount: 0})
        }
        operacija(x)
        if (x.lijevo){
            this.preorder(x.lijevo, operacija, napraviPut)
            this.obilazak.push({...x, radius: 0, amount: 0, backtrack: true})
        }
        if (x.desno){
            this.preorder(x.desno, operacija, napraviPut)
            this.obilazak.push({...x,radius: 0, amount: 0, backtrack: true})
        }
        if (!(x.desno || x.lijevo))
            this.obilazak.push({...x,radius: 0, amount: 0, backtrack: true})
    }

    trazi(x, kljuc, put = []){
        put.push(x)
        if (!x || kljuc == x.kljuc){ 
            var rez = {
                cvor: x, 
                put: put.map((c)=>c={...c, amount:0, radius:0})
            };
            return rez;
        }
        else if (kljuc > x.kljuc)
            return this.trazi(x.desno, kljuc, put)
        else if (kljuc < x.kljuc)
            return this.trazi(x.lijevo, kljuc, put)
    }
}