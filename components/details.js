import React from 'react'
import { StyleSheet, Text, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard , Dimensions } from 'react-native';

export default function Details({ navigation }) {
    return (
        <View>
            <Text>{ navigation.getParam('text') }</Text>
            <Text>{ navigation.getParam('time') }</Text>
        </View>
    )
}

