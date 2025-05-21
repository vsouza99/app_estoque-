import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SupplyMovementScreen({ route, navigation }) {
  const { supply } = route.params;
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("entrada");
  const [description, setDescription] = useState("");
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    const stored = await AsyncStorage.getItem(`movements_${supply.code}`);
    setMovements(stored ? JSON.parse(stored) : []);
  };

  const handleRegisterMovement = async () => {
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      Alert.alert("Atenção", "Informe uma quantidade válida.");
      return;
    }
    const movement = {
      type,
      quantity: Number(quantity),
      description,
      date: new Date().toISOString()
    };
    const updatedMovements = [movement, ...movements];
    await AsyncStorage.setItem(`movements_${supply.code}`, JSON.stringify(updatedMovements));

    // Atualiza o estoque do suprimento
    const stored = await AsyncStorage.getItem("supplies");
    let supplies = stored ? JSON.parse(stored) : [];
    supplies = supplies.map(item => {
      if (item.code === supply.code) {
        let newQty = item.quantity;
        if (type === "entrada") newQty += Number(quantity);
        else if (type === "saida") newQty -= Number(quantity);
        return { ...item, quantity: newQty < 0 ? 0 : newQty };
      }
      return item;
    });
    await AsyncStorage.setItem("supplies", JSON.stringify(supplies));

    setQuantity("");
    setDescription("");
    setType("entrada");
    setMovements(updatedMovements);
    Alert.alert("Sucesso", "Movimentação registrada!");
  };

  const renderItem = ({ item }) => (
    <View style={styles.movementItem}>
      <Text style={styles.movementType}>{item.type === "entrada" ? "Entrada" : "Saída"}</Text>
      <Text style={styles.movementText}>Qtd: {item.quantity}</Text>
      <Text style={styles.movementText}>Descrição: {item.description}</Text>
      <Text style={styles.movementText}>Data: {new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movimentações - {supply.name}</Text>
      <View style={styles.formRow}>
        <TouchableOpacity
          style={[styles.typeButton, type === "entrada" && styles.typeButtonActive]}
          onPress={() => setType("entrada")}
        >
          <Text style={styles.typeButtonText}>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === "saida" && styles.typeButtonActive]}
          onPress={() => setType("saida")}
        >
          <Text style={styles.typeButtonText}>Saída</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#aaa"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegisterMovement}>
        <Text style={styles.buttonText}>Registrar Movimentação</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Histórico de Movimentações</Text>
      <FlatList
        data={movements}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: "#fff", marginTop: 20 }}>Nenhuma movimentação registrada.</Text>}
      />
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 22, color: "#fff", marginBottom: 10, fontWeight: "bold", textAlign: "center" },
  formRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  typeButton: { backgroundColor: "#222", padding: 10, borderRadius: 8, marginHorizontal: 5 },
  typeButtonActive: { backgroundColor: "#d32f2f" },
  typeButtonText: { color: "#fff", fontWeight: "bold" },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  button: { width: "100%", backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subtitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  movementItem: { backgroundColor: "#222", borderRadius: 8, padding: 12, marginBottom: 10 },
  movementType: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  movementText: { color: "#fff", fontSize: 14 },
  cancelButton: { width: "100%", backgroundColor: "#222", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  cancelText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});