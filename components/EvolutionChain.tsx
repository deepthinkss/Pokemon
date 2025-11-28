import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { EvolutionChain, Pokemon } from "../types/pokemon";
import { capitalizeFirst } from "../utils/pokemonUtils";

interface EvolutionChainProps {
  evolutionChainUrl: string;
  currentPokemonName: string;
}

interface EvolutionStage {
  name: string;
  imageUrl: string | null;
  minLevel: number | null;
}

export default function EvolutionChainComponent({
  evolutionChainUrl,
  currentPokemonName,
}: EvolutionChainProps) {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvolutionChain();
  }, [evolutionChainUrl]);

  const fetchEvolutionChain = async () => {
    try {
      const res = await fetch(evolutionChainUrl);
      const data: EvolutionChain = await res.json();
      
      const stages: EvolutionStage[] = [];
      
      // First stage
      const firstStage = data.chain.species;
      const firstImage = await getPokemonImage(firstStage.name);
      stages.push({
        name: firstStage.name,
        imageUrl: firstImage,
        minLevel: null,
      });

      // Second stage
      if (data.chain.evolves_to.length > 0) {
        const secondStage = data.chain.evolves_to[0].species;
        const secondImage = await getPokemonImage(secondStage.name);
        const secondLevel = data.chain.evolves_to[0].evolution_details[0]?.min_level || null;
        stages.push({
          name: secondStage.name,
          imageUrl: secondImage,
          minLevel: secondLevel,
        });

        // Third stage
        if (data.chain.evolves_to[0].evolves_to.length > 0) {
          const thirdStage = data.chain.evolves_to[0].evolves_to[0].species;
          const thirdImage = await getPokemonImage(thirdStage.name);
          const thirdLevel = data.chain.evolves_to[0].evolves_to[0].evolution_details[0]?.min_level || null;
          stages.push({
            name: thirdStage.name,
            imageUrl: thirdImage,
            minLevel: thirdLevel,
          });
        }
      }

      setEvolutionStages(stages);
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonImage = async (pokemonName: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data: Pokemon = await res.json();
      return data.sprites.other?.["official-artwork"]?.front_default || 
             data.sprites.front_default || null;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (evolutionStages.length <= 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.noEvolution}>This Pokémon does not evolve.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chainContainer}>
        {evolutionStages.map((stage, index) => (
          <View key={stage.name} style={styles.evolutionItem}>
            <View style={styles.pokemonContainer}>
              {stage.imageUrl ? (
                <Image
                  source={{ uri: stage.imageUrl }}
                  style={styles.evolutionImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <Text style={styles.evolutionName} numberOfLines={1}>
                {capitalizeFirst(stage.name)}
              </Text>
            </View>
            {index < evolutionStages.length - 1 && (
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
                {evolutionStages[index + 1]?.minLevel !== null && (
                  <Text style={styles.levelText}>Lv. {evolutionStages[index + 1].minLevel}</Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  chainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  evolutionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  pokemonContainer: {
    alignItems: "center",
    width: 100,
  },
  evolutionImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: "#E0E0E0",
    borderRadius: 40,
    marginBottom: 8,
  },
  evolutionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  arrowContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  arrow: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  levelText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noEvolution: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});

