import React, { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { collection, addDoc } from "firebase/firestore"
import { db, autenticacao } from "../database/firebase"

function NovoPetScreen({ navigation }) {
    const [nome, setNome] = useState("")
    const [especie, setEspecie] = useState("")
    const [raca, setRaca] = useState("")
    const [idade, setIdade] = useState("")
    const [porte, setPorte] = useState("")
    const [descricao, setDescricao] = useState("")
    const [cidade, setCidade] = useState("")
    const [contato, setContato] = useState("")
    const [fotoUrl, setFotoUrl] = useState("")
    const [salvando, setSalvando] = useState(false)

    const limparCampos = () => {
        setNome("")
        setEspecie("")
        setRaca("")
        setIdade("")
        setPorte("")
        setDescricao("")
        setCidade("")
        setContato("")
        setFotoUrl("")
    }

    const salvarPet = () => {
        // validação dos campos obrigatórios
        if (nome === "" || cidade === "" || contato === "") {
            Alert.alert("Atenção", "Nome, cidade e contato são obrigatórios.")
            return
        }
        if (especie === "") {
            Alert.alert("Atenção", "Selecione a espécie do pet.")
            return
        }

        setSalvando(true)
        addDoc(collection(db, "pets"), {
            nome: nome,
            especie: especie,
            raca: raca,
            idade: idade,
            porte: porte,
            descricao: descricao,
            cidade: cidade,
            contato: contato,
            fotoUrl: fotoUrl.trim(),
            status: "disponivel",
            donoId: autenticacao.currentUser.uid,
            donoEmail: autenticacao.currentUser.email,
            criadoEm: new Date().toISOString()
        })
        .then(() => {
            setSalvando(false)
            Alert.alert("Sucesso!", "Pet cadastrado com sucesso.")
            limparCampos()
            navigation.navigate("ListaPets")
        })
        .catch(erro => {
            setSalvando(false)
            Alert.alert("Erro", "Não foi possível cadastrar o pet.")
        })
    }

    // botões segmentados (espécie e porte)
    const renderBotaoOpcao = (valor, valorSelecionado, setar, texto) => {
        const selecionado = valor === valorSelecionado
        return (
            <TouchableOpacity
                key={valor}
                style={[styles.botaoOpcao, selecionado && styles.botaoOpcaoSelecionado]}
                onPress={() => setar(valor)}
            >
                <Text style={[styles.textoBotaoOpcao, selecionado && styles.textoBotaoOpcaoSelecionado]}>
                    {texto}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.cabecalho}>
                    <Text style={styles.titulo}>Cadastrar Pet 🐶</Text>
                    <Text style={styles.subtitulo}>Preencha as informações do pet</Text>
                </View>

                <View style={styles.formulario}>
                    <Text style={styles.rotulo}>Nome do pet *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Rex"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.rotulo}>Link da foto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://..."
                        value={fotoUrl}
                        onChangeText={setFotoUrl}
                        autoCapitalize="none"
                    />
                    <Text style={styles.ajuda}>Cole um link de imagem da internet</Text>

                    <Text style={styles.rotulo}>Espécie *</Text>
                    <View style={styles.linhaOpcoes}>
                        {renderBotaoOpcao("cao", especie, setEspecie, "🐶 Cão")}
                        {renderBotaoOpcao("gato", especie, setEspecie, "🐱 Gato")}
                        {renderBotaoOpcao("outro", especie, setEspecie, "🐾 Outro")}
                    </View>

                    <Text style={styles.rotulo}>Raça</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Vira-lata, Poodle"
                        value={raca}
                        onChangeText={setRaca}
                    />

                    <Text style={styles.rotulo}>Idade</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 2 anos, 6 meses"
                        value={idade}
                        onChangeText={setIdade}
                    />

                    <Text style={styles.rotulo}>Porte</Text>
                    <View style={styles.linhaOpcoes}>
                        {renderBotaoOpcao("Pequeno", porte, setPorte, "Pequeno")}
                        {renderBotaoOpcao("Médio", porte, setPorte, "Médio")}
                        {renderBotaoOpcao("Grande", porte, setPorte, "Grande")}
                    </View>

                    <Text style={styles.rotulo}>Descrição / Personalidade</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultilinha]}
                        placeholder="Conte um pouco sobre o pet..."
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                        maxLength={300}
                    />
                    <Text style={styles.contador}>{descricao.length}/300</Text>

                    <Text style={styles.rotulo}>Cidade *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: São Paulo"
                        value={cidade}
                        onChangeText={setCidade}
                    />

                    <Text style={styles.rotulo}>Contato (WhatsApp) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="(11) 99999-9999"
                        value={contato}
                        onChangeText={setContato}
                        keyboardType="phone-pad"
                    />

                    {salvando ? (
                        <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 20 }} />
                    ) : (
                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarPet}>
                            <Text style={styles.textoBotaoSalvar}>Salvar Pet</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff"
    },
    subtitulo: {
        fontSize: 13,
        color: "#fff",
        marginTop: 4,
        opacity: 0.9
    },
    formulario: {
        padding: 20
    },
    rotulo: {
        fontSize: 14,
        color: "#212121",
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "600"
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#eee"
    },
    inputMultilinha: {
        minHeight: 90,
        textAlignVertical: "top"
    },
    ajuda: {
        fontSize: 12,
        color: "#757575",
        marginTop: 4,
        marginLeft: 2
    },
    contador: {
        fontSize: 12,
        color: "#757575",
        textAlign: "right",
        marginTop: 4
    },
    linhaOpcoes: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    botaoOpcao: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 12,
        marginHorizontal: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        alignItems: "center"
    },
    botaoOpcaoSelecionado: {
        backgroundColor: "#FF6B35",
        borderColor: "#FF6B35"
    },
    textoBotaoOpcao: {
        color: "#212121",
        fontSize: 14,
        fontWeight: "500"
    },
    textoBotaoOpcaoSelecionado: {
        color: "#fff",
        fontWeight: "bold"
    },
    botaoSalvar: {
        backgroundColor: "#FF6B35",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 24
    },
    textoBotaoSalvar: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
})

export default NovoPetScreen
