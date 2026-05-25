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
    Platform
} from "react-native"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { autenticacao } from "../database/firebase"

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [carregando, setCarregando] = useState(false)

    const loginUsuario = () => {
        if (email === "" || senha === "") {
            Alert.alert("Atenção", "Preencha email e senha.")
            return
        }
        setCarregando(true)
        signInWithEmailAndPassword(autenticacao, email, senha)
        .then(() => {
            setCarregando(false)
        }).catch(erro => {
            setCarregando(false)
            Alert.alert("Erro no login", "Email ou senha incorretos")
        })
    }

    const recuperarSenha = () => {
        if (email === "") {
            Alert.alert("Atenção", "Digite seu email para recuperar a senha.")
            return
        }
        sendPasswordResetEmail(autenticacao, email)
        .then(() => {
            Alert.alert("Pronto!", "Enviamos um link para o seu email.")
        }).catch(erro => {
            Alert.alert("Erro", "Não foi possível enviar o email de recuperação.")
        })
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.cabecalho}>
                <Text style={styles.titulo}>Adota Pet 🐾</Text>
                <Text style={styles.subtitulo}>Encontre um amigo para a vida toda</Text>
            </View>

            <View style={styles.formulario}>
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
                    placeholder="Sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <TouchableOpacity onPress={recuperarSenha}>
                    <Text style={styles.linkRecuperar}>Esqueci minha senha</Text>
                </TouchableOpacity>

                {carregando ? (
                    <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 16 }} />
                ) : (
                    <TouchableOpacity style={styles.botaoPrincipal} onPress={loginUsuario}>
                        <Text style={styles.textoBotaoPrincipal}>Entrar</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.botaoSecundario}
                    onPress={() => navigation.navigate("Registrar")}
                >
                    <Text style={styles.textoBotaoSecundario}>Criar conta</Text>
                </TouchableOpacity>
            </View>
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
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    titulo: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff"
    },
    subtitulo: {
        fontSize: 14,
        color: "#fff",
        marginTop: 6
    },
    formulario: {
        padding: 24,
        marginTop: 20
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
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#eee"
    },
    linkRecuperar: {
        color: "#FF6B35",
        textAlign: "right",
        marginBottom: 16,
        fontSize: 13
    },
    botaoPrincipal: {
        backgroundColor: "#FF6B35",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8
    },
    textoBotaoPrincipal: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    botaoSecundario: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#FF6B35"
    },
    textoBotaoSecundario: {
        color: "#FF6B35",
        fontSize: 16,
        fontWeight: "bold"
    }
})

export default LoginScreen
