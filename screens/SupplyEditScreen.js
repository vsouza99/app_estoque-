import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SupplyEditScreen({ route, navigation }) {
  const { supply } = route.params;
  const [name, setName] = useState(supply.name);
  const [type, setType] = useState(supply.type);
  const [quantity, setQuantity] = useState(String(supply.quantity));
  const [notes, setNotes] = useState(supply.notes);

  const handleSave = async () => {
    if (!name || !quantity) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const stored = await AsyncStorage.getItem("supplies");
      let supplies = stored ? JSON.parse(stored) : [];
      supplies = supplies.map(item =>
        item.code === supply.code
          ? { ...item, name, type, quantity: parseInt(quantity), notes }
          : item
      );
      await AsyncStorage.setItem("supplies", JSON.stringify(supplies));
      Alert.alert("Sucesso", "Suprimento atualizado com sucesso!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Suprimento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          style={styles.picker}
          onValueChange={setType}
        >
          <Picker.Item label="Tonner" value="tonner" />
          <Picker.Item label="Papel" value="papel" />
          <Picker.Item label="Impressora" value="impressora" />
          <Picker.Item label="Outros" value="outros" />
        </Picker>
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
        placeholder="Observações"
        placeholderTextColor="#aaa"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 30, fontWeight: "bold" },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  pickerContainer: { width: "100%", backgroundColor: "#fff", borderRadius: 8, marginBottom: 16 },
  picker: { width: "100%", height: 50 },
  button: { width: "100%", backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cancelButton: { width: "100%", backgroundColor: "#222", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  cancelText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});