import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MainScreen({ navigation }) {
  const handleLogout = () => {
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Controle de Estoque</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SupplyRegister")}
      >
        <Text style={styles.buttonText}>Cadastrar Suprimento</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Summary")}
      >
        <Text style={styles.buttonText}>Resumo Geral</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 40, fontWeight: "bold", textAlign: "center" },
  logoutButton: { marginTop: 40, backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", width: "100%" },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  button: { width: "100%", backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});