<template>
  <div class="home">
    <br>
    <select v-on:change="fetchData" v-model="sensor_id" :options="sensors">
      <option v-for="sensor in sensors" :value="sensor.value">{{ sensor.text }}</option>
    </select>
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Luftdaten sensor {{ sensor_id.dust_sensor_id }}
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_PM10"></pm10component>
    </div>
    <p><i class="clock icon"></i>{{ sensor_lufdaten_timestamp_minutes }} minutes ago</p>
    <!-- <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Irceline Aarschot
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_irceline_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_irceline_PM10"></pm10component>
    </div> -->
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Irceline Leuven (Interpolated)
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_irceline_PM25_interpolated"></pm25component>
      <pm10component v-bind:pm10="sensor_irceline_PM10_interpolated"></pm10component>
    </div>
    <p><i class="clock icon"></i>{{ sensor_irceline_timestamp }} minutes ago</p>
    <!-- <p>The Irceline value was measured {{ sensor_irceline_timestamp }} minutes ago</p> -->
    <div class="ui statistics">
      <h4 class="ui horizontal divider header">
        <i class="bar chart icon"></i>
        Temperature (Luftdaten sensor {{ this.sensor_id.temp_sensor_id }})
      </h4>
      <div class="grey statistic">
        <div class="value">
          {{ sensor_temp_full }}
        </div>
        <div class="label">
          Temp
        </div>
      </div>
      <div class="grey statistic">
        <div class="value">
          {{ sensor_humidity }}
        </div>
        <div class="label">
          Humidity
        </div>
      </div>
    </div>
    <h4 class="ui horizontal divider header">
        <i class="bar chart icon"></i>
        History
      </h4>
    <iframe v-bind:src="'https://maps.luftdaten.info/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=2&var-node=' +      sensor_id.dust_sensor_id + '&from=\'' + graph_startDate + '\'&to=\'' + graph_endDate + '\''" width="100%" height="auto" frameborder="0"></iframe>
    <br>
    <iframe v-bind:src="'https://maps.luftdaten.info/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=1&var-node=' +      sensor_id.dust_sensor_id + '&from=\'' + graph_startDate + '\'&to=\'' + graph_endDate + '\''" width="100%" height="auto" frameborder="0"></iframe>


    <cookie-law theme="blood-orange--rounded"></cookie-law>
  </div>
</template>

<script>

  import axios from 'axios'
  import pm25component from '../components/pm25component.vue'
  import pm10component from '../components/pm10component.vue'
  import CookieLaw from 'vue-cookie-law'
  import sensor_list from '../assets/sensor_list.json'
  
  function checkTemperature(sensordatavalue) {
    return (sensordatavalue.value_type == "temperature")
  }

  function checkHumidity(sensordatavalue) {
    return (sensordatavalue.value_type == "humidity")
  }

  function checkPM25(sensordatavalue) {
    return (sensordatavalue.value_type == "P2")
  }

  function checkPM10(sensordatavalue) {
    return (sensordatavalue.value_type == "P1")
  }

  export default {
    name: 'home',
    created: function () {
    },
    data() {
      return {
        sensor_id: null,
        sensor_PM25: NaN,
        sensor_PM10: NaN,
        sensor_color: null,
        sensor_lufdaten_timestamp_hours: null,
        sensor_lufdaten_timestamp_minutes: null,
        sensor_temp_full: null,
        sensor_irceline_PM25: NaN,
        sensor_irceline_timestamp: null,
        sensor_irceline_PM10: NaN,
        sensor_irceline_PM25_interpolated: NaN,
        sensor_irceline_PM10_interpolated: NaN,
        sensor_humidity: null,
        graph_startDate: null,
        graph_endDate: null,
        sensors: sensor_list
      }
    },
    components: { 
      pm25component, 
      pm10component,
      CookieLaw
    },
    methods: {
      fetchData: function() {

        //calculate dates for graphs
        var nowDate = new Date()
        var myDate = new Date()
        myDate.setHours(nowDate.getHours() - 60)
        if (this.graph_startDate == null)
          { 
            console.log(myDate)
            console.log(myDate.getTime()/1000|0)
            this.graph_startDate = myDate.getTime()/1000|0
            this.graph_endDate = nowDate.getTime()/1000|0
          }

        console.log('Fetching Data')
        //console.log('Setting the cookie');
        if (this.sensor_id !== null)
          {this.$cookies.set('sensor_id', this.sensor_id)}
        //console.log('Fetching data...');
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.dust_sensor_id + '/')
        .then(response => {
          if (response.data.length > 0) {
            //console.log(response)
            this.sensor_PM25 = Number(response.data[0].sensordatavalues.find(checkPM25).value)
            this.sensor_PM10 = Number(response.data[0].sensordatavalues.find(checkPM10).value)
            var utcDate = new Date(response.data[0].timestamp.replace(/\s/, 'T') + 'Z')
            var now = new Date()
            var difference = now - utcDate
            this.sensor_lufdaten_timestamp_minutes = Math.ceil(difference / 1000 / 60) //convert value in milliseconds to minutes
          }
          else {
            //console.log('no value received')
            this.sensor_PM10 = NaN
            this.sensor_PM25 = NaN
            this.sensor_lufdaten_timestamp_minutes = null
          }
        })
        .catch((error) => {
          this.sensor_PM10 = NaN
          this.sensor_PM25 = NaN
          this.sensor_lufdaten_timestamp_minutes = null
          console.log(error)
        });
        axios
        .get('https://geo.irceline.be/ows?service=WFS&version=1.3.0&request=GetFeature&typeName=rio:pm25_hmean&cql_filter=id=985&outputformat=json') //Real-time interpolated value
        .then(response => {
          //console.log(response)
          //console.log(response.data.features[0].properties.value)
          //var features = response.data.features
          //var features_with_value = features.filter(checkValueNotMinus99)
          var features_with_value_sorted = response.data.features.sort(function(a, b){return a.properties.timestamp - b.properties.timestamp})
          var feature_to_display = features_with_value_sorted[features_with_value_sorted.length - 1]
          this.sensor_irceline_PM25_interpolated = feature_to_display.properties.value

          var irceline_date_string = feature_to_display.properties.timestamp
          var irceline_date = new Date(irceline_date_string)
          var now_for_irceline = new Date()
          var difference_irceline = now_for_irceline - irceline_date
          this.sensor_irceline_timestamp = Math.ceil(difference_irceline / 1000 / 60) //convert value in milliseconds to minutes
          
        });
        axios
        .get('https://geo.irceline.be/ows?service=WFS&version=1.3.0&request=GetFeature&typeName=rio:pm10_hmean&cql_filter=id=985&outputformat=json') //Real-time interpolated value
        .then(response => {
          //console.log(response)
          //console.log(response.data.features[0].properties.value)
          //var features = response.data.features
          //var features_with_value = features.filter(checkValueNotMinus99)
          var features_with_value_sorted = response.data.features.sort(function(a, b){return a.properties.timestamp - b.properties.timestamp})
          var feature_to_display = features_with_value_sorted[features_with_value_sorted.length - 1]
          this.sensor_irceline_PM10_interpolated = feature_to_display.properties.value
        });
        axios
        .get('https://geo.irceline.be/sos/api/v1/timeseries/100014') //irceline pm25 sensor
        .then(response => {
          if (response.data !== undefined) {
            this.sensor_irceline_PM25 = Number(response.data.lastValue.value)
            //this.sensor_irceline_timestamp = response.data.lastValue.timestamp
          }
          else {
            this.sensor_irceline_PM25 = NaN
            //this.sensor_irceline_timestamp = null
          }
        });
        axios
        .get('https://geo.irceline.be/sos/api/v1/timeseries/6716') //irceline pm10 sensor
        .then(response => {
          if (response.data !== undefined) {
            this.sensor_irceline_PM10 = Number(response.data.lastValue.value)
          }
          else {
            this.sensor_irceline_PM10 = NaN
          }
        });
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.temp_sensor_id + '/')
        .then(response => {
          if (response.data.length > 0) {
            this.sensor_humidity = response.data[0].sensordatavalues.find(checkHumidity).value
          }
          else {
            this.sensor_humidity = "..."
          }
          })
        .catch((error) => {
          this.sensor_humidity = "..."
          console.log(error)
        }
        );
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.temp_sensor_id + '/')
        .then(response => {
          if (response.data.length > 0) {
            this.sensor_temp_full = response.data[0].sensordatavalues.find(checkTemperature).value
          }
          else {
            this.sensor_temp_full = "..." 
          }
        })
        .catch((error) => {
          this.sensor_temp_full = "..."
          console.log(error)
        })
      }
    },
    updated () {
      //this.fetchData()
    },
    mounted () {
      //reading the default sensor from a cookie
      console.log("reading the cookie");
      if (this.$cookies.isKey('sensor_id'))
      {
        this.sensor_id = this.$cookies.get('sensor_id')
      }
      else
      { 
        this.sensor_id = { 
          dust_sensor_id: 12030,
          temp_sensor_id: 12031
        }
      }
      console.log("cookie content: " + this.$cookies.get('sensor_id').dust_sensor_id);
      this.fetchData()
    }
  }
</script>
