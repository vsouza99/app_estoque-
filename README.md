# Controle de Estoque - Stoque

Aplicativo mobile para controle de estoque de suprimentos, desenvolvido em React Native utilizando Expo.

## Funcionalidades

- **Login:** Tela de autenticação para acesso ao sistema.
- **Cadastro de Suprimentos:** Adicione novos itens ao estoque, informando nome, tipo, quantidade e observações.
- **Listagem de Suprimentos:** Visualize todos os suprimentos cadastrados.
- **Edição de Suprimentos:** Edite informações de itens já cadastrados.
- **Movimentação de Estoque:** Registre entradas e saídas de suprimentos.
- **Resumo Geral:** Tela com gráfico e estatísticas do estoque.
- **Logout:** Saia do sistema com segurança.

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [@react-navigation](https://reactnavigation.org/) (Stack Navigator)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (armazenamento local)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) (gráficos)
- [@react-native-picker/picker](https://github.com/react-native-picker/picker) (seleção de tipo)
- [uuid](https://www.npmjs.com/package/uuid) (geração de códigos únicos)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/stoque.git
   cd stoque

2. **Instale as dependências:**
   ```bash
   npm install

3. **Instale as dependências específicas do Expo:**
   ```bash
   npx expo install react-native-chart-kit @react-native-async-storage/async-storage @react-native-picker/picker

4. **Inicie o aplicativo:**
   ```bash
   npx expo start