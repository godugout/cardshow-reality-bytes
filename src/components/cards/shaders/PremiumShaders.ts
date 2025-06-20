
// Advanced GLSL shaders for premium card effects

export const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const holographicFragmentShader = `
  uniform sampler2D map;
  uniform float time;
  uniform float intensity;
  uniform vec2 resolution;
  uniform vec3 cameraPosition;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  // Rainbow color function
  vec3 rainbow(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec4 texColor = texture2D(map, vUv);
    
    // Calculate viewing angle
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = dot(vNormal, viewDir);
    fresnel = 1.0 - abs(fresnel);
    
    // Multi-layered interference patterns
    float wave1 = sin(vUv.x * 15.0 + time * 2.0) * cos(vUv.y * 10.0 + time * 1.5);
    float wave2 = sin(vUv.x * 25.0 - time * 1.8) * cos(vUv.y * 20.0 + time * 2.2);
    float wave3 = sin((vUv.x + vUv.y) * 30.0 + time * 3.0);
    
    float combinedWave = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;
    
    // Create shifting rainbow pattern
    vec3 hologram = rainbow(combinedWave + fresnel + time * 0.2) * intensity * fresnel;
    
    // Add sparkle effect
    float sparkle = noise(vUv * 100.0 + time) * noise(vUv * 50.0 - time * 0.5);
    sparkle = smoothstep(0.8, 1.0, sparkle) * fresnel;
    
    // Blend with original texture
    vec3 finalColor = mix(texColor.rgb, texColor.rgb + hologram + sparkle * 0.5, 0.8 * fresnel);
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

export const metallicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vReflect;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 cameraToVertex = normalize(worldPosition - cameraPosition);
    vReflect = reflect(cameraToVertex, worldNormal);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const metallicFragmentShader = `
  uniform sampler2D map;
  uniform samplerCube envMap;
  uniform float metalness;
  uniform float roughness;
  uniform float time;
  uniform vec3 color;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vReflect;
  
  void main() {
    vec4 texColor = texture2D(map, vUv);
    vec4 envColor = textureCube(envMap, vReflect);
    
    // Calculate fresnel
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.0);
    
    // Dynamic chrome ripple effect
    float ripple = sin(vUv.x * 20.0 + time * 3.0) * cos(vUv.y * 15.0 + time * 2.5) * 0.1;
    vec3 perturbedReflect = normalize(vReflect + vec3(ripple));
    vec4 dynamicEnv = textureCube(envMap, perturbedReflect);
    
    // Blend metallic reflection
    vec3 metalColor = mix(texColor.rgb * color, dynamicEnv.rgb, metalness * fresnel);
    metalColor = mix(metalColor, envColor.rgb, roughness * 0.3);
    
    gl_FragColor = vec4(metalColor, texColor.a);
  }
`;

export const energyGlowVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const energyGlowFragmentShader = `
  uniform sampler2D map;
  uniform float time;
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float pulseSpeed;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec4 texColor = texture2D(map, vUv);
    
    // Pulsating energy effect
    float pulse = sin(time * pulseSpeed) * 0.5 + 0.5;
    float edgeGlow = 1.0 - smoothstep(0.0, 0.3, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    
    // Energy waves
    float wave = sin(distance(vUv, vec2(0.5)) * 20.0 - time * 4.0) * 0.5 + 0.5;
    vec3 energy = glowColor * intensity * pulse * (edgeGlow + wave * 0.3);
    
    vec3 finalColor = texColor.rgb + energy;
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;
