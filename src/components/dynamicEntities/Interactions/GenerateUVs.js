// Advanced 3
export function generateUVs(geometry) {
  const uvs = geometry.attributes.uv.array;

  // Размер нового массива (добавляем 2 элемента для первой вершины)
const newSize = uvs.length + 2;

// Создаем новый Float32Array
const newUVs = new Float32Array(newSize);

// Копируем старые UV-координаты в новый массив
newUVs.set(uvs);

// Добавляем первую вершину в конец нового массива
newUVs[newSize - 2] = uvs[0]; // U-координата первой вершины
newUVs[newSize - 1] = uvs[1]; // V-координата первой вершины

  console.log(geometry.attributes.uv, 'uvs')
  let minU = Infinity, maxU = -Infinity;
  let minV = Infinity, maxV = -Infinity;

  for (let i = 0; i < uvs.length; i += 2) {
    const u = uvs[i];
    const v = uvs[i + 1];
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }

  const rangeU = maxU - minU;
  const rangeV = maxV - minV;

  for (let i = 0; i < uvs.length; i += 2) {
    uvs[i] = (uvs[i] - minU) / rangeU;
    uvs[i + 1] = (uvs[i + 1] - minV) / rangeV;
  }
  geometry.attributes.uv.needsUpdate = true;
}
