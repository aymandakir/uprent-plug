import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@rentfusion/database";
import { MapPin, BedDouble, Heart } from "lucide-react-native";
import { useState } from "react";

export default function HomeScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_active", true)
        .order("scraped_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderProperty = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PropertyDetail", { property: item })}
    >
      <Image
        source={{ uri: item.photos?.[0] || "https://via.placeholder.com/400x300" }}
        style={styles.image}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.saveButton}>
        <Heart color="#FF6B6B" size={24} />
      </TouchableOpacity>

      {isNew(item.scraped_at) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.price}>€{Number(item.price).toLocaleString()}/mo</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.location}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.locationText}>{item.city}</Text>
        </View>
        <View style={styles.specs}>
          {item.bedrooms ? (
            <View style={styles.spec}>
              <BedDouble color="#6B7280" size={16} />
              <Text style={styles.specText}>{item.bedrooms} bed</Text>
            </View>
          ) : null}
          {item.square_meters ? <Text style={styles.specText}>{item.square_meters}m²</Text> : null}
        </View>
        <View style={styles.tags}>
          {item.furnished ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Furnished</Text>
            </View>
          ) : null}
          {item.pets_allowed ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Pets OK</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Home</Text>
        <Text style={styles.headerSubtitle}>{properties?.length || 0} properties available</Text>
      </View>

      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function isNew(date: string): boolean {
  return Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827"
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4
  },
  list: {
    padding: 16
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  image: {
    width: "100%",
    height: 200
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold"
  },
  content: {
    padding: 16
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4
  },
  specs: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 16
  },
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  specText: {
    fontSize: 14,
    color: "#6B7280"
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tag: {
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tagText: {
    fontSize: 12,
    color: "#1E40AF"
  }
});

