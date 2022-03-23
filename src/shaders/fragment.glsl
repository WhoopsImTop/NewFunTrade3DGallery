precision mediump float;
varying mat4 vModelMatrix;
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 * modelMatrix.y);
}