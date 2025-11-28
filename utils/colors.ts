// Updated color palette to match reference image specifications
export const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#FB6C6C",
  water: "#76BEFE",
  electric: "#FFD76F",
  grass: "#48D0B0",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#3B3B3B",
  steel: "#B7B7CE",
  fairy: "#F6A7F7",
};
export const colorsByTypeLight: Record<string, string> = {
  normal: "#C6C2A6",
  fire: "#FF9A9A",
  water: "#A0DFFF",
  electric: "#FFE699",
  grass: "#7AEFC1",
  ice: "#CDEFF0",
  fighting: "#E77670",
  poison: "#D685D1",  
  ground: "#EBDCA8",
  flying: "#C6B7F5",
  psychic: "#FFA1B8",
  bug: "#C8D98D",
  rock: "#D8C99E",
  ghost: "#9F86C6",
  dragon: "#A890F0",
  dark: "#6F6F6F",
  steel: "#D1D1E8",
  fairy: "#FFCEF9",
};

export const getTypeColor = (type: string): string => {
  return colorsByType[type.toLowerCase()] || "#A8A77A";
};

export const getLightColor = (type: string): string => {
  return colorsByTypeLight[type.toLowerCase()] || "#A8A77A";
};

export const getGradientColors = (type: string): string[] => {
  const baseColor = getTypeColor(type);
  // Return base color and a lighter variant for gradients
  return [baseColor, `${baseColor}CC`];
};
export const getDarkColors = (type: string): string[] => {
  const baseColor = getLightColor(type);
  // Return base color and a lighter variant for gradients
  return [baseColor, `${baseColor}CC`];
};

