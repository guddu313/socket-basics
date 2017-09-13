var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X'));
//console.log(now.format('x'));
//You can make comparison with below timestamps
console.log(now.valueOf());

var timestamp = 1505283063619;
var timestampmoment = moment.utc(timestamp);

console.log(timestampmoment.local().format('MMM Do YYYY, h:mmA'));

//now.subtract(1, 'year');
//console.log(now.format());
//console.log(now.format('MMM Do YYYY, h:mmA'));