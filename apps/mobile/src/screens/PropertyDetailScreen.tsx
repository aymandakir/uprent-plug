import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { MapPin, BedDouble } from "lucide-react-native";

export default function PropertyDetailScreen({ route }: any) {
  const { property } = route.params || {};
  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No property data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: property.photos?.[0] || "https://via.placeholder.com/400x300" }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.price}>€{Number(property.price).toLocaleString()}/mo</Text>
        <Text style={styles.title}>{property.title}</Text>
        <View style={styles.location}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.locationText}>{property.city}</Text>
        </View>
        <View style={styles.specs}>
          {property.bedrooms ? (
            <View style={styles.spec}>
              <BedDouble color="#6B7280" size={16} />
              <Text style={styles.specText}>{property.bedrooms} bed</Text>
            </View>
          ) : null}
          {property.square_meters ? (
            <Text style={styles.specText}>{property.square_meters}m²</Text>
          ) : null}
        </View>
        <Text style={styles.description}>{property.description || "No description provided."}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  image: { width: "100%", height: 280 },
  content: { padding: 16 },
  price: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8 },
  location: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  locationText: { marginLeft: 4, color: "#6B7280" },
  specs: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 12 },
  spec: { flexDirection: "row", alignItems: "center", gap: 4 },
  specText: { color: "#6B7280" },
  description: { color: "#374151", lineHeight: 20 }
});

