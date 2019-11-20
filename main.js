import Delaunator from 'delaunator';

(function(HTMLCanvasElement) {


  // 3x3 行列の掛け算
  function multiply(a, b) {
    var m = [];
    for (var i = 0; i < b.length; i += 3)
      for (var j = 0; j < 3; j++)
        m.push(a[j + 0] * b[i + 0] + a[j + 3] * b[i + 1] + a[j + 6] * b[i + 2]);
    return m;
  }

  // 3x3 行列の逆行列
  function inverse(a) {
    var det = a[0] * a[4] * a[8] + a[3] * a[7] * a[2] + a[6] * a[1] * a[5] -
      a[0] * a[7] * a[5] - a[6] * a[4] * a[2] - a[3] * a[1] * a[8];
    return [
      (a[4] * a[8] - a[7] * a[5]) / det,
      (a[7] * a[2] - a[1] * a[8]) / det,
      (a[1] * a[5] - a[4] * a[2]) / det,
      (a[6] * a[5] - a[3] * a[8]) / det,
      (a[0] * a[8] - a[6] * a[2]) / det,
      (a[3] * a[2] - a[0] * a[5]) / det,
      (a[3] * a[7] - a[6] * a[4]) / det,
      (a[6] * a[1] - a[0] * a[7]) / det,
      (a[0] * a[4] - a[1] * a[3]) / det
    ];
  }

  // ベクトルの引き算
  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  }
  // ベクトルの外積
  function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }

  // 三角形と点の内外判定
  function pointWithInTriangle(p, triangle) {
    var v12 = subtract(triangle[1], triangle[0]);
    var v23 = subtract(triangle[2], triangle[1]);
    var v31 = subtract(triangle[0], triangle[2]);
    var v10 = subtract(p, triangle[0]);
    var v20 = subtract(p, triangle[1]);
    var v30 = subtract(p, triangle[2]);
    var c1 = cross(v12, v20);
    var c2 = cross(v23, v30);
    var c3 = cross(v31, v10);
    return ((c1 > 0 && c2 > 0 && c3 > 0) || (c1 < 0 && c2 < 0 && c3 < 0));
  }

  // from から to への変換行列
  function createTransformMatrix(from, to) {
    var m1 = [from[0][0], from[0][1], 1, from[1][0], from[1][1], 1, from[2][0], from[2][1], 1];
    var m2 = [to[0][0], to[0][1], 1, to[1][0], to[1][1], 1, to[2][0], to[2][1], 1];
    return multiply(m2, inverse(m1));
  }



  var getContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function(id, options) {
    var canvas = this;
    if (id !== "morph") return getContext.apply(canvas, [id, options]);

    var gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true
    });
    var pg = this.pg = gl.createProgram();

    (function(shader) {
      gl.shaderSource(shader, "attribute vec4 p;varying vec2 a;uniform vec4 m;void main(){vec4 q=m*p;gl_Position=vec4(q.zw,0,1)+vec4(-1,1,0,0);a=q.xy;}");
      gl.compileShader(shader);
      gl.attachShader(pg, shader);
    })(gl.createShader(gl.VERTEX_SHADER));

    (function(shader) {
      gl.shaderSource(shader, "precision mediump float;uniform sampler2D i;varying vec2 a;void main(){gl_FragColor=texture2D(i,a);}");
      gl.compileShader(shader);
      gl.attachShader(pg, shader);
    })(gl.createShader(gl.FRAGMENT_SHADER));

    gl.linkProgram(pg);
    if (gl.getProgramParameter(pg, gl.LINK_STATUS)) {
      gl.useProgram(pg);
    } else {
      throw new Error(gl.getProgramInfoLog(pg));
    }

    return {
      _coords: null,
      canvas: canvas,
      drawImage: function(image, controlPoints) {
        (function(texture) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        })(gl.createTexture());

        (function(location) {
          gl.uniform4f(location, 1 / image.naturalWidth, 1 / image.naturalHeight, 2 / canvas.width, -2 / canvas.height);
        })(gl.getUniformLocation(pg, "m"));

        var coords = [];
        Delaunator.from(controlPoints).triangles.forEach(function(i) {
          Array.prototype.push.apply(coords, controlPoints[i]);
        });

        this._coords = coords;

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);

        var location = gl.getAttribLocation(pg, "p");
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, coords.length / 4);
      },
      clear: function() {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      },
      getTexturePointAt: function(x, y) {
        var coords = this._coords;
        for (var i = 0; i < coords.length; i += 12) {
          var canvasTriangle = [
            [coords[i + 2], coords[i + 3]],
            [coords[i + 6], coords[i + 7]],
            [coords[i + 10], coords[i + 11]]
          ];
          var textureTriangle = [
            [coords[i + 0], coords[i + 1]],
            [coords[i + 4], coords[i + 5]],
            [coords[i + 8], coords[i + 9]]
          ];
          if (pointWithInTriangle([x, y], canvasTriangle)) {
            var m = createTransformMatrix(canvasTriangle, textureTriangle);
            var q = multiply(m, [x, y, 1]);
            return [q[0], q[1]];
          }
        }
        return null;
      }
    };
  }

})(HTMLCanvasElement);
