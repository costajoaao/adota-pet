import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../database/firebase"
import PetCard from "./PetCard"

function ListaPetsScreen({ navigation }) {
    const [pets, setPets] = useState([])
    const [petsFiltrados, setPetsFiltrados] = useState([])
    const [filtroEspecie, setFiltroEspecie] = useState("Todos")
    const [busca, setBusca] = useState("")
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        // ouvinte em tempo real, ordenado por data de criação
        const q = query(collection(db, "pets"), orderBy("criadoEm", "desc"))
        const unsubscribe = onSnapshot(q, (snap) => {
            const lista = []
            snap.forEach(doc => {
                lista.push({ id: doc.id, ...doc.data() })
            })
            setPets(lista)
            setCarregando(false)
        })
        return unsubscribe
    }, [])

    // aplica filtro de espécie e a busca por texto
    useEffect(() => {
        let resultado = pets

        if (filtroEspecie !== "Todos") {
            resultado = resultado.filter(p => p.especie === filtroEspecie)
        }

        if (busca.trim() !== "") {
            const termo = busca.toLowerCase()
            resultado = resultado.filter(p =>
                (p.nome && p.nome.toLowerCase().includes(termo)) ||
                (p.cidade && p.cidade.toLowerCase().includes(termo))
            )
        }

        setPetsFiltrados(resultado)
    }, [pets, filtroEspecie, busca])

    const renderChip = (valor, texto) => {
        const ativo = filtroEspecie === valor
        return (
            <TouchableOpacity
                style={[styles.chip, ativo && styles.chipAtivo]}
                onPress={() => setFiltroEspecie(valor)}
            >
                <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>{texto}</Text>
            </TouchableOpacity>
        )
    }

    const telaVazia = () => (
        <View style={styles.vazio}>
            <Ionicons name="paw-outline" size={70} color="#FF6B35" />
            <Text style={styles.tituloVazio}>Nenhum pet encontrado 🐾</Text>
            <Text style={styles.subtituloVazio}>Seja o primeiro a cadastrar um pet para adoção</Text>
            <TouchableOpacity
                style={styles.botaoVazio}
                onPress={() => navigation.navigate("NovoPet")}
            >
                <Text style={styles.textoBotaoVazio}>Cadastrar o primeiro</Text>
            </TouchableOpacity>
        </View>
    )

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.areaBusca}>
                <Ionicons name="search" size={18} color="#9E9E9E" />
                <TextInput
                    style={styles.inputBusca}
                    placeholder="Buscar por nome ou cidade..."
                    value={busca}
                    onChangeText={setBusca}
                />
            </View>

            <View style={styles.linhaChips}>
                {renderChip("Todos", "Todos")}
                {renderChip("cao", "🐶 Cão")}
                {renderChip("gato", "🐱 Gato")}
                {renderChip("outro", "🐾 Outro")}
            </View>

            <FlatList
                data={petsFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PetCard
                        pet={item}
                        onPress={() => navigation.navigate("DetalhesPet", { pet: item })}
                    />
                )}
                contentContainerStyle={petsFiltrados.length === 0 ? { flex: 1 } : { paddingVertical: 12 }}
                ListEmptyComponent={telaVazia}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F5"
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#FFF8F5",
        justifyContent: "center",
        alignItems: "center"
    },
    areaBusca: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee"
    },
    inputBusca: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 14
    },
    linhaChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    chip: {
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 4,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: "#eee"
    },
    chipAtivo: {
        backgroundColor: "#FF6B35",
        borderColor: "#FF6B35"
    },
    textoChip: {
        fontSize: 13,
        color: "#212121"
    },
    textoChipAtivo: {
        color: "#fff",
        fontWeight: "bold"
    },
    vazio: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30
    },
    tituloVazio: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#212121",
        marginTop: 16
    },
    subtituloVazio: {
        fontSize: 13,
        color: "#757575",
        marginTop: 6,
        textAlign: "center"
    },
    botaoVazio: {
        backgroundColor: "#FF6B35",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20
    },
    textoBotaoVazio: {
        color: "#fff",
        fontWeight: "bold"
    }
})

export default ListaPetsScreen
