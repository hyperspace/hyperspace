var sys = require('sys')
var exec = require('child_process').spawn;

var teste = 'Phoenix'
// log stream --style syslog --predicate 'senderImagePath contains[cd] "${teste}"' --info`

var child = exec("log", ['stream', "--style", "json", "--predicate", "senderImagePath contains[cd] \"Phoenix\"", "--info"]);

//child.unref();
child.stdout.on('data', function (data) {
  console.log(data.toString());
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});


/* import fs from 'fs'

const Tail = require('tail').Tail;
const tail = new Tail("/var/log/system.log");

tail.on("line", function(data) {
  console.log(data)
  if( data.match(/(Phoenix\[\d*\]:)(.*)/) ) {
    console.log('-------------------HEI')
  }
})

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});

const findPattern = (pattern) => {

}
*/
/*const watchFile = () => {
  fs.watchFile('/var/log/system.log', (curr, prev) => {
    console.log(`the current mtime is: ${curr.mtime}`);
    console.log(`the previous mtime was: ${prev.mtime}`);

    console.log(curr)
  })
}

watchFile()
*/
