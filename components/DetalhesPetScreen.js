import React, { useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db, autenticacao } from "../database/firebase"

function emojiDaEspecie(especie) {
    if (especie === "cao") return "🐶 Cão"
    if (especie === "gato") return "🐱 Gato"
    return "🐾 Outro"
}

function DetalhesPetScreen({ route, navigation }) {
    const { pet } = route.params
    const [status, setStatus] = useState(pet.status)
    const [processando, setProcessando] = useState(false)

    const ehDono = autenticacao.currentUser?.uid === pet.donoId

    const marcarComoAdotado = () => {
        setProcessando(true)
        updateDoc(doc(db, "pets", pet.id), { status: "adotado" })
        .then(() => {
            setProcessando(false)
            setStatus("adotado")
            Alert.alert("Atualizado!", "Pet marcado como adotado.")
        })
        .catch(erro => {
            setProcessando(false)
            Alert.alert("Erro", "Não foi possível atualizar.")
        })
    }

    const excluirPet = () => {
        // no web, Alert com múltiplos botões não dispara os callbacks
        if (Platform.OS === "web") {
            const confirmar = window.confirm("Deseja excluir este pet?")
            if (!confirmar) return
            setProcessando(true)
            deleteDoc(doc(db, "pets", pet.id))
            .then(() => {
                setProcessando(false)
                navigation.goBack()
            })
            .catch(erro => {
                setProcessando(false)
                alert("Não foi possível excluir.")
            })
            return
        }

        Alert.alert("Confirmar", "Deseja excluir este pet?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: () => {
                    setProcessando(true)
                    deleteDoc(doc(db, "pets", pet.id))
                    .then(() => {
                        setProcessando(false)
                        navigation.goBack()
                    })
                    .catch(erro => {
                        setProcessando(false)
                        Alert.alert("Erro", "Não foi possível excluir.")
                    })
                }
            }
        ])
    }

    const disponivel = status !== "adotado"

    return (
        <ScrollView style={styles.container}>
            {pet.fotoUrl ? (
                <Image source={{ uri: pet.fotoUrl }} style={styles.foto} />
            ) : (
                <View style={styles.fotoPlaceholder}>
                    <Text style={{ fontSize: 100 }}>{emojiDaEspecie(pet.especie).split(" ")[0]}</Text>
                </View>
            )}

            <View style={styles.cabecalho}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.nome}>{pet.nome}</Text>
                    <Text style={styles.especie}>{emojiDaEspecie(pet.especie)}</Text>
                </View>
                <View style={[
                    styles.badge,
                    disponivel ? styles.badgeDisponivel : styles.badgeAdotado
                ]}>
                    <Text style={[
                        styles.textoBadge,
                        { color: disponivel ? "#2E7D32" : "#616161" }
                    ]}>
                        {disponivel ? "🟢 Disponível" : "✅ Adotado"}
                    </Text>
                </View>
            </View>

            <View style={styles.bloco}>
                {pet.raca ? <Linha rotulo="Raça" valor={pet.raca} /> : null}
                {pet.idade ? <Linha rotulo="Idade" valor={pet.idade} /> : null}
                {pet.porte ? <Linha rotulo="Porte" valor={pet.porte} /> : null}
                <Linha rotulo="Cidade" valor={pet.cidade} />
                <Linha rotulo="Contato" valor={pet.contato} />
            </View>

            {pet.descricao ? (
                <View style={styles.bloco}>
                    <Text style={styles.tituloSecao}>Sobre o pet</Text>
                    <Text style={styles.descricao}>{pet.descricao}</Text>
                </View>
            ) : null}

            <View style={styles.bloco}>
                <Text style={styles.tituloSecao}>Cadastrado por</Text>
                <Text style={styles.donoEmail}>{pet.donoEmail}</Text>
            </View>

            <View style={{ padding: 20 }}>
                {processando ? (
                    <ActivityIndicator size="large" color="#FF6B35" />
                ) : (
                    <>
                        {disponivel && (
                            <TouchableOpacity style={styles.botaoAdotar} onPress={marcarComoAdotado}>
                                <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                                <Text style={styles.textoBotaoAdotar}>Marcar como Adotado</Text>
                            </TouchableOpacity>
                        )}

                        {ehDono && (
                            <TouchableOpacity style={styles.botaoExcluir} onPress={excluirPet}>
                                <Ionicons name="trash-outline" size={22} color="#fff" />
                                <Text style={styles.textoBotaoExcluir}>Excluir Pet</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    )
}

// linha simples de rótulo + valor
function Linha({ rotulo, valor }) {
    return (
        <View style={styles.linha}>
            <Text style={styles.rotulo}>{rotulo}</Text>
            <Text style={styles.valor}>{valor}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F5"
    },
    foto: {
        width: "100%",
        height: 260,
        backgroundColor: "#eee"
    },
    fotoPlaceholder: {
        width: "100%",
        height: 220,
        backgroundColor: "#FFF1EA",
        alignItems: "center",
        justifyContent: "center"
    },
    cabecalho: {
        flexDirection: "row",
        padding: 20,
        alignItems: "center"
    },
    nome: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#212121"
    },
    especie: {
        fontSize: 14,
        color: "#757575",
        marginTop: 4
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },
    badgeDisponivel: {
        backgroundColor: "#E8F5E9"
    },
    badgeAdotado: {
        backgroundColor: "#EEEEEE"
    },
    textoBadge: {
        fontSize: 12,
        fontWeight: "bold"
    },
    bloco: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1
    },
    linha: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6
    },
    rotulo: {
        fontSize: 14,
        color: "#757575"
    },
    valor: {
        fontSize: 14,
        color: "#212121",
        fontWeight: "600"
    },
    tituloSecao: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#212121",
        marginBottom: 8
    },
    descricao: {
        fontSize: 14,
        color: "#212121",
        lineHeight: 20
    },
    donoEmail: {
        fontSize: 14,
        color: "#212121"
    },
    botaoAdotar: {
        backgroundColor: "#2E7D32",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 10
    },
    textoBotaoAdotar: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 6
    },
    botaoExcluir: {
        backgroundColor: "#C62828",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 10
    },
    textoBotaoExcluir: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 6
    }
})

export default DetalhesPetScreen
