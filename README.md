## Code to compile sub projects written in typescript.
I created this code with ability to compile subprojects written in Typescript and including hot loading to initiate application restart. This code can lessen the overhead of opening another terminal to compile another project.

It was private and I decided to make it public. For any developer to use this tool.

### Warn
This project is still under development. Cannot be used at the moment.

### Features
Currently the code has:
- [ ] HotReload
- [ ] Events
- [ ] When updates are in sub project automatically force the application to be restarted.
- [X] The code can create terminal to compile the project.  It creates a shell to run **`tsc -p [path]`** to run Typescript services. To activate watch mode it is necessary to inform in the project settings.
