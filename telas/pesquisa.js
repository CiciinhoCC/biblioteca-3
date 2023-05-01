import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Pesquisa extends React.Component {
    render(){
        return (
            <View style = {styles.site}>
                <Text style = {styles.text}>oi bodia :)</Text>
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

export default Pesquisa