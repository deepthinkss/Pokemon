import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "../types/pokemon";

interface PokedexGridProps {
  pokemons: Pokemon[];
  loading?: boolean;
  onEndReached?: () => void;
}

export default function PokedexGrid({ pokemons, loading, onEndReached }: PokedexGridProps) {
  if (loading && pokemons.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB6C6C" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemons}
      renderItem={({ item }) => <PokemonCard pokemon={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Pokémon found</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        loading && pokemons.length > 0 ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#FB6C6C" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

