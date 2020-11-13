 // Get the WebGL context.
 var canvas = document.getElementById('canvas');
 var gl = canvas.getContext('experimental-webgl');

 // Pipeline setup.
 gl.clearColor(.95, .95, .95, 1);
 
 // Backface culling.
 gl.frontFace(gl.CCW);
 gl.enable(gl.CULL_FACE);
 gl.cullFace(gl.BACK);

 // Compile vertex shader. 
 var vsSource = '' + 
     'attribute vec3 pos;' + 
     'attribute vec4 col;' + 
     'varying vec4 color;' + 
     'void main(){' + 'color = col;' + 
     'gl_Position = vec4(pos, 1);' +
     '}';
 var vs = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vs, vsSource);
 gl.compileShader(vs);

 // Compile fragment shader.
 fsSouce = 'precision mediump float;' + 
     'varying vec4 color;' + 
     'void main() {' + 
     'gl_FragColor = color;' + 
     '}';
 var fs = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fs, fsSouce);
 gl.compileShader(fs);

 // Link shader together into a program.
 var prog = gl.createProgram();
 gl.attachShader(prog, vs);
 gl.attachShader(prog, fs);
 gl.bindAttribLocation(prog, 0, "pos");
 gl.linkProgram(prog);
 gl.useProgram(prog);

 // Vertex data.
 // Positions, index data.
 var vertices, indices;
 // Fill the data arrays.
 createVertexData();

// Setup position vertex buffer object.
 var vboPos = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
 gl.bufferData(gl.ARRAY_BUFFER,
     vertices, gl.STATIC_DRAW);
 // Bind vertex buffer to attribute variable.
 var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3,
     gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(posAttrib);

 // Setup constant color.
 var colAttrib = gl.getAttribLocation(prog, 'col');
 gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);

 // Setup index buffer object.
 var ibo = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
     indices, gl.STATIC_DRAW);
 ibo.numberOfElements = indices.length;

 // Clear framebuffer and render primitives.
 gl.clear(gl.COLOR_BUFFER_BIT);
 gl.drawElements(gl.LINE_STRIP,
     ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);

     function createVertexData(){
        var m = 32;
        var n = m * 3;      
        // Positions.
        vertices = new Float32Array(3 * (n+1));
        // Index data for Linestip.
        indices = new Uint16Array(n+1);

        var dt = 2*Math.PI / m;
        var t = 0;
        var r = 1.0;

        var z = 0;
        for(var i = 0; i <= n; i++, t += dt) {

            r = 1.0 - i/n;
    
            var x = r * Math.cos(t);
            var y = r * Math.sin(t);

            // Set vertex positions.
            vertices[i * 3] = x;
            vertices[i * 3 + 1] = y;
            vertices[i * 3 + 2] = z;

            // Set index.
            indices[i] = i;
        }
    }