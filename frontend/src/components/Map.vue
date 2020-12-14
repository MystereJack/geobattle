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

export default {
    name: "Map",
    data: () => ({
    }),
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
            layer.on('click', () => self.selectCountry(feature.properties))
            layer.on('mouseover', () => { 
                layer.setStyle({
                    fillColor: '#FFE360'
                })  
            })
            layer.on('mouseout', () => { 
                layer.setStyle({
                    fillColor: '#FFFAC3'
                })  
            })
        },
        selectCountry(selectedCountry) {
            this.$emit('selected', (selectedCountry))
        },
        setup: function() {
            const mapDiv = L.map("mapContainer").setView([35,35], 3);
            L.tileLayer("https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 6,
                minZoom: 3,
                wheelPxPerZoomLevel: 150,
            }).addTo(mapDiv);
            L.geoJSON(data, { 
                onEachFeature: this.onEachFeature, 
                style: this.defineStyle 
            }).addTo(mapDiv)
            this.addMarkers(mapDiv)
        },
        addMarkers: function(mapDiv) {
            smallCountries.markers.forEach((item) => {
                L.circle(item.latLng, {
                    color: '#ACACAC', 
                    fillColor: '#FFF7A0', 
                    fillOpacity: 1,
                    weight: 2,
                    radius: 30000
                }).addTo(mapDiv)
                  .on('click', () => this.selectCountry(item))
                  .on('mouseover', (e) => e.target.setStyle({
                    fillColor: '#FFE360', 
                  }))
                  .on('mouseout', (e) => e.target.setStyle({
                     fillColor: '#FFF7A0', 
                  }))
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