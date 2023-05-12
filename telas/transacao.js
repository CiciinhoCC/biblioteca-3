import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, KeyboardAvoidingView, Alert, ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import db from "./config";


const bg = require('../assets/background2.png');
const logo = require('../assets/appIcon.png');
const appName = require("../assets/appName.png");



class Transacao extends React.Component {
    constructor(){
        super();
        this.state = {
            appState: 'normal',
            permissao: null,
            scanned: false,
            bookId: '',
            studentId: '',
            bookName: '',
            studentName: '',
        }
    }

    getCameraPermissions = async(input) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            permissao: status === 'granted',
            appState: input,
        })
    }

    handleBarCodeScanned = async({type, data}) => {
        const {appState} = this.state
        if(appState === 'bookId'){
            this.setState({
                bookId: data,
                scanned: true,
                appState: 'normal',
            })
        }
        if(appState === 'studentId'){
            this.setState({
                studentId: data,
                scanned: true,
                appState: 'normal',
            })
        }
    }

    initiateBookIssue = async(bookName,studentName,bookId,studentId) => {
        db.collection('transactions').add({
            book_id: bookId,
            book_name: bookName,
            date: firebase.firestore.TimeStamp.now().toDate,
            student_id: studentId,
            student_name: studentName,
            transaction_type: "issue"
        });
        db.collection('books').doc(bookId).update({
            available: false,
        });
        db.collection('students').doc(studentId).update({
            books_issued: firebase.firestore.FieldValue.increment(1)
        });
        this.setState({
            bookId: '',
            studentId: '',
        })
    }
    initiateBookReturn = async(bookName,studentName,bookId,studentId) => {
        db.collection('transactions').add({
            book_id: bookId,
            book_name: bookName,
            date: firebase.firestore.TimeStamp.now().toDate,
            student_id: studentId,
            student_name: studentName,
            transaction_type: "return"
        });
        db.collection('books').doc(bookId).update({
            available: true,
        });
        db.collection('students').doc(studentId).update({
            books_issued: firebase.firestore.FieldValue.increment(-1)
        });
        this.setState({
            bookId: '',
            studentId: '',
        })
    }
    getBook = async(bookId) => {
        db.collection('books').where("book_id", "==", bookId).get().then((docs) => {
            docs.docs.map((doc) => {
                this.setState({
                    bookName: doc.data().book_name
                })
            })
        })
    }
    getStudent = async(studentId) => {
        db.collection('students').where("student_id", "==", studentId).get().then((docs) => {
            docs.docs.map((doc) => {
                this.setState({
                    studentName: doc.data().student_name
                })
            })
        })

    }

    handleTransaction = async() => {
        var {bookId, studentId} = this.state;
        await this.getBook(bookId);
        await this.getStudent(studentId);
        var tipo = await this.checarLivro(bookId)
        if(!tipo){Alert.alert("Livro não existe 😱"); this.setState({bookId: '', studentId: '',})}
        else if(tipo === 'issue'){
                var aluno = await this.checarEmprestimo(studentId);
                if(aluno){
                    var {bookName, studentName} = this.state;
                    this.initiateBookIssue(bookName,studentName,bookId,studentId);
                    Alert.alert("Entregue 😁")
                }
            }
            else{
                var aluno = await this.checarDevolvimento(bookId,studentId);
                if(aluno){
                    var {bookName, studentName} = this.state;
                    this.initiateBookReturn(bookName,studentName,bookId,studentId)
                    ToastAndroid.show("Devolvido 😀", ToastAndroid.SHORT)
                }
            }
    }

    checarDevolvimento = async(bookId,studentId) => {
        const consulta = await db.collection("transactions").where("book_id", "==", bookId).limit(1).get();
        var tipo = '';
        consulta.docs.map((doc) => {
            if(doc.data().student_id === studentId){
                tipo = true;
            }
            else{
                tipo = false;
                Alert.alert('Não foi esse aluno que retirou 😲');
                this.setState({bookId: '', studentId: '',})
            }
        })
        return tipo;
    }

    checarEmprestimo = async(studentId) => {
        const consulta = await db.collection("students").where("student_id", "==", studentId).get();
        var tipo = ""
        if(consulta.docs.length == 0){
            tipo = false;
        }
        else{ consulta.docs.map(() => {if(docs.data.books_issued < 2){
            tipo = true;
                }
            else{
                tipo = false;
                Alert.alert("Aluno fominha 🚨");
                this.setState({bookId: '', studentId: '',})
            }
        })}
        return tipo;
    }

    checarLivro = async(bookId) => {
        const consulta = await db.collection('books').where('book_id', '==', bookId).get();
        var tipo = "";
        if(consulta.docs.length == 0){
            tipo = false;
        }
        else {
            consulta.docs.map((doc) => {
                tipo = doc.data().available? 'issue' : 'return'
            })
        }
        return tipo;
    }

    // precisa se preocupar mais D:

    render(){

        const {appState,permissao,scanned,dado} = this.state;
        if(appState !== 'normal'){
            return(<BarCodeScanner onBarCodeScanned={scanned? undefined : this.handleBarCodeScanned()}/>)
        }


        return (
            <KeyboardAvoidingView style = {styles.container} behavior = "padding">
                <ImageBackground source = {bg} style = {styles.bgImage}>
                    <View style = {styles.upperContainer}>
                        <Image source = {logo} style = {styles.appIcon} />
                        <Image source = {appName} style = {styles.appName} />
                    </View>
                    <View style = {styles.lowerContainer}>
                        <View style = {styles.textInputContainer}>
                            <TextInput style = {styles.textInput}
                            placeHolder = {'ID do livro'}
                            placeHolderTextColor = {'#fff'}
                            value = {bookId} />
                            <TouchableOpacity onPress = {() => {
                            this.getCameraPermissions('bookId')
                            }}>
                                <Text>Digitalizar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.textInputContainer}>
                            <TextInput style = {styles.textInput}
                            placeHolder = {'ID do aluno'}
                            placeHolderTextColor = {'#fff'}
                            value = {studentId} />
                            <TouchableOpacity onPress = {() => {
                            this.getCameraPermissions('studentId')
                            }}>
                                <Text>Digitalizar</Text>
                            </TouchableOpacity>
                        </View>  
                    </View>
                    <TouchableOpacity style = {styles.enviar} onPress = {this.handleTransaction}>
                        <Text style = {styles.enviarText}>
                            Enviar 
                        </Text>


                    </TouchableOpacity>
                </ImageBackground> 
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF"
    },
    bgImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    upperContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    appIcon: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginTop: 80
    },
    appName: {
      width: 180,
      resizeMode: "contain"
    },
    lowerContainer: {
      flex: 0.5,
      alignItems: "center"
    },
    textinputContainer: {
      borderWidth: 2,
      borderRadius: 10,
      flexDirection: "row",
      backgroundColor: "#9DFD24",
      borderColor: "#FFFFFF"
    },
    textinput: {
      width: "57%",
      height: 50,
      padding: 10,
      borderColor: "#FFFFFF",
      borderRadius: 10,
      borderWidth: 3,
      fontSize: 18,
      backgroundColor: "#5653D4",
      fontFamily: "Rajdhani_600SemiBold",
      color: "#FFFFFF"
    },
    scanbutton: {
      width: 100,
      height: 50,
      backgroundColor: "#9DFD24",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center"
    },
    scanbuttonText: {
      fontSize: 20,
      color: "#0A0101",
      fontFamily: "Rajdhani_600SemiBold"
    },
    enviar: {
        width: '43%',
        height: 55,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: "#f48d20",
        marginTop: 15
    },
    enviarText: {
      fontSize: 20,
      color: "#fff",
      fontFamily: "Rajdhani_600SemiBold"
    },

   });   

export default Transacao