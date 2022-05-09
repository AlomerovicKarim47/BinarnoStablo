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
    preOrder(cvor.LIJEVO)
    preOrder(cvor.DESNO)`.split("\n")

const traziKod = 
    `IF cvor IS NIL
        RETURN
    IF cvor.kljuc == trazeniKljuc
        RETURN cvor
    ELSE IF cvor.kljuc < trazeniKljuc
        trazi DESNO
    ELSE
        trazi LIJEVO`.split("\n")