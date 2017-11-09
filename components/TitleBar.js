import React from "react"
import { Text, StyleSheet, View } from "react-native"

export default class TitleBar extends React.Component {
  render() {
    return (
      <View style={styles.bar}>
        <Text style={styles.title}>{this.props.children}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bar: {
    height: 50,
    backgroundColor: "#7ab800"
  },
  title: {
    color: "#fff",
    fontSize: 24,
    padding: 10
  }
})
