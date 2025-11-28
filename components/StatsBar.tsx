import { View, Text, StyleSheet } from "react-native";
import { getStatColor } from "../utils/pokemonUtils";

interface StatsBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export default function StatsBar({ label, value, maxValue = 150 }: StatsBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const barColor = getStatColor(value, maxValue);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textTransform: "capitalize",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  barContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
});

