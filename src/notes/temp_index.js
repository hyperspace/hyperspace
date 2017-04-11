import configs from './src/vtex-audit.json'
import { exec } from 'child_process'
import opn from 'opn'
import osascript from 'node-osascript'

//var exec = require('child_process');

opn('/Users/zehfernandes/Dropbox/docs-Ideas/tasks.md', {app: 'iA Writer', wait: false}).then(() => {
    console.log('b')
    //osascript.execute('tell application "System Events"\ntell application iA Writer\nset {{300, 300}} to size of drawer of window 1\nend tell\nend tell',function(err, result, raw){
    //    if (err) return console.error(err)
    //    console.log(result, raw)
    //});
});

/* osascript.execute(appleScript,function(err, result, raw){
      console.log(err, result, raw)
  })


//var a = "tell application (path to frontmost application as text)\n   (path of document 1) as text\nend tell"
//Checar se configs estão ok
//if file exist


//console.log(configs)



/* Applescript to Shell Variables
    http://apple.stackexchange.com/questions/243378/how-to-pass-a-file-set-as-a-variable-from-applescript-to-a-bash-shell-script
    http://stackoverflow.com/questions/14005362/how-to-change-directory-with-spaces-in-applescript-terminal
*/
