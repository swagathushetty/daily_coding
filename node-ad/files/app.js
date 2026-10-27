import fs from 'fs/promises'
(async ()=>{
  const createFile = async (path) =>{
    try{
        let existingFileHandle = await fs.open(path,'r')
        existingFileHandle.close()
        return console.log("File already exists");
    }catch(e){
      // we dont have the file already so its safe to create a new file
      console.log("File does not exist, creating a new file");

      const newFileHandle = await fs.open(path,'w')
      console.log("File created successfully");
      newFileHandle.close()
      
    }
    
  }
  const CREATE_FILE_COMMAND = "create a file"

  const commandFileHandler = await fs.open('command.txt','r')

  commandFileHandler.on("change",async ()=>{
     
      // we want to read the content of the file

      // we want to get the size of the file first
      const { size } = await commandFileHandler.stat()
      const buff = Buffer.alloc(size) // create a buffer of the size of the file
      const offset = 0; //means we want to start reading from the beginning of the buffer
      const length = buff.byteLength; // means we want to read the entire file
      const position = 0; // means we want to read from the beginning of the file

      console.log("Size of command.txt: ", size);

      // if we dont pass buffer the default buffer will be used which is 16kb, so if the file is larger than 16kb we will not be able to read the entire file
    
      // we know after calling it, the buffer will be filled so we can just log the buffer to see the content of the file
      await commandFileHandler.read(buff, offset, length, position);
      console.log("Content of command.txt: ", buff.toString('utf-8'));
      const command = buff.toString('utf-8').trim();

      //create a file:
      //create a file <path>
      if(command.includes(CREATE_FILE_COMMAND)){
        const filePath = command.substring(CREATE_FILE_COMMAND.length + 1);
        await createFile(filePath)
      }


  })
  //fs.watch accepts both file and directory path
  const watcher = fs.watch("./command.txt");

  for await(const event of watcher){
    if(event.eventType == "change"){
      await commandFileHandler.emit("change");
      console.log("command.txt has been changed");
     
    }
    // console.log(event);
  }
})();