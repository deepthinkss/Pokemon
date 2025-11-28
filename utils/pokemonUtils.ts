// Utility functions for Pokémon data formatting

export const formatPokemonId = (id: number): string => {
  return `#${String(id).padStart(3, "0")}`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatWeight = (weight: number): string => {
  const kg = weight / 10;
  const lbs = (kg * 2.20462).toFixed(1);
  return `${lbs}lbs (${kg.toFixed(1)} Kg)`;
};

export const formatHeight = (height: number): string => {
  const meters = height / 10;
  const feet = Math.floor(meters * 3.28084);
  const inches = Math.round(((meters * 3.28084) - feet) * 12);
  return `${feet}'${inches.toString().padStart(2, "0")}" (${(meters * 100).toFixed(0)}cm)`;
};

export const getStatColor = (value: number, maxValue: number = 150): string => {
  const percentage = (value / maxValue) * 100;
  if (percentage >= 70) return "#4CAF50"; // Green
  if (percentage >= 50) return "#8BC34A"; // Light green
  if (percentage >= 30) return "#FFC107"; // Yellow
  return "#FF5722"; // Red
};

