import React, { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { autenticacao } from "../database/firebase"

function RegistroScreen({ navigation }) {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [carregando, setCarregando] = useState(false)

    const criarConta = () => {
        // validações básicas
        if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
            Alert.alert("Atenção", "Preencha todos os campos.")
            return
        }
        if (senha.length < 6) {
            Alert.alert("Atenção", "A senha precisa ter pelo menos 6 caracteres.")
            return
        }
        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não coincidem.")
            return
        }

        setCarregando(true)
        createUserWithEmailAndPassword(autenticacao, email, senha)
        .then(cred => {
            return sendEmailVerification(cred.user)
        })
        .then(() => {
            setCarregando(false)
            Alert.alert("Conta criada!", "Verifique seu email para confirmar o cadastro.")
            navigation.navigate("Login")
        })
        .catch(erro => {
            setCarregando(false)
            let mensagem = "Não foi possível criar a conta."
            if (erro.code === "auth/email-already-in-use") {
                mensagem = "Este email já está em uso."
            } else if (erro.code === "auth/invalid-email") {
                mensagem = "Email inválido."
            }
            Alert.alert("Erro", mensagem)
        })
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.cabecalho}>
                    <Text style={styles.titulo}>Criar Conta</Text>
                    <Text style={styles.subtitulo}>Ajude um pet a encontrar um lar</Text>
                </View>

                <View style={styles.formulario}>
                    <Text style={styles.rotulo}>Nome completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.rotulo}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.rotulo}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <Text style={styles.rotulo}>Confirmar senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Repita a senha"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                    />

                    {carregando ? (
                        <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 16 }} />
                    ) : (
                        <TouchableOpacity style={styles.botaoPrincipal} onPress={criarConta}>
                            <Text style={styles.textoBotaoPrincipal}>Cadastrar</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.linkVoltar}>Já tenho uma conta</Text>
                    </TouchableOpacity>
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
        paddingTop: 70,
        paddingBottom: 30,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff"
    },
    subtitulo: {
        fontSize: 13,
        color: "#fff",
        marginTop: 4
    },
    formulario: {
        padding: 24
    },
    rotulo: {
        fontSize: 14,
        color: "#212121",
        marginBottom: 6,
        fontWeight: "600"
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#eee"
    },
    botaoPrincipal: {
        backgroundColor: "#FF6B35",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 12
    },
    textoBotaoPrincipal: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    linkVoltar: {
        color: "#FF6B35",
        textAlign: "center",
        marginTop: 18,
        fontSize: 14,
        fontWeight: "600"
    }
})

export default RegistroScreen
