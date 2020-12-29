<template>
    <div id="container">
        <div id="mapContainer"></div>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from "leaflet"
// https://geojson-maps.ash.ms/
import data from "../data/custom.geo.json"
import smallCountries from "../data/small.countries.geo.json"
import store from '../store'
export default {
    name: "Map",
    data: () => ({
        mapLayer: new Map(),
        mapDiv: '',
    }),
    watch: {
        '$store.state.selectedCountry': function() {
            if(this.$store.state.selectedCountry) {
                this.mapLayer.get(this.$store.state.selectedCountry.sov_a3).setStyle({
                    fillColor: '#FFE360'
                })
            } else {
                this.mapLayer.forEach((value, key) => {
                    value.setStyle({
                        fillColor: '#FFFAC3'
                    })
                })
                this.mapDiv.flyTo([35,35], 3, {
                    animate: true,
                    duration: 0.5,
                })
            }

        },
        '$store.state.answer': function() {
            if(this.$store.state.answer && this.mapLayer.has(this.$store.state.answer.cca3)) {
                if(this.$store.state.answer.cca3 === this.$store.state.selectedCountry.sov_a3) {
                    this.mapLayer.get(this.$store.state.answer.cca3).setStyle({
                        fillColor: '#96CA8D'
                    })
                } else {
                    this.mapLayer.get(this.$store.state.answer.cca3).setStyle({
                        fillColor: '#F78282'
                    })
                }
                this.mapDiv.flyTo(this.$store.state.answer.latlng, 5, {
                    animate: true,
                    duration: 0.5,
                })
            }
        }
    },
    methods: {
        defineStyle: function() {
            return { 
                color: '#9C9C9C',
                fillColor: '#FFFAC3',
                opacity: 0.75,
                fillOpacity: 1,
                weight: 0.25,
            }
        },
        onEachFeature: function(feature, layer) {
            let self = this
            self.mapLayer.set(feature.properties.sov_a3, layer)
            layer.on('click', () => {
                if(!self.$store.state.selectedCountry) {
                    self.selectCountry(feature.properties)
                }
            })
            layer.on('mouseover', () => { 
                if(!self.$store.state.selectedCountry) {
                    layer.setStyle({
                        fillColor: '#FFE360'
                    })  
                }
            })
            layer.on('mouseout', () => { 
                if(!self.$store.state.selectedCountry) {
                    layer.setStyle({
                        fillColor: '#FFFAC3'
                    })  
                }
            })
        },
        selectCountry(selectedCountry) {
            this.$emit('selected', (selectedCountry))
        },
        setup: function() {
            this.mapDiv = L.map("mapContainer").setView([35,35], 3);
            L.tileLayer("https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 6,
                minZoom: 3,
                wheelPxPerZoomLevel: 150,
                zoomControl: false
            }).addTo(this.mapDiv)
            L.geoJSON(data, { 
                onEachFeature: this.onEachFeature, 
                style: this.defineStyle 
            }).addTo(this.mapDiv)
            this.mapDiv.removeControl(this.mapDiv.zoomControl)
            this.addMarkers()
        },
        addMarkers: function() {
            let self = this
            smallCountries.markers.forEach((item) => {
                const marker = L.circle(item.latLng, {
                        color: '#ACACAC', 
                        fillColor: '#FFF7A0', 
                        fillOpacity: 1,
                        weight: 2,
                        radius: 30000
                    }).addTo(self.mapDiv)
                    .on('click', () => this.selectCountry(item))
                    .on('mouseover', (e) => e.target.setStyle({
                        fillColor: '#FFE360', 
                    }))
                    .on('mouseout', (e) => e.target.setStyle({
                        fillColor: '#FFF7A0', 
                    }))
                this.mapLayer.set(item.sov_a3, marker)
            })
        }
    },
    mounted() {
        this.setup()
    }
}
</script>

<style scoped>
    #mapContainer {
        width: 100vw;
        height: 100vh;
    }

    .leaflet-container {
    background-color:#6AADDD;
}
</style>