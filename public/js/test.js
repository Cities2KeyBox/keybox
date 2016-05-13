/**
 * Created by Oriol on 10/4/16.
 */

var secrets = require('secrets.js');
console.log('\nSecreto Compartido - Shamir\n');

var secreto = 'supersecerto';
// Convierte el texto del secreto a hexadecimal
var secretoHex = secrets.str2hex(secreto); // => 240-bit
// Genera secreto aleatorio de 512-bit en hexadecimal
//var secreto = secrets.random(1024);
var n = 7;
var t = 4;
var i = 0;
console.log('-Secreto:', secreto);
console.log('-Número de shares:', n);
console.log('-Umbral de cooperación:', t);

// Divide el secreto en "n" shares, con un umbral de "t" shares para descifrarlo, añadiendo zero-padding si los shares no llegan a 1024 bits
var shares = secrets.share(secretoHex, n, t, 1024); // => 1024-bit shares
//Muestra por consola  todos los shares
while (i < n) {
    console.log('Share', i,':', shares[i]);
    i++;
}
// Combina los shares (mínimo de "t" para conseguir descifrar el secreto)
//var comb = secrets.combine( [ shares[1], shares[3], shares[7], shares[0] ] );
// Combina toods los shares
//var comb = secrets.combine( shares );
// Combina "x" shares seguidos
var comb = secrets.combine( shares.slice(2,6) );

// Convierte de nuevo a UTF
comb = secrets.hex2str(comb);

console.log('\nCombinación de los shares:', comb);
console.log('Descifrado correctamente:', comb === secreto  ); // => true / false