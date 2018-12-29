<template>
  <div class="about">
    <h1>This is a current location page</h1>
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Luftdaten sensor ID : {{ sensor_id }}
  </h4>
  <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_PM10"></pm10component>
  </div>
</div>
</template>

<script>
    import axios from 'axios'
    import pm25component from '../components/pm25component.vue'
    import pm10component from '../components/pm10component.vue'

    export default {
      name: 'currentLocation',
      data() {
        return {
          sensor_id: null,
          sensor_PM25: NaN,
          sensor_PM10: NaN,
          sensor_lufdaten_timestamp: null,
          lat: null,
          lon: null
      }
  },
  created: function () {
        // `this` points to the vm instance
        this.getCurrentLocation();
    },
    components: { 
        pm25component, 
        pm10component 
    },
    methods: {
        fetchData: function() {
          console.log('Fetching data...');
          this.$getLocation({
            enableHighAccuracy: true, //defaults to false
            timeout: Infinity, //defaults to Infinity
            maximumAge: 0 //defaults to 0
          })
          .then(coordinates => {
            console.log(coordinates)
            console.log('LATITUDE1: ' + coordinates.lat)
            console.log('http://api.luftdaten.info/v1/filter/area=' + coordinates.lat + ',' + coordinates.lng +',1&type=SDS011')
            axios
              .get('http://api.luftdaten.info/v1/filter/area=' + coordinates.lat + ',' + coordinates.lng +',1&type=SDS011')
              .then(response => {
                console.log(response.data[0].sensor.id)
                this.sensor_id = response.data[0].sensor.id
                this.sensor_PM25 = response.data[0].sensordatavalues[1].value
                this.sensor_PM10 = response.data[0].sensordatavalues[0].value
                var utcDate = new Date(response.data[0].timestamp + 'Z')
                this.sensor_lufdaten_timestamp = utcDate.toLocaleString()
              })
          });  

          //console.log('http://api.luftdaten.info/v1/filter/area=' + coordinates.latitude + ',' + coordinates.longitude +',1&type=SDS011');
          
          // axios
          // .get('http://api.luftdaten.info/v1/filter/area=' + coordinates.latitude + ',' + coordinates.longitude +',1&type=SDS011')
          // .then(response => {
          //     console.log(response)
          //     this.sensor_PM25 = response.data[0].sensordatavalues[1].value
          //     this.sensor_PM10 = response.data[0].sensordatavalues[0].value
          //     var utcDate = new Date(response.data[0].timestamp + 'Z')
          //     this.sensor_lufdaten_timestamp = utcDate.toLocaleString()
          // })
          
      },
      getCurrentLocation: function() {
        // `this` points to the vm instance
        this.$getLocation({
          enableHighAccuracy: false, //defaults to false
          timeout: Infinity, //defaults to Infinity
          maximumAge: 0 //defaults to 0
      })
        .then(coordinates => {
            //console.log(coordinates);
            this.lat = coordinates.latitude;
            this.lon = coordinates.longitude;
        });        
    }
},
updated () {
    this.getCurrentLocation();
    this.fetchData()
},
mounted () {
    this.getCurrentLocation();
    this.fetchData()
}
}
//http://api.luftdaten.info/v1/filter/area=50.871814300000004,4.7148129999999995,0.07&type=SDS011
</script>