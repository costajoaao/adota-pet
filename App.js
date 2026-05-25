import React, { useState, useEffect } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { onAuthStateChanged } from "firebase/auth"
import { autenticacao } from "./database/firebase"

import LoginScreen from "./components/LoginScreen"
import RegistroScreen from "./components/RegistroScreen"
import HomeScreen from "./components/HomeScreen"
import NovoPetScreen from "./components/NovoPetScreen"
import ListaPetsScreen from "./components/ListaPetsScreen"
import DetalhesPetScreen from "./components/DetalhesPetScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const ListaStack = createNativeStackNavigator()

// Stack interna da aba "Lista de Pets" para conseguir abrir os detalhes
function ListaPetsNavigator() {
    return (
        <ListaStack.Navigator>
            <ListaStack.Screen
                name="ListaPets"
                component={ListaPetsScreen}
                options={{ title: "Pets para Adoção", headerStyle: { backgroundColor: "#FF6B35" }, headerTintColor: "#fff" }}
            />
            <ListaStack.Screen
                name="DetalhesPet"
                component={DetalhesPetScreen}
                options={{ title: "Detalhes do Pet", headerStyle: { backgroundColor: "#FF6B35" }, headerTintColor: "#fff" }}
            />
        </ListaStack.Navigator>
    )
}

function TabsLogado() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#FF6B35",
                tabBarInactiveTintColor: "#9E9E9E",
                tabBarIcon: ({ color, size }) => {
                    let icone = "home"
                    if (route.name === "Home") icone = "home"
                    if (route.name === "NovoPet") icone = "add-circle"
                    if (route.name === "ListaPets") icone = "paw"
                    return <Ionicons name={icone} size={size} color={color} />
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
            <Tab.Screen name="NovoPet" component={NovoPetScreen} options={{ title: "Cadastrar" }} />
            <Tab.Screen name="ListaPets" component={ListaPetsNavigator} options={{ title: "Pets" }} />
        </Tab.Navigator>
    )
}

function StackDeslogado() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registrar" component={RegistroScreen} />
        </Stack.Navigator>
    )
}

export default function App() {
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(autenticacao, (u) => {
            setUsuario(u)
            setCarregando(false)
        })
        return unsubscribe
    }, [])

    if (carregando) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {usuario ? <TabsLogado /> : <StackDeslogado />}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF8F5"
    }
})
