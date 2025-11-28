import { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import PokedexGrid from "../components/PokedexGrid";
import SearchModal from "../components/SearchModal";
import { Pokemon } from "../types/pokemon";

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  async function fetchPokemons(offsetValue: number = 0) {
    try {
      setLoading(true);
      const limit = 60;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offsetValue}`
      );
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          try {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            const id = details.id || parseInt(pokemon.url.split("/").slice(-2, -1)[0]);

            return {
              id: id,
              name: details.name,
              height: details.height,
              weight: details.weight,
              base_experience: details.base_experience,
              types: details.types,
              stats: details.stats,
              abilities: details.abilities,
              moves: details.moves,
              sprites: {
                front_default: details.sprites?.front_default || null,
                front_shiny: details.sprites?.front_shiny || null,
                back_default: details.sprites?.back_default || null,
                back_shiny: details.sprites?.back_shiny || null,
                other: {
                  "official-artwork": {
                    front_default:
                      details.sprites?.other?.["official-artwork"]?.front_default || null,
                    front_shiny:
                      details.sprites?.other?.["official-artwork"]?.front_shiny || null,
                  },
                  dream_world: {
                    front_default:
                      details.sprites?.other?.dream_world?.front_default || null,
                  },
                },
              },
              species: {
                name: details.species?.name || details.name,
                url: details.species?.url || pokemon.url,
              },
            } as Pokemon;
          } catch (err) {
            console.error(`Error fetching details for ${pokemon.name}:`, err);
            return null;
          }
        })
      );

      const validPokemons = detailedPokemons.filter((p): p is Pokemon => p !== null);

      if (offsetValue === 0) {
        setPokemons(validPokemons);
      } else {
        setPokemons((prev) => [...prev, ...validPokemons]);
      }

      setHasMore(data.next !== null);
    } catch (error) {
      console.error("Error fetching Pokemons:", error);
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const newOffset = offset + 60;
      setOffset(newOffset);
      fetchPokemons(newOffset);
    }
  };

  const handlePokeballPress = () => {
    setSearchModalVisible(true);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    // You can handle the selected pokemon here
    // For example: navigate to detail screen, add to favorites, etc.
    console.log("Selected Pokémon:", pokemon.name);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokeei</Text>
        
          <TouchableOpacity 
            style={styles.pokeballContainer}
            onPress={handlePokeballPress}
          >
            <View style={styles.pokeballOutline}>
              <View style={styles.pokeballTop} />
              <View style={styles.pokeballBottom} />
              <View style={styles.pokeballCenter} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <PokedexGrid pokemons={pokemons} loading={loading} onEndReached={loadMore} />

      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        // onPokemonSelect={handlePokemonSelect}
        existingPokemons={pokemons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  safeArea: {
    backgroundColor: "transparent",
    marginBottom: 8,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    position: "relative",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: "#ffffffff",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderRadius: 28,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 6,
    // elevation: 3,
    marginTop:-0.5,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000ff",
    fontFamily: "System",
    letterSpacing: -0.5,
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 28,
    paddingBottom: 38,
    
  },
  pokeballContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    position: "absolute",
    right: 20,
    top: 28,

  },
  pokeballOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.95)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    overflow: "visible",
    position: "relative",
  },
  pokeballTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderBottomWidth: 2,
    backgroundColor: "rgba(255, 0, 0, 1)",
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
  },
  pokeballBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopWidth: 2,
    borderTopColor: "rgba(0, 0, 0, 0.95)",
    borderBottomEndRadius: 18,
    borderBottomStartRadius: 18,
  },
  pokeballCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginTop: -5,
    marginLeft: -5,
    opacity: 1,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.95)",
  },
});