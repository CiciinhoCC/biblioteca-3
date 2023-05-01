import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

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

    render(){

        const {appState,permissao,scanned,dado} = this.state;
        if(appState !== 'normal'){
            return(<BarCodeScanner onBarCodeScanned={scanned? undefined : this.handleBarCodeScanned()}/>)
        }


        return (
            <View style = {styles.container}>
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
                    <TouchableOpacity onPress = {() => {
                        this.getCameraPermissions()
                    }}>
                        <Text>
                            Digitalizar QR Code 
                        </Text>


                    </TouchableOpacity>
                </ImageBackground> 
            </View>
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
    }
   });   

export default Transacao