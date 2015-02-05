#version 150 core
/**
 * Sobel filter for simple edge detection. 
 * It writes an edgeColor with an alphaValue that depends on the edge intensity.
 *
 * @author Sebastian Schaefer
 * @date 2012
 * @namespace GLSL::Filter::Edge
 * @class Sobel
 */

uniform sampler2D image; ///< the input image
uniform vec3 edgeColor = vec3(0.0, 0.0, 0.0); ///< the color of the edge

in vec2 tex;  ///< texture coordinated
out vec4 color; ///< the color output

/**
 * Calculate the brightness of a rgb-color
 * @param c a rgba-color
 * @return a single value brightness
 */
float gray(vec4 c)
{
  return dot(c.xyz, vec3(0.3, 0.59, 0.11));
}

/**
 * Fetch a 3x3 texture sample from the texture
 * @return an array of a 3x3 neightbourhood around the processed texel
 */
vec4[9] get3x3()
{
  return vec4[9](
    textureOffset(image, tex, ivec2(-1,  1)),
    textureOffset(image, tex, ivec2(-1,  0)), 
    textureOffset(image, tex, ivec2(-1, -1)), 
    
    textureOffset(image, tex, ivec2( 0,  1)), 
    texture(image, tex),
    textureOffset(image, tex, ivec2( 0, -1)),
    
    textureOffset(image, tex, ivec2( 1,  1)), 
    textureOffset(image, tex, ivec2( 1,  0)), 
    textureOffset(image, tex, ivec2( 1, -1)));
}

/**
 * Fetch a 3x3 teture sample and return every color as a gray value
 * @return an array of a 3x3 neighbourhood around the processed texel, converted to grey
 */
vec4[9] get3x3_gray()
{
  vec4[9] tx = get3x3();
  for (int i=0; i < 9; i++)
  {
    tx[i].rgb = vec3(gray(tx[i]));
  }
  return tx;
}

/**
 * Apply a 3x3 filter kernel to a 3x3 neightbourhood of rgba-values
 * @param k  the filter kernel
 * @param tx the 3x3 neighbourhood that should be filtered
 * @return the filtered 3x3 neighbourhood
 */
vec4 applyKernel_3x3(float[9] k, vec4[9] tx)
{
  vec4 res = vec4(0,0,0,1);
  for (int i=0; i <9; i++)
  {
    res += k[i] * tx[i];
  }
  return res;
}

void main()
{
  vec4[9] tx = get3x3();
  
  const float[9] kX = float[9](-1, -2, -1, 0, 0, 0, 1, 2, 1);
  const float[9] kY = float[9](-1, 0, 1, -2, 0, 2, -1, 0, 1);
  
  vec4 gX = applyKernel_3x3(kX, tx);
  vec4 gY = applyKernel_3x3(kY, tx);
  float edge = sqrt(gX.x*gX.x + gY.x*gY.x);

  color.rgb = edgeColor;
  color.a = abs(edge);
}