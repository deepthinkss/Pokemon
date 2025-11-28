import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pokemon, PokemonDetail, PokemonSpecies, EvolutionChain } from "../types/pokemon";
import { getTypeColor } from "../utils/colors";
import { formatPokemonId, capitalizeFirst, formatWeight, formatHeight } from "../utils/pokemonUtils";
import StatsBar from "../components/StatsBar";
import EvolutionChainComponent from "../components/EvolutionChain";
import MovesList from "../components/MovesList";

const { width } = Dimensions.get("window");

type TabType = "About" | "Base Stats" | "Evolution" | "Moves";

export default function Details() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const name = typeof params.name === "string" ? params.name : String(params.name ?? "");
  const idParam = typeof params.id === "string" ? params.id : undefined;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("About");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (name) {
      fetchPokemonDetails(name.toLowerCase());
    }
  }, [name]);

  async function fetchPokemonDetails(pokemonName: string) {
    setLoading(true);
    try {
      // Fetch Pokémon data
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!pokemonRes.ok) throw new Error("Pokemon not found");
      const pokemonData: Pokemon = await pokemonRes.json();

      // Fetch species data for description, habitat, etc.
      let speciesData: PokemonSpecies | null = null;
      try {
        const speciesRes = await fetch(pokemonData.species.url);
        const species: PokemonSpecies = await speciesRes.json();
        speciesData = species;
      } catch (err) {
        console.error("Error fetching species:", err);
      }

      const detail: PokemonDetail = {
        ...pokemonData,
        speciesData: speciesData || undefined,
      };

      setPokemon(detail);
    } catch (err: any) {
      console.error("Error fetching Pokemon details:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB6C6C" />
      </SafeAreaView>
    );
  }

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Pokémon not found</Text>
      </SafeAreaView>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const bgColor = getTypeColor(primaryType);
  const pokemonImage =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    pokemon.sprites.front_shiny;

  // Get English description
  const description =
    pokemon.speciesData?.flavor_text_entries?.find(
      (entry) => entry.language.name === "en"
    )?.flavor_text.replace(/\f/g, " ") || "No description available.";

  // Get habitat
  const habitat = pokemon.speciesData?.habitat?.name
    ? capitalizeFirst(pokemon.speciesData.habitat.name)
    : "Unknown";

  // Get abilities
  const abilities = pokemon.abilities.map((a) => capitalizeFirst(a.ability.name.replace(/-/g, " ")));

  // Get egg groups
  const eggGroups =
    pokemon.speciesData?.egg_groups?.map((eg) => capitalizeFirst(eg.name)) || ["Unknown"];

  // Calculate total stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  // Get stat labels mapping
  const statLabels: Record<string, string> = {
    hp: "Hp",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button and favorite */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFavorite(!favorite)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={24}
              color={favorite ? "#FF1744" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Pokemon name and number */}
        <View style={styles.titleContainer}>
          <Text style={styles.pokemonName}>{capitalizeFirst(pokemon.name)}</Text>
          <Text style={styles.pokemonNumber}>{formatPokemonId(pokemon.id)}</Text>
        </View>

        {/* Type badges */}
        <View style={styles.typesContainer}>
          {pokemon.types.map((typeData) => (
            <View
              key={typeData.type.name}
              style={[styles.typeBadge, { backgroundColor: "rgba(255, 255, 255, 0.25)" }]}
            >
              <Text style={styles.typeText}>{capitalizeFirst(typeData.type.name)}</Text>
            </View>
          ))}
        </View>

        {/* Pokemon image with 3D effect */}
        <View style={styles.imageContainer}>
          {pokemonImage && (
            <Image 
              source={{ uri: pokemonImage }} 
              style={styles.pokemonImage} 
              resizeMode="contain" 
            />
          )}
        </View>

        {/* Content panel with 3D effect */}
        <View style={styles.contentPanel}>
          {/* Shadow effect for 3D look */}
          <View style={styles.panelShadow} />
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {(["About", "Base Stats", "Evolution", "Moves"] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabContentInner}
          >
            {activeTab === "About" && (
              <View style={styles.aboutContainer}>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Weight</Text>
                    <Text style={styles.infoValue}>{formatWeight(pokemon.weight)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Height</Text>
                    <Text style={styles.infoValue}>{formatHeight(pokemon.height)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habitat</Text>
                    <Text style={styles.infoValue}>{habitat}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Abilities</Text>
                    <Text style={styles.infoValue}>{abilities.join(", ")}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Egg Groups</Text>
                    <Text style={styles.infoValue}>{eggGroups.join(", ")}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "Base Stats" && (
              <View style={styles.statsContainer}>
                {pokemon.stats.map((stat, index) => {
                  const statName = stat.stat.name.replace(/-/g, " ");
                  const label = statLabels[stat.stat.name] || capitalizeFirst(statName);
                  return (
                    <StatsBar
                      key={index}
                      label={label}
                      value={stat.base_stat}
                      maxValue={150}
                    />
                  );
                })}
                <View style={styles.totalStatsRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{totalStats}</Text>
                </View>
                <View style={styles.totalBarContainer}>
                  <View
                    style={[
                      styles.totalBar,
                      {
                        width: `${Math.min((totalStats / 600) * 100, 100)}%`,
                        backgroundColor: totalStats >= 400 ? "#4CAF50" : "#FFC107",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {activeTab === "Evolution" && (
              <View style={styles.evolutionContainer}>
                {pokemon.speciesData?.evolution_chain?.url ? (
                  <EvolutionChainComponent
                    evolutionChainUrl={pokemon.speciesData.evolution_chain.url}
                    currentPokemonName={pokemon.name}
                  />
                ) : (
                  <Text style={styles.noEvolution}>Evolution data not available.</Text>
                )}
              </View>
            )}

            {activeTab === "Moves" && <MovesList moves={pokemon.moves} />}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "serif",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  pokemonNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 20,
    zIndex: 10,
    // 3D effect shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  contentPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // Overlap the image for 3D effect
    paddingTop: 50, // Make space for the overlapping image
    position: "relative",
    zIndex: 5,
  },
  panelShadow: {
    position: "absolute",
    top: -18,
 
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E0E0E0",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 8,
  },
  activeTab: {
    borderBottomColor: "#E53935",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: "#E53935",
  },
  tabContent: {
    flex: 1,
  },
  tabContentInner: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aboutContainer: {
    paddingTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 24,
  },
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
  statsContainer: {
    paddingTop: 8,
  },
  totalStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  totalBar: {
    height: "100%",
    borderRadius: 5,
  },
  evolutionContainer: {
    paddingTop: 8,
  },
  noEvolution: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 40,
  },
});