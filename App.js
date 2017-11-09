import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"

import TopBar from "./components/TopBar"
import TitleBar from "./components/TitleBar"

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      region: {
        latitude: -37.816321934232676,
        longitude: 144.96471241728312,
        latitudeDelta: 0.010000246445827088,
        longitudeDelta: 0.013543814420700073
      },
      coffeeShops: [],
      loading: false
    }
  }

  loadData() {
    this.setState({
      loading: true
    })

    const { region } = this.state

    const scale = 0.45
    const lat1 = region.latitude - region.latitudeDelta * scale
    const long1 = region.longitude - region.longitudeDelta * scale
    const lat2 = region.latitude + region.latitudeDelta * scale
    const long2 = region.longitude + region.longitudeDelta * scale

    const url = `https://data.melbourne.vic.gov.au/resource/erx6-js9z.json?$where=within_box(location,${
      lat1
    },${long1},${lat2},${long2})&$limit=100`

    fetch(url)
      .then(response => {
        const data = JSON.parse(response._bodyInit)

        const coffeeShops = data.filter(d => d.location)

        this.setState({
          coffeeShops,
          loading: false
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  onRegionChange(region) {
    this.setState({ region })
  }

  zoom(type) {
    const { region } = this.state

    const scale = type === "in" ? 0.1 : 10
    const newRegion = {
      latitude: region.latitude,
      latitudeDelta: region.latitudeDelta * scale,
      longitude: region.longitude,
      longitudeDelta: region.longitudeDelta * scale
    }

    this.setState({
      region: newRegion
    })
  }

  render() {
    const { coffeeShops, region, loading } = this.state

    return (
      <View style={styles.container}>
        <TopBar />
        <TitleBar>Melbourne City Coffee Shops</TitleBar>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange.bind(this)}
        >
          {coffeeShops.map((place, index) => {
            const coordinate = {
              latitude: place.location.coordinates[1],
              longitude: place.location.coordinates[0]
            }

            const description = `Address: ${place.street_address}
Number of seats: ${place.number_of_seats}
Seating type: ${place.seating_type}`

            return (
              <MapView.Marker
                key={index}
                coordinate={coordinate}
                title={place.trading_name}
                description={description}
              />
            )
          })}
        </MapView>
        <TouchableOpacity
          onPress={() => this.zoom("in")}
          style={styles.buttons}
        >
          <Text> Zoom In </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.zoom("out")}
          style={styles.buttons}
        >
          <Text> Zoom Out </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.loadData()}
          style={styles.buttons}
        >
          <Text>
            {loading ? "Loading..." : "Load shops for current view.."}
          </Text>
        </TouchableOpacity>
        <Text style={styles.info}>
          Coffee Shops found: {coffeeShops.length}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ddd"
  },
  buttons: {
    height: 30,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 5,
    margin: 5
  },
  map: { flex: 0.8 },
  info: {
    padding: 10
  }
})
