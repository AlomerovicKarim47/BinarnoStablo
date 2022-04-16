const insertKod = 
`WHILE kljuc NOT NIL
    IF noviKljuc < kljuc
        idi u LIJEVO podstablo
    IF noviKljuc > kljuc
        idi u DESNO podstablo
napravi novi cvor`.split("\n")