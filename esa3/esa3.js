let canvas = document.getElementById('canvas');
let gl = canvas.getContext('experimental-webgl');

gl.clearColor(1, 1, 1, 1);

gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const vsSource = ''+
    'attribute vec3 pos;'+
    'attribute vec4 col;'+
    'varying vec4 color;'+
    'void main(){'+
    'color = col;'+
    'gl_Position = vec4(pos, 1);'+
    '}';
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

const fsSource = 'precision mediump float;'+
    'varying vec4 color;'+
    'void main() {'+
    'gl_FragColor = color;'+
    '}';
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

const vertices = new Float32Array([
    0,0,0,
    0.2,0.5,0,
    0,1,0,
    0.6,0.6,0,
    0.5,0.2,0,
    1,0,0,
    0.5,-0.2,0,
    0.6,-0.6,0,
    0.2,-0.5,0,
    0,-1,0,
    -0.2,-0.5,0,
    -0.6,-0.6,0,
    -0.5,-0.2,0,
    -1,0,0,
    -0.5,0.2,0,
    -0.6,0.6,0,
    -0.2,0.5,0,
    0,1,0,
      
]);

const colors = new Float32Array([
    1, 0, 0, 1, 
    0, 0, 1, 1,
    1, 0, 1, 1, 
    0, 1, 1, 1,
    1, 1, 0, 1,
    0, 1, 1, 1,
    1, 0, 1, 1,
    1, 0, 0, 1, 
    0, 0, 1, 1,
    1, 0, 1, 1, 
    0, 1, 1, 1,
    1, 1, 0, 1,
    0, 1, 1, 1,
    1, 0, 1, 1,
    1, 0, 0, 1, 
    0, 0, 1, 1,
    1, 0, 1, 1, 
    0, 1, 1, 1,
    
]);

const indices = new Uint16Array([
    0,1,2,
    0,3,1,
    0,4,3,
    0,5,4,
    0,6,5,
    0,7,6,
    0,8,7,
    0,9,8,
    0,10,9,
    0,11,10,
    0,12,11,
    0,13,12,
    0,14,13,
    0,15,14,
    0,16,15,
    0,2,16
]);

 const vboPos = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
 gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

 const posAttrib = gl.getAttribLocation(prog, 'pos');
 gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(posAttrib);
 
 const vboCol = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
 gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
 
 const colAttrib = gl.getAttribLocation(prog, 'col');
 gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(colAttrib);

 const ibo = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,
     gl.STATIC_DRAW);
 ibo.numberOfElements = indices.length;

 gl.clear(gl.COLOR_BUFFER_BIT);
 gl.drawElements(gl.TRIANGLES, ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);