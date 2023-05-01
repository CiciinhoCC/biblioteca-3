import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Transacao extends React.Component {
    constructor(){
        super();
        this.state = {
            appState: 'normal',
            permissao: null,
            scanned: false,
            dado: "",
        }
    }

    getCameraPermissions = async() => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            permissao: status === 'granted',
            appState: 'scan',
        })
    }

    handleBarCodeScanned = async({type, data}) => {
        this.setState({
            dado: data,
            scanned: true,
            appState: 'normal',
        })
    }

    render(){

        const {appState,permissao,scanned,dado} = this.state;
        if(appState === 'scan'){
            return(<BarCodeScanner onBarCodeScanned={scanned? undefined : this.handleBarCodeScanned()}/>)
        }


        return (
            <View style = {styles.site}>
                <TouchableOpacity onPress = {() => {
                    this.getCameraPermissions()
                }}>
                    <Text>
                        Digitalizar QR Code 
                    </Text>


                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    site:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5653d4',        
    },
    text: {
        color: '#fff',
        fontSize: 30,
    }
})

export default Transacao