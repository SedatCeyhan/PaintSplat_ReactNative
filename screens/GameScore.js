import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { TouchableOpacity } from 'react-native-gesture-handler'


const GameScore = ({navigation, route}) => {
    
    return (
        <View>
            <View style={styles.gameOverMessageText}>
                <Text style={[{fontSize: 50,fontWeight: "bold"}, route.params.message==="You Win!" ? 
                {color:'blue'} : {color:'red'}]}>{route.params.message}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 65}}>
                <View style={{alignItems:'center'}}>
                    <Text style={[styles.playerNameText, {color: '#Ff0005'}]}>{route.params.redPlayer}</Text>

                    <Text style={[styles.scoreText, {color: '#Ff0005'}]}>{route.params.redScore}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={[styles.playerNameText, {color: '#31e0dc'}]}>{route.params.bluePlayer}</Text>
                    <Text style={[styles.scoreText, {color: '#31e0dc'}]}>{route.params.blueScore}</Text>
                </View>

            </View>
            <View style={{justifyContent: 'center', alignItems:'center', marginTop: 60}}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Paintsplat Project (ASE)")}>
                    <Text style={{color:'white', fontSize: 20, fontWeight: 'bold'}}>Return Home</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                    <Text>Play Again!</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

export default GameScore

const styles = StyleSheet.create({
    gameOverMessageText:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        
    },
    playerNameText:{
        fontSize: 40
    },
    scoreText:{
        fontSize: 70,
        marginTop: 20
    },
    button:{
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 99
    }
})
