// Type definitions for Pokémon data

export interface PokemonType {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: any[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  habitat: {
    name: string;
    url: string;
  } | null;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  evolution_chain: {
    url: string;
  };
  color: {
    name: string;
    url: string;
  };
}

export interface EvolutionChain {
  chain: {
    evolves_to: Array<{
      evolves_to: Array<{
        evolves_to: any[];
        species: {
          name: string;
          url: string;
        };
        evolution_details: Array<{
          min_level: number | null;
          trigger: {
            name: string;
          };
        }>;
      }>;
      species: {
        name: string;
        url: string;
      };
      evolution_details: Array<{
        min_level: number | null;
        trigger: {
          name: string;
        };
      }>;
    }>;
    species: {
      name: string;
      url: string;
    };
    evolution_details: any[];
  };
}

export interface PokemonDetail extends Pokemon {
  speciesData?: PokemonSpecies;
  evolutionChain?: EvolutionChain;
  description?: string;
  habitat?: string;
  eggGroups?: string[];
}

