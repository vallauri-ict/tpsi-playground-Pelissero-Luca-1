let modulo = require('modulo.js');
modulo();

let ris1 = modulo.somma(3, 7);
let ris2 = modulo.moltiplicazione(3, 7);
console.log(ris1, ris2);

console.log(modulo.json.nome);
modulo.json.setNome("Pluto");
console.log(modulo.json.nome);

console.log(modulo.myclass.nome);