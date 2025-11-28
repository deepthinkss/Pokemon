import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { Link } from "expo-router";
import { Pokemon } from "../types/pokemon";
import { getTypeColor } from "../utils/colors";
import { formatPokemonId, capitalizeFirst } from "../utils/pokemonUtils";
import { colorsByTypeLight } from "../utils/colors";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2 - 8;

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const bgColor = colorsByTypeLight[primaryType] || colorsByTypeLight.normal;
  
  const pokemonImage = pokemon.sprites.other?.["official-artwork"]?.front_default || 
                       pokemon.sprites.front_default || 
                       pokemon.sprites.front_shiny;

  return (
    
    <Link
      href={{
        pathname: "/details",
        params: { name: pokemon.name, id: pokemon.id.toString() },
      }}
      asChild
    >
    
   
      <TouchableOpacity activeOpacity={0.8} style={styles.container}>
        <View style={[styles.containerCard, { backgroundColor: bgColor }]}>
          <View style={styles.contentCard}>
            <View style={styles.header}>
              <Text style={styles.number}>#{formatPokemonId(pokemon.id)}</Text>
            </View>
            
            <Text style={styles.name} numberOfLines={1}>
              {capitalizeFirst(pokemon.name)}
            </Text>
            
            {pokemonImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: pokemonImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            )}
            
            {/* Fixed Types Container */}
            <View style={styles.typesContainer}>
              {pokemon.types.slice(0, 2).map((typeData, index) => (
                <View
                  key={index}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: "rgba(255, 255, 255, 0.5)" }, // More visible white background
                  ]}
                >
                  <Text style={styles.typeText}>
                    {capitalizeFirst(typeData.type.name)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
    marginHorizontal: 4,
    backgroundColor: "transparent",
    gap: 8,
  },
  containerCard: {
    borderRadius: 18,
    margin:0,
    padding: 12,
    height: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 28,
    borderWidth: 0.4,
    
  },
  contentCard: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  number: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily:"fantasy",
    color: "#000000",
    textTransform: "capitalize",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginVertical: 4,
    backgroundColor: "transparent",
  },
  image: {
    width: 100,
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-start", // Align to start
    marginTop: 8, // Add some space above the types
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    minWidth: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    // Removed the problematic marginBottom
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },
});