import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView, Alert, ToastAndroid} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';
import firebase from '../config';

const bg = require('../assets/background2.png');
const logo = require('../assets/appIcon.png');
const appName = require("../assets/appName.png");

export default class Login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
        }
    }

    logar = (email,password) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            this.props.navigation.navigate("Navegador")
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }


    render() {
        const { email, password } = this.state;
        return (
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ImageBackground source={bgImage} style={styles.bgImage}>
              <View style={styles.upperContainer}>
                <Image source={appIcon} style={styles.appIcon} />
                <Image source={appName} style={styles.appName} />
              </View>
              <View style={styles.lowerContainer}>
                <TextInput
                  style={styles.textinput}
                  onChangeText={text => this.setState({ email: text })}
                  placeholder={"Insira seu Email"}
                  placeholderTextColor={"#FFFFFF"}
                  autoFocus
                />
                <TextInput
                  style={[styles.textinput, { marginTop: 20 }]}
                  onChangeText={text => this.setState({ password: text })}
                  placeholder={"Insira sua Senha"}
                  placeholderTextColor={"#FFFFFF"}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[styles.button, { marginTop: 20 }]}
                  onPress={() => this.logar(email, password)}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        );
    }
}