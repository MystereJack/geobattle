var markers = [
  {coords: [41.90, 12.45], name: 'Vatican City'},
  {coords: [43.73, 7.41], name: 'Monaco'},
  {coords: [-0.52, 166.93], name: 'Nauru'},
  {coords: [-8.51, 179.21], name: 'Tuvalu'},
  {coords: [43.93, 12.46], name: 'San Marino'},
  {coords: [47.14, 9.52], name: 'Liechtenstein'},
  {coords: [7.11, 171.06], name: 'Marshall Islands'},
  {coords: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
  {coords: [3.2, 73.22], name: 'Maldives'},
  {coords: [35.88, 14.5], name: 'Malta'},
  {coords: [12.05, -61.75], name: 'Grenada'},
  {coords: [13.16, -61.23], name: 'Saint Vincent and the Grenadines'},
  {coords: [13.16, -59.55], name: 'Barbados'},
  {coords: [17.11, -61.85], name: 'Antigua and Barbuda'},
  {coords: [-4.61, 55.45], name: 'Seychelles'},
  {coords: [7.35, 134.46], name: 'Palau'},
  {coords: [42.5, 1.51], name: 'Andorra'},
  {coords: [14.01, -60.98], name: 'Saint Lucia'},
  {coords: [6.91, 158.18], name: 'Federated States of Micronesia'},
  {coords: [1.3, 103.8], name: 'Singapore'},
  {coords: [1.46, 173.03], name: 'Kiribati'},
  {coords: [-21.13, -175.2], name: 'Tonga'},
  {coords: [15.3, -61.38], name: 'Dominica'},
  {coords: [-20.2, 57.5], name: 'Mauritius'},
  {coords: [26.02, 50.55], name: 'Bahrain'},
  {coords: [0.33, 6.73], name: 'São Tomé and Príncipe'}
];

var map = new JsVectorMap({
  map: 'world',
  selector: '#map-wrapper',
  zoomButtons: false,
  showTooltip: false,

  regionsSelectable: true,
  regionsSelectableOne: true,
  markersSelectable: true,
  markersSelectableOne: true,

  // -------- Events --------
  onRegionSelected: function (index, isSelected, selectedRegions) {
    if(isSelected) {
      this.clearSelectedMarkers()
      selectCountry(index)
    }
  },
  onMarkerSelected: function (index, isSelected, selectedMarkers) {
    if(isSelected) {
      this.clearSelectedRegions()
      selectCountry(index)
    }
  },
  onRegionTooltipShow (tooltip, index) {
	  //tooltip.hide();
  },	  
  onMarkerTooltipShow (tooltip, index) {		
	  tooltip.hide();
  },

  // -------- Labels --------
  labels: {
	markers: {
	  render: function(index) {
		return "";
	  },
	  offsets: function(index) {
		return markers[index].offset || [0, 0]
	  }
	},
	regions: {
	  render: function(code) {
		return '';
	  },
	}
  },

  // -------- Region and label style --------
  regionStyle: {
	initial: {
	  fill: "#F9E296"
	},
	selected: {
	  fill: "#FF0000"
	}
  },
  regionLabelStyle: {
	initial: {
	  fontFamily: 'Poppins',
	  fontSize: 25,
	  fontWeight: 500,
	  fill: '#FF0000',
	},
  },

 // -------- Marker and label style --------
  markers: 
    markers,
    markerStyle: {
    initial: {
      fill: '#F9E296'
    },
    hover: {
      stroke: "#676767",
      fillOpacity: 1,
      strokeWidth: 2.5,
      fill: '#ff5566'
    },
    selected: {
      fill: '#ff9251'
    }
    },
    markerLabelStyle: {
    initial: {
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 500,
      fill: '#BD981C',
    },
  },
})

function $(selector) {
  return document.querySelector(selector)
}