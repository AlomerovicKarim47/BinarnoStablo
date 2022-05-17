const insertKod = 
`WHILE cvor NOT NIL
    IF noviKljuc < cvor.kljuc
        idi u LIJEVO podstablo
    IF noviKljuc > cvor.kljuc
        idi u DESNO podstablo
napravi novi cvor`.split("\n")

const obilazakKod = 
    `IF djeca ARE NIL
        RETURN
    OBIĐI cvor
    preOrder(LIJEVO podstablo)
    preOrder(DESNO podstablo)`.split("\n")

const postOrderKod = 
    `IF djeca ARE NIL
        RETURN
    postOrder(LIJEVO podstablo)
    postOrder(DESNO podstablo)
    OBIĐI cvor`.split("\n")
    
const inOrderKod = 
`IF djeca ARE NIL
    RETURN
inorder(LIJEVO podstablo)
OBIĐI cvor
inorder(DESNO podstablo)`.split("\n")

const traziKod = 
    `IF cvor IS NIL
        RETURN
    IF cvor.kljuc == trazeniKljuc
        RETURN cvor
    ELSE IF cvor.kljuc < trazeniKljuc
        trazi DESNO
    ELSE
        trazi LIJEVO`.split("\n")

const minKod = 
`WHILE x.lijevoDijete NOT NIL
    x = x.lijevoDijete
RETURN x`.split("\n")

const maxKod = 
`WHILE x.desnoDijete NOT NIL
    x = x.desnoDijete
RETURN x`.split("\n")