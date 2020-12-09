<template>
    <div id="container">
        <div id="mapContainer"></div>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import data from "../data/countries.geo.json"

export default {
    name: "Map",
    data: () => ({
    }),
    methods: {
        defineStyle: function() {
            return { 
                color: '#E5E5E5',
                fillColor: '#FFF9E5',
                weight: 0.5,
            }
        },
        onEachFeature: function(feature, layer) {
            let self = this
            layer.on('click', () => self.selectCountry(feature.properties))
            layer.on('mouseover', () => { 
                layer.setStyle({
                    fillColor: '#000000'
                })  
            })
            layer.on('mouseout', () => { 
                layer.setStyle({
                    fillColor: '#FFF9E5'
                })  
            })
        },
        setup: function() {
            const mapDiv = L.map("mapContainer").setView([35,35], 3);
            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 6,
                minZoom: 2,
            }).addTo(mapDiv);
            L.geoJSON(data, { onEachFeature: this.onEachFeature, style: this.defineStyle }).addTo(mapDiv)
        },
        selectCountry(selectedCountry) {
            this.$emit('selected', (selectedCountry))
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
        height: 80vh;
    }

    .leaflet-container {
    background-color:rgba(255,0,0,0.0);
}
</style>