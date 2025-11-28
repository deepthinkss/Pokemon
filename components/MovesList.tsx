import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PokemonMove } from "../types/pokemon";
import { capitalizeFirst } from "../utils/pokemonUtils";

interface MovesListProps {
  moves: PokemonMove[];
}

export default function MovesList({ moves }: MovesListProps) {
  // Extract unique move names and sort alphabetically
  const uniqueMoves = Array.from(
    new Set(moves.map((move) => move.move.name))
  ).sort();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.movesGrid}>
        {uniqueMoves.map((moveName, index) => (
          <View key={index} style={styles.moveChip}>
            <Text style={styles.moveText}>{capitalizeFirst(moveName.replace(/-/g, " "))}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },
  movesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 8,
  },
  moveChip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  moveText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
});

