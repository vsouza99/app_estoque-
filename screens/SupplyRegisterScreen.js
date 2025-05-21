import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para gerar código único de 3 a 5 caracteres alfanuméricos
function generateUniqueCode(length = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function SupplyRegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("tonner");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const handleRegister = async () => {
    if (!name || !quantity) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    const code = generateUniqueCode(Math.floor(Math.random() * 3) + 3); // 3 a 5 caracteres
    const newSupply = {
      code,
      name,
      type,
      quantity: parseInt(quantity),
      notes,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = await AsyncStorage.getItem("supplies");
      const supplies = stored ? JSON.parse(stored) : [];
      supplies.push(newSupply);
      await AsyncStorage.setItem("supplies", JSON.stringify(supplies));
      Alert.alert("Sucesso", "Suprimento cadastrado com sucesso!");
      setName("");
      setType("tonner");
      setQuantity("");
      setNotes("");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o suprimento.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Suprimento</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});