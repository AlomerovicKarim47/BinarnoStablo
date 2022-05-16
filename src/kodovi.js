const insertKod = 
`WHILE cvor NOT NIL
    IF noviKljuc < cvor.kljuc
        idi u LIJEVO podstablo
    IF noviKljuc > cvor.kljuc
        idi u DESNO podstablo
napravi novi cvor`.split("\n")

const obilazakKod = 
    `IF cvor IS NIL
        RETURN
    OBIĐI cvor
    preOrder(LIJEVO podstablo)
    preOrder(DESNO podstablo)`.split("\n")

const postOrderKod = 
    `IF cvor IS NIL
        RETURN
    postOrder(LIJEVO podstablo)
    postOrder(DESNO podstablo)
    OBIĐI cvor`.split("\n") 

const traziKod = 
    `IF cvor IS NIL
        RETURN
    IF cvor.kljuc == trazeniKljuc
        RETURN cvor
    ELSE IF cvor.kljuc < trazeniKljuc
        trazi DESNO
    ELSE
        trazi LIJEVO`.split("\n")