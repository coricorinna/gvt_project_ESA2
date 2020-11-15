    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('experimental-webgl');

    // Pipeline setup
    gl.clearColor(.95, .95, .95, 1);

    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Polygon offset of rastered Fragments
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);

    // Compile vertex shader
    const vsSource = '' +
        'attribute vec3 pos;' +
        'attribute vec4 col;' +
        'varying vec4 color;' +
        'void main(){' + 'color = col;' +
        'gl_Position = vec4(pos * 0.7, 1);' +
        '}';
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    // Compile fragment shader
    const fsSource = 'precision mediump float;' +
        'varying vec4 color;' +
        'void main() {' +
        'gl_FragColor = color;' +
        '}';
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    // Link shader together into a program
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "pos");
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Start ESA4
    // Vertex data pillow
    // Positions, Index data
    let verticesPillow, colorsPillow, indicesLinesPillow, indicesTrisPillow;

    // Fill the data arrays
    createVertexDataPillow();

    // Setup position vertex buffer object
    const vboPosPillow = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPosPillow);
    gl.bufferData(gl.ARRAY_BUFFER, verticesPillow, gl.STATIC_DRAW);

    // Bind vertex buffer to attribute variable
    const posAttribPillow = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttribPillow, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribPillow);

    // Setup constant color
    const vboColPillow = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColPillow);
    gl.bufferData(gl.ARRAY_BUFFER, colorsPillow, gl.STATIC_DRAW);


    // Setup lines index buffer object
    const iboLinesPillow = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLinesPillow);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLinesPillow, gl.STATIC_DRAW);
    iboLinesPillow.numberOfElements = indicesLinesPillow.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup tris index buffer object
    const iboTrisPillow = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTrisPillow);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTrisPillow, gl.STATIC_DRAW);
    iboTrisPillow.numberOfElements = indicesTrisPillow.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Clear framebuffer and render primitives
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind vertex buffer to attribute variable.
    const colAttribPillow = gl.getAttribLocation(prog, 'col');

    // Setup rendering tris
    gl.vertexAttrib4f(colAttribPillow, 0, 0.1, 0.5, 1); //background color
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTrisPillow);
    gl.drawElements(gl.TRIANGLES, iboTrisPillow.numberOfElements, gl.UNSIGNED_SHORT, 0);

    // Setup rendering lines
    gl.vertexAttrib4f(colAttribPillow, 0, 0.8, 0.7, 1); // lines color
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLinesPillow);
    gl.drawElements(gl.LINES, iboLinesPillow.numberOfElements, gl.UNSIGNED_SHORT, 0);

    function createVertexDataPillow() {
        const n = 30;
        const m = 10;
        const A = 0.2;
        const du = Math.PI / n;
        const dv = 2 * Math.PI / m;

        // Counter for entries in index array.
        let iLines = 0;
        let iTris = 0;

        // Positions.
        verticesPillow = new Float32Array(3 * (n + 1) * (m + 1));
        colorsPillow = new Float32Array(3 * (n + 1) * (m + 1));
        // Index data.
        indicesLinesPillow = new Uint16Array(2 * 2 * n * m);
        indicesTrisPillow = new Uint16Array(3 * 2 * n * m);

        // Loop angle u.
        for (let i = 0, u = 0; i <= n; i++, u += du) {
            // Loop height v.
            for (let j = 0, v = 0; j <= m; j++, v += dv) {
                const iVertex = i * (m + 1) + j;
                const x = A * Math.sin(u) * Math.sin(v);
                const y = Math.cos(u);
                const z = Math.cos(v);

                // Set vertex positions.
                verticesPillow[iVertex * 3] = x;
                verticesPillow[iVertex * 3 + 1] = y;
                verticesPillow[iVertex * 3 + 2] = z;

                // Set index.
                // Line on beam.
                if (j > 0 && i > 0) {
                    indicesLinesPillow[iLines++] = iVertex - 1;
                    indicesLinesPillow[iLines++] = iVertex;
                }
                // Line on ring.
                if (j > 0 && i > 0) {
                    indicesLinesPillow[iLines++] = iVertex - (m + 1);
                    indicesLinesPillow[iLines++] = iVertex;
                }

                // Set index.
                // Two Triangles.
                if (j > 0 && i > 0) {
                    indicesTrisPillow[iTris++] = iVertex;
                    indicesTrisPillow[iTris++] = iVertex - 1;
                    indicesTrisPillow[iTris++] = iVertex - (m + 1);
                    //
                    indicesTrisPillow[iTris++] = iVertex - 1;
                    indicesTrisPillow[iTris++] = iVertex - (m + 1) - 1;
                    indicesTrisPillow[iTris++] = iVertex - (m + 1);
                }
            }
        }
    }

    // Vertex data
    // Positions, index data
    let vertices, colors, indicesLines, indicesTris;
    // Fill the data arrays
    createVertexDataAntisymmetricTorus();

    // Setup position vertex buffer object
    const vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Bind vertex buffer to attribute variable
    const posAttrib = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    // Setup constant color
    //var colAttrib = gl.getAttribLocation(prog, 'col');
    const vboCol = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Bind vertex buffer to attribute variable
    const colAttrib = gl.getAttribLocation(prog, 'col');

    // Setup lines index buffer object
    const iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLines, gl.STATIC_DRAW);
    iboLines.numberOfElements = indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup tris index buffer object
    const iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTris, gl.STATIC_DRAW);
    iboTris.numberOfElements = indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup rendering tris
    gl.vertexAttrib4f(colAttrib, 0.5, 0, 0, 1); // background color
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.drawElements(gl.TRIANGLES, iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

    // Setup rendering lines
    gl.vertexAttrib4f(colAttrib, 1, 0, 1, 1); //lines color
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.drawElements(gl.LINES, iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);


    function createVertexDataAntisymmetricTorus() {
        const n = 40;
        const m = 15;
        const R = 1;
        const r = 0.2;
        const a = 1;
        const du = 2 * Math.PI / n;
        const dv = 2 * Math.PI / m;

        // Counter for entries in index array
        let iLines = 0;
        let iTris = 0;

        // Positions
        vertices = new Float32Array(3 * (n + 1) * (m + 1));
        colors = new Float32Array(3 * (n + 1) * (m + 1));

        // Index data
        indicesLines = new Uint16Array(2 * 2 * n * m);
        indicesTris = new Uint16Array(3 * 2 * n * m);

        // Loop angle u
        for (let i = 0, u = -1; i <= n; i++, u += du) {
            // Loop height v
            for (let j = 0, v = -1; j <= m; j++, v += dv) {
                const iVertex = i * (m + 1) + j;
                const x = (R + r * Math.cos(v) * (a + Math.sin(u))) * Math.cos(u);
                const z = (R + r * Math.cos(v) * (a + Math.sin(u))) * Math.sin(u);
                const y = r * Math.sin(v) * (a + Math.sin(u));

                // Set vertex positions
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

                // Set index
                // Line on beam
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                }
                // Line on ring
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Set index
                // Two Triangles
                if (j > 0 && i > 0) {
                    indicesTris[iTris++] = iVertex;
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                    //
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1) - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                }
            }
        }
        
    }
    