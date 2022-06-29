const ProjectWrapper = require('tsc-compile-projects')


//
// Initialize the code.
//
//
ProjectWrapper.initializeDefault({
  // Hot loading can force application to restart as soon as it receives typescript events from final compilation and finally be restarted.
  //
  // You can disable and track development with automatic compilation.
  'hotReload': true,
  
  // You can return just a string or in array to create more terminal.
  'command': [
    ['node .']
  ],
  
  // This setting is to compile the files calmly. As soon as another terminal finishes compiling the project wait a few seconds and then start another one. 
  // (NOTE: This can take a long time. Depending on the processor type.)
  'lowCpuUsage': true,
  
  // This field was made to select the projects where you want the code to create a terminal to compile that project.
  //
  //
  'targets': [{
      // Name of project.
      'name': "project-1",
      // It is not necessary to leave the name the same. You can put any name on the folder or project.
      'projectDir': './project-1',
      // Watch mode can leave the terminal open to compile things automatically. Once finished compiling finally start/restart the project.
      'watchMode': false,
      // Soon!
      'args': []
    }]
})
