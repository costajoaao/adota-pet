import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { signOut } from "firebase/auth"
import { collection, onSnapshot } from "firebase/firestore"
import { autenticacao, db } from "../database/firebase"

function HomeScreen({ navigation }) {
    const [total, setTotal] = useState(0)
    const [disponiveis, setDisponiveis] = useState(0)
    const [adotados, setAdotados] = useState(0)

    useEffect(() => {
        // ouvinte em tempo real da coleção de pets
        const unsubscribe = onSnapshot(collection(db, "pets"), (snap) => {
            let qtdTotal = 0
            let qtdDisp = 0
            let qtdAdot = 0
            snap.forEach(doc => {
                qtdTotal++
                if (doc.data().status === "adotado") {
                    qtdAdot++
                } else {
                    qtdDisp++
                }
            })
            setTotal(qtdTotal)
            setDisponiveis(qtdDisp)
            setAdotados(qtdAdot)
        })
        return unsubscribe
    }, [])

    const sair = () => {
        signOut(autenticacao)
        .catch(erro => {
            Alert.alert("Erro", "Não foi possível sair.")
        })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.cabecalho}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.ola}>Olá! 🐾</Text>
                    <Text style={styles.email}>{autenticacao.currentUser?.email}</Text>
                </View>
                <TouchableOpacity onPress={sair} style={styles.botaoSair}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.conteudo}>
                <Text style={styles.tituloSecao}>Visão geral</Text>

                <View style={styles.linhaCards}>
                    <View style={[styles.card, { backgroundColor: "#fff" }]}>
                        <Text style={styles.numeroCard}>{total}</Text>
                        <Text style={styles.rotuloCard}>Total</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: "#E8F5E9" }]}>
                        <Text style={[styles.numeroCard, { color: "#2E7D32" }]}>{disponiveis}</Text>
                        <Text style={styles.rotuloCard}>Disponíveis</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: "#EEEEEE" }]}>
                        <Text style={[styles.numeroCard, { color: "#9E9E9E" }]}>{adotados}</Text>
                        <Text style={styles.rotuloCard}>Adotados</Text>
                    </View>
                </View>

                <Text style={styles.tituloSecao}>O que deseja fazer?</Text>

                <TouchableOpacity
                    style={styles.botaoAcao}
                    onPress={() => navigation.navigate("NovoPet")}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                    <Text style={styles.textoBotaoAcao}>Cadastrar Pet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botaoAcao, styles.botaoAcaoOutline]}
                    onPress={() => navigation.navigate("ListaPets")}
                >
                    <Ionicons name="paw-outline" size={24} color="#FF6B35" />
                    <Text style={[styles.textoBotaoAcao, { color: "#FF6B35" }]}>Ver Pets</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F5"
    },
    cabecalho: {
        backgroundColor: "#FF6B35",
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    ola: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold"
    },
    email: {
        color: "#fff",
        fontSize: 13,
        marginTop: 4,
        opacity: 0.9
    },
    botaoSair: {
        padding: 8
    },
    conteudo: {
        padding: 20
    },
    tituloSecao: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#212121",
        marginTop: 16,
        marginBottom: 12
    },
    linhaCards: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    card: {
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        // sombra
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
    },
    numeroCard: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#FF6B35"
    },
    rotuloCard: {
        fontSize: 12,
        color: "#757575",
        marginTop: 4
    },
    botaoAcao: {
        backgroundColor: "#FF6B35",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10
    },
    botaoAcaoOutline: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#FF6B35"
    },
    textoBotaoAcao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8
    }
})

export default HomeScreen
