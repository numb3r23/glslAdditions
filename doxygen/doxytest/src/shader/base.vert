#version 150
/**
 * A vertex shader to render a screenaligned quad a
 * @author Sebastian Schaefer
 * @date 2012
 * @namespace GLSL::Filter
 * @class BaseFilterVertexShader
 */

in vec4 vertex;     ///< Vertex position
in vec2 texCoord;   ///< Texture Coordinate

out vec2 tex;       ///< Texture Coordinate
out vec2 pos;       ///< Projected vertex position

void main(void)
{
  gl_Position = vertex;
  tex = texCoord;
  pos = vertex.xy*0.5 + vec2(0.5);
}
