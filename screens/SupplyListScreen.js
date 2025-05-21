import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function SupplyListScreen({ navigation }) {
  const [supplies, setSupplies] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSupplies();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSupplies = async () => {
    const stored = await AsyncStorage.getItem("supplies");
    setSupplies(stored ? JSON.parse(stored) : []);
  };

  // Filtro por tipo
  const filteredSupplies = supplies
    .filter(
      item =>
        (item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.code.toLowerCase().includes(search.toLowerCase())) &&
        (filterType === "all" || item.type === filterType)
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "quantity") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  const handleDelete = async (code) => {
    const newList = supplies.filter(item => item.code !== code);
    await AsyncStorage.setItem("supplies", JSON.stringify(newList));
    setSupplies(newList);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.quantity < 5 && styles.lowStock]}>
      <Text style={styles.itemTitle}>{item.name} ({item.code})</Text>
      <Text style={styles.itemText}>Tipo: {item.type}</Text>
      <Text style={styles.itemText}>Qtd: {item.quantity}</Text>
      <Text style={styles.itemText}>Obs: {item.notes}</Text>
      <Text style={styles.itemText}>Data: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("SupplyEdit", { supply: item })}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.movementButton}
          onPress={() => navigation.navigate("SupplyMovement", { supply: item })}
        >
          <Text style={styles.movementText}>Movimentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.code)}>
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Suprimentos</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nome ou código"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.filterRow}>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={filterType}
            style={styles.picker}
            onValueChange={setFilterType}
          >
            <Picker.Item label="Todos" value="all" />
            <Picker.Item label="Tonner" value="tonner" />
            <Picker.Item label="Papel" value="papel" />
            <Picker.Item label="Impressora" value="impressora" />
            <Picker.Item label="Outros" value="outros" />
          </Picker>
        </View>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={sortBy}
            style={styles.picker}
            onValueChange={setSortBy}
          >
            <Picker.Item label="Ordenar por Data" value="date" />
            <Picker.Item label="Ordenar por Quantidade" value="quantity" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredSupplies}
        keyExtractor={item => item.code}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: "#fff", marginTop: 20 }}>Nenhum suprimento cadastrado.</Text>}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  item: { backgroundColor: "#222", borderRadius: 8, padding: 16, marginBottom: 12 },
  itemTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  itemText: { color: "#fff", fontSize: 14 },
  lowStock: { borderColor: "#d32f2f", borderWidth: 2 },
  button: { width: "100%", backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  filterContainer: { flex: 1, backgroundColor: "#fff", borderRadius: 8, marginRight: 8 },
  picker: { width: "100%", height: 40 },
  actions: { flexDirection: "row", marginTop: 10 },
  editButton: { backgroundColor: "#1976d2", padding: 8, borderRadius: 6, marginRight: 10 },
  editText: { color: "#fff", fontWeight: "bold" },
  movementButton: { backgroundColor: "#fff", padding: 8, borderRadius: 6, marginRight: 10 },
  movementText: { color: "#d32f2f", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#d32f2f", padding: 8, borderRadius: 6, marginRight: 10 },
  deleteText: { color: "#fff", fontWeight: "bold" },
});