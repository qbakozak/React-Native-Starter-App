import React from "react"
import { StyleSheet, View } from "react-native"

export default class TopBar extends React.Component {
  render() {
    return <View style={styles.infoBar} />
  }
}

const styles = StyleSheet.create({
  infoBar: {
    height: 22,
    backgroundColor: "#fff"
  }
})
