/* eslint-disable*/
import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgUri from 'react-native-svg-uri';
import BigSvg from '../../Assets/Svg/BigLogo.svg'


import checkLogin from '../api/checkLogin';
import getToken from '../api/getToken';
import LoginApi from '../api/LoginApi';

class Login extends Component {

    static navigationOptions = {
        title: 'Log In'
    };

    constructor(props) {
        super(props);
        this.state = {
            url: 'https://seratone.it/', 
            user: '',
            pass: '',
        };
    }
    
   
    _validate() {
        const { user, pass } = this.state;
    
        if (user === '') {
            alert('Enter User');
            return false;
        }
    
        if (pass === '') {
            alert('Enter Password');
            return false;
        }
    
        return true; 
    }
    
    _onLogin = async () => {
        if (!this._validate()) {
            return;
        }
    
        const { navigate } = this.props.navigation;
        const { url, user, pass } = this.state;
        

        await LoginApi( url, user, pass )
        .then( (resjson) => {
         
            if( resjson.status === 'SUCCESS' && this.saveToStorage( resjson.token ) ){
                alert( resjson.msg );
                navigate( 'Events' );
            }else if( resjson.status === 'FAIL' ) {
                alert( resjson.msg );
            }
            
        } )
        .catch( (err) => { console.log(err) } );
       
    }

    async saveToStorage( token ){

        if( token ){

            await AsyncStorage.setItem( '@token', token );
            await AsyncStorage.setItem( '@isLoggedIn', '1' );
            await AsyncStorage.setItem( '@url', this.state.url );

            return true;
        }

        return false;

    }
    


    render() {
        const { user, pass } = this.state;

        return (
            <View style={styles.MainWrapper}>
                 <View style={styles.LogoWrapper}>
            <SvgUri width="300" height="300" source={require('../../Assets/Svg/BigLogo.svg')} /> 
            </View>
            <View style={styles.container}>
               

                <TextInput
                  style={styles.input}
                  placeholder="User"
                  autoCapitalize = 'none'
                  onChangeText={ user => this.setState({user})}
                  value={user}
                  placeholderTextColor="#666666"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  autoCapitalize = 'none'
                  onChangeText={ pass => this.setState({pass})}
                  value={pass}
                  secureTextEntry
                  keyboardType="default"
                  placeholderTextColor="#666666"
                />
               

                <TouchableOpacity style={styles.btn} onPress={ this._onLogin.bind(this) }>
                    <Text style={styles.btn_text}>
                        Log In
                    </Text>
                </TouchableOpacity>


                
                
            </View>
           
            </View>
        );
    }
}



const styles = StyleSheet.create({
    MainWrapper:{
       
    backgroundColor: '#c0d6f1',
    flex:1,
},

    LogoWrapper:{
       
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
       
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    input: {
        height: 40, 
        width: 250, 
        paddingLeft: 10, 
        paddingRight: 10, 
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#333333'
    },
    btn: {
        height: 40,
        width: 120,
        backgroundColor: '#e86c60',
        borderColor: '#e86c60',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
        borderRadius: 5
    }

});

export default  Login;
