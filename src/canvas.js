var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var stablo = new Stablo()

var btnInsert = document.getElementById('btnInsert')
var inputInsert = document.getElementById('inputInsert')

btnInsert.onclick = function(){
    var x = parseInt(inputInsert.value)
    stablo.insert(x)
    inputInsert.value = null //NaN?
}