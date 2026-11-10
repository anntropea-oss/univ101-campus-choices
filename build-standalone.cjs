// Rebuild the portable game after editing source files: node build-standalone.cjs
const fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const page=read('index.html').replace('<link rel="stylesheet" href="styles.css">',()=>`<style>${read('styles.css')}</style>`).replace('<script src="questions.js"></script><script src="app.js"></script>',()=>`<script>${read('questions.js')}</script><script>${read('app.js')}</script>`);
fs.writeFileSync(path.join(__dirname,'UNIV 101 Quiz.html'),page);
console.log('Built UNIV 101 Quiz.html');
