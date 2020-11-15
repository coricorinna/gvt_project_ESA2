const canvas = document.getElementById('canvas');
const gl = canvas.getContext('experimental-webgl');

    // Pipeline setup.
    gl.clearColor(1, 1, 1, 1);

    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);

    // Compile vertex shader.
    const vsSource = '' +
        'attribute vec3 pos;' +
        'attribute vec4 col;' +
        'varying vec4 color;' +
        'void main(){' + 'color = col;' +
        'gl_Position = vec4(pos * 0.9, 1);' +
        '}';
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    // Compile fragment shader.
    const fsSource = 'precision mediump float;' +
        'varying vec4 color;' +
        'void main() {' +
        'gl_FragColor = color;' +
        '}';
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    // Link shader together into a program.
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "pos");
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Vertex data Erweiterung.
    // Positions, Index data.
    let verticesErweiterung, colorsErweiterung, indicesLinesErweiterung, indicesTrisErweiterung;

    // Fill the data arrays.
    createVertexDataEigene();

    // Setup position vertex buffer object.
    const vboPosErweiterung = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPosErweiterung);
    gl.bufferData(gl.ARRAY_BUFFER, verticesErweiterung, gl.STATIC_DRAW);

    // Bind vertex buffer to attribute variable.
    const posAttribErweiterung = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttribErweiterung, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribErweiterung);

    // Setup constant color.
    const vboColErweiterung = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColErweiterung);
    gl.bufferData(gl.ARRAY_BUFFER, colorsErweiterung, gl.STATIC_DRAW);

    // Setup lines index buffer object.
    const iboLinesErweiterung = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLinesErweiterung);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLinesErweiterung, gl.STATIC_DRAW);
    iboLinesErweiterung.numberOfElements = indicesLinesErweiterung.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup tris index buffer object.
    const iboTrisErweiterung = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTrisErweiterung);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTrisErweiterung, gl.STATIC_DRAW);
    iboTrisErweiterung.numberOfElements = indicesTrisErweiterung.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Clear framebuffer and render primitives.
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind vertex buffer to attribute variable.
    const colAttribErweiterung = gl.getAttribLocation(prog, 'col');

    //START EA4 eigene
    // Setup rendering tris.
			gl.vertexAttrib4f(colAttribErweiterung, 0, 0.3, 0.5, 1);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTrisErweiterung);
            gl.drawElements(gl.TRIANGLES,
                iboTrisErweiterung.numberOfElements, gl.UNSIGNED_SHORT, 0);

            // Setup rendering lines.
			gl.vertexAttrib4f(colAttribErweiterung, 0, 0.8, 0.7, 1);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLinesErweiterung);
            gl.drawElements(gl.LINES,
                iboLinesErweiterung.numberOfElements, gl.UNSIGNED_SHORT, 0);

    function createVertexDataEigene() {
        var n = 80;
        var m = 20;
        const A = 0.8;
        var dt = 2*Math.PI / n;
        var dr =  2*Math.PI / m;

        // Counter for entries in index array.
        let iLines = 0;
        let iTris = 0;

        // Positions.
        verticesErweiterung = new Float32Array(3 * (n + 1) * (m + 1));
        colorsErweiterung = new Float32Array(3 * (n + 1) * (m + 1));
        // Index data.
        indicesLinesErweiterung = new Uint16Array(2 * 2 * n * m);
        indicesTrisErweiterung = new Uint16Array(3 * 2 * n * m);

        // Loop angle u.
        for (let i = 0, t = -4; i <= n; i++, t += dt) {
            // Loop height v.
            for (let j = 0, r = -4; j <= m; j++, r += dr) {
                const iVertex = i * (m + 1) + j;
				
                var z= 2*Math.cos(t) + 2*(Math.sin(r)-t);
				var x = A * Math.sin(t) * 2*Math.sin(r);
                var y = 2*Math.cos(t) + 2*Math.sin(r);

				const c= 0.2;
                // Set vertex positions.
                verticesErweiterung[iVertex * 3] = x * 3*c;
                verticesErweiterung[iVertex * 3 + 1] = y * c;
                verticesErweiterung[iVertex * 3 + 2] = z * c/2;

                // Set index.
                // Line on beam.
                if (j > 0 && i > 0) {
                    indicesLinesErweiterung[iLines++] = iVertex - 1;
                    indicesLinesErweiterung[iLines++] = iVertex;
                }
                // Line on ring.
                if (j > 0 && i > 0) {
                    indicesLinesErweiterung[iLines++] = iVertex - (m + 1);
                    indicesLinesErweiterung[iLines++] = iVertex;
                }

                // Set index.
                // Two Triangles.
                if (j > 0 && i > 0) {
                    indicesTrisErweiterung[iTris++] = iVertex;
                    indicesTrisErweiterung[iTris++] = iVertex - 1;
                    indicesTrisErweiterung[iTris++] = iVertex - (m + 1);
                    //
                    indicesTrisErweiterung[iTris++] = iVertex - 1;
                    indicesTrisErweiterung[iTris++] = iVertex - (m + 1) - 1;
                    indicesTrisErweiterung[iTris++] = iVertex - (m + 1);
                }
            }
        }
    }
