import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";

export default function SummaryScreen({ navigation }) {
  const [supplies, setSupplies] = useState([]);

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

  // Dados para o resumo
  const totalSupplies = supplies.length;
  const totalQuantity = supplies.reduce((sum, item) => sum + item.quantity, 0);
  const lastSupplies = [...supplies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Dados para o gráfico
  const types = ["tonner", "papel", "impressora", "outros"];
  const typeLabels = ["Tonner", "Papel", "Impressora", "Outros"];
  const typeCounts = types.map(type => supplies.filter(item => item.type === type).reduce((sum, i) => sum + i.quantity, 0));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo Geral</Text>
      <Text style={styles.summaryText}>Total de suprimentos: {totalSupplies}</Text>
      <Text style={styles.summaryText}>Total em estoque: {totalQuantity}</Text>
      <Text style={styles.subtitle}>Últimos cadastrados:</Text>
      <FlatList
        data={lastSupplies}
        keyExtractor={item => item.code}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {item.name} ({item.type}) - Qtd: {item.quantity}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.itemText}>Nenhum suprimento cadastrado.</Text>}
      />
      <Text style={styles.subtitle}>Estoque por tipo:</Text>
      <BarChart
        data={{
          labels: typeLabels,
          datasets: [{ data: typeCounts }]
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#000",
          backgroundGradientFrom: "#222",
          backgroundGradientTo: "#222",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`,
          labelColor: () => "#fff",
          style: { borderRadius: 16 }
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
        fromZero
        showValuesOnTopOfBars
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  summaryText: { color: "#fff", fontSize: 18, marginBottom: 5 },
  subtitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  itemText: { color: "#fff", fontSize: 16, marginBottom: 2 },
  button: { width: "100%", backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});