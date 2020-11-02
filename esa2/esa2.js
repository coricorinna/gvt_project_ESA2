let canvas = document.getElementById('canvas');
let gl = canvas.getContext('experimental-webgl');

gl.clearColor(1, 1, 1, 1);

// Compile a vertex shader
let vsSource = 'attribute vec2 pos;'+
'void main(){gl_Position = vec4(pos * 0.2 - 0.5, 0, 1);'+
'gl_PointSize = 10.0; }';
let vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

fsSouce =  'void main() { gl_FragColor = vec4(0,0,0,1); }'; //Farbe der Linie
let fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

let prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

let vertices = new Float32Array([ 
    7,5,
    7,1,
    0,-1,
    0,-0.5,
    7, 1.5,
    7,-1,
    0,-1,
    0,0, // Quadrate Start
    0,0,
    0,3,
    3,3,
    3,0,
    0.5,0.5,
    0.5,4,
    4,4,
    4,0.5,
    1,1,
    1,5,
    5,5,
    5,1,
    1.5,1.5,
    1.5,6,
    6,6,
    6,1.5,
    2,2,
    2,7,
    7,7,
    7,2, // Quadrate Ende
]);

let vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Bind vertex buffer to attribute variable
let posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_STRIP, 0, 28);