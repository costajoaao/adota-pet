import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"

// devolve o emoji da espécie pra usar no placeholder e no texto
function emojiDaEspecie(especie) {
    if (especie === "cao") return "🐶"
    if (especie === "gato") return "🐱"
    return "🐾"
}

function textoDaEspecie(especie) {
    if (especie === "cao") return "Cão"
    if (especie === "gato") return "Gato"
    return "Outro"
}

function PetCard({ pet, onPress }) {
    const disponivel = pet.status !== "adotado"
    const corBorda = disponivel ? "#FF6B35" : "#9E9E9E"

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: corBorda }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {pet.fotoUrl ? (
                <Image source={{ uri: pet.fotoUrl }} style={styles.foto} />
            ) : (
                <View style={styles.fotoPlaceholder}>
                    <Text style={styles.emojiPlaceholder}>{emojiDaEspecie(pet.especie)}</Text>
                </View>
            )}

            <View style={styles.infos}>
                <Text style={styles.nome}>{pet.nome}</Text>
                <Text style={styles.especie}>
                    {emojiDaEspecie(pet.especie)} {textoDaEspecie(pet.especie)}
                    {pet.raca ? "  •  " + pet.raca : ""}
                </Text>
                <Text style={styles.cidade}>📍 {pet.cidade}{pet.porte ? "  •  " + pet.porte : ""}</Text>
            </View>

            <View style={[
                styles.badge,
                disponivel ? styles.badgeDisponivel : styles.badgeAdotado
            ]}>
                <Text style={[
                    styles.textoBadge,
                    { color: disponivel ? "#2E7D32" : "#616161" }
                ]}>
                    {disponivel ? "Disponível" : "Adotado"}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 16,
        alignItems: "center",
        borderLeftWidth: 5,
        // sombra
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    foto: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#eee"
    },
    fotoPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#FFF1EA",
        alignItems: "center",
        justifyContent: "center"
    },
    emojiPlaceholder: {
        fontSize: 36
    },
    infos: {
        flex: 1,
        marginLeft: 12
    },
    nome: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#212121"
    },
    especie: {
        fontSize: 13,
        color: "#757575",
        marginTop: 2
    },
    cidade: {
        fontSize: 12,
        color: "#757575",
        marginTop: 2
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 6
    },
    badgeDisponivel: {
        backgroundColor: "#E8F5E9"
    },
    badgeAdotado: {
        backgroundColor: "#EEEEEE"
    },
    textoBadge: {
        fontSize: 11,
        fontWeight: "bold"
    }
})

export default PetCard
