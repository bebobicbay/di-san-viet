import {spawnSync} from 'node:child_process';
import {mkdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const [input,output]=process.argv.slice(2);if(!input||!output){console.error('Usage: npm run optimize-models -- input.glb output.glb');process.exit(1)}
await mkdir(dirname(resolve(output)),{recursive:true});
const cli=resolve('node_modules/@gltf-transform/cli/bin/cli.js');
const result=spawnSync(process.execPath,[cli,'optimize',resolve(input),resolve(output),'--compress','meshopt','--texture-size','1024','--simplify','true'],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);const size=(await stat(output)).size;if(size>3*1048576)console.warn('LOD0 exceeds 3 MB; simplify further.');
