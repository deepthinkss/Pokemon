import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Pokemon } from '../types/pokemon';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  existingPokemons: Pokemon[];
}

const { height: screenHeight } = Dimensions.get('window');

export default function SearchModal({ 
  visible, 
  onClose, 
  existingPokemons 
}: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Search through existing pokemons first
      const filtered = existingPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        pokemon.id.toString().includes(query)
      );
      
      // If we have results from local data, use them
      if (filtered.length > 0) {
        setSearchResults(filtered);
      } else {
        // If no local results, try to fetch from API
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
          if (response.ok) {
            const details = await response.json();
            const pokemon: Pokemon = {
              id: details.id,
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
                url: details.species?.url || `https://pokeapi.co/api/v2/pokemon/${details.id}`,
              },
            };
            setSearchResults([pokemon]);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error searching pokemon:", error);
          setSearchResults([]);
        }
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleItemPress = (pokemon: Pokemon) => {
    onClose();
    setSearchQuery("");
    setSearchResults([]);
    
    // Navigate to details screen
    router.push({
      pathname: '/details',
      params: {
        id: pokemon.id.toString(),
        name: pokemon.name
      }
    });
  };

  const renderSearchItem = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity 
      style={styles.searchItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.searchItemLeft}>
        {item.sprites.front_default && (
          <Image 
            source={{ uri: item.sprites.front_default }} 
            style={styles.pokemonImage}
          />
        )}
        <Text style={styles.searchItemName}>{item.name}</Text>
      </View>
      <Text style={styles.searchItemId}>#{item.id.toString().padStart(3, '0')}</Text>
    </TouchableOpacity>
  );

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Pokemon</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus={true}
              />
            </View>

            {searchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff0000" />
              </View>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.searchResults}
                ListEmptyComponent={
                  searchQuery.length >= 2 ? (
                    <Text style={styles.noResults}>No Pokemon found</Text>
                  ) : (
                    <Text style={styles.placeholder}>Type at least 2 characters to search</Text>
                  )
                }
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: "#ffffffff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // For 50% height - use this one
    height: screenHeight * 0.5,
    // For 70% height - uncomment below and comment above
    // height: screenHeight * 0.7,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    backgroundColor: "#ffffffff",
    borderBottomColor: "#fffefeff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchResults: {
    flex: 1,
  },
  searchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pokemonImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  searchItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
  },
  searchItemId: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  placeholder: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});