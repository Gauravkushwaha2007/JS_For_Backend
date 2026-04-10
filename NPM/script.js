const fs = require('fs');

fs.writeFile("Message.txt", "This is Gaurav from Backend side",((error)=>{
    if(error){
        console.log("File couldn't create");
    }
    else{
        console.log("Done");
    }
}));

fs.rename('./Message.txt', 'msg.txt',((error)=>{if(error){console.log(error)}}));

fs.rm('./Msg.txt',{recursive: true, force: true}, ((e)=>{console.log(e)}))

