import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Pesquisa from "../telas/pesquisa";
import Transacao from "../telas/transacao";

const Tab = createBottomTabNavigator();

class Navegador extends React.Component {
    render(){
        return (
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name = "Pesquisa" component={Pesquisa}/>
                    <Tab.Screen name = "Transações" component={Transacao}/>
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}

export default Navegador