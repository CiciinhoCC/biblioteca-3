import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Navegador from "./componentes/navegador";
import Login from "./telas/login";
import { createSwitchNavigator } from "react-navigation-switch";
import { createAppContainer } from "react-navigation";

const Switch = createSwitchNavigator({
  login: {
    screen: Login
  },
  Navegador : {
    screen: Navegador
  }
});

const Container = createAppContainer(Switch);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }


  async loadFonts() {
    await Font.loadAsync({
      Rajdhani_600SemiBold: Rajdhani_600SemiBold
    });
    this.setState({ fontLoaded: true });
  }


  componentDidMount() {
    this.loadFonts();
  }

  render(){
    const {fontLoaded} = this.state
    if(fontLoaded){
      return (
        <Container/>

      ); 
    }
    return null
  }
}

