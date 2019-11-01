<template>
  <div class="home">
    <br>
    <sui-dropdown  
    :options="sensor_list_string"
    selection
    search
    v-model="sensor_id"
    />
    
    <!--onChange="fetchData" <option v-for="sensor in sensors" :value="sensor">{{ sensor.SDS011ID }} - {{ sensor.STREET_NAME }} {{ sensor.CITY }}</option> 
    v-on:change="fetchData" 
    v-model="sensor_id"-->
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Luftdaten sensor {{ sensor_id }}
    </h4>

    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_PM10"></pm10component>
    </div>
    <p><i class="clock icon"></i>{{ sensor_lufdaten_timestamp_minutes }} minutes ago</p>

    
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Irceline Leuven (Interpolated)
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_irceline_PM25_interpolated"></pm25component>
      <pm10component v-bind:pm10="sensor_irceline_PM10_interpolated"></pm10component>
    </div>
    <p><i class="clock icon"></i>{{ sensor_irceline_timestamp }} minutes ago</p>

    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Experimental corrected value for sensor {{ sensor_id }}
    </h4>
    <div class="ui one statistics">       
      <pm25component v-bind:pm25="corrected_PM25"></pm25component>
    </div>

    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Median Leuvenair 2.5 PM
    </h4>
    <div class="ui one statistics">
      <div class="grey statistic">
        <div class="value">
          {{ median }}
        </div>
        <div class="label">
          PM2.5 (Error: {{ Math.round((median - sensor_irceline_PM25_interpolated) / sensor_irceline_PM25_interpolated * 100)}} %)
        </div>
      </div>
    </div>

    <!-- <p>The Irceline value was measured {{ sensor_irceline_timestamp }} minutes ago</p> -->
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Temperature (Luftdaten sensor {{ this.DHT_sensor_id }})
    </h4>
    <div class="ui two statistics">
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
      Comparison with other Leuvenair sensors
    </h4>
    <div class="ui one statistics">
      <div class="grey statistic">
        <div class="value">
          {{ sensor_comparison }}
        </div>
        <div class="label">
          Based on last 5 minutes; PM2.5; 1 = cleanest sensor
        </div>
      </div>
    </div>

    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Comparison with other Leuvenair sensors
    </h4>
    <div class="ui three statistics">
      <div class="grey statistic">
        <div class="value">
          {{ lowest_value }}
        </div>
        <div class="label">
          Lowest value
        </div>
      </div>
      <div class="grey statistic">
        <div class="value">
          {{ current_value }}
        </div>
        <div class="label">
          Sensor value
        </div>
      </div>
      <div class="grey statistic">
        <div class="value">
          {{ highest_value }}
        </div>
        <div class="label">
          Highest value
        </div>
      </div>
    </div>


    <cookie-law theme="blood-orange--rounded"></cookie-law>
  </div>
</template>

<script>

  import axios from 'axios'
  import pm25component from '../components/pm25component.vue'
  import pm10component from '../components/pm10component.vue'
  import CookieLaw from 'vue-cookie-law'
  import sensor_list from '../assets/sensor_list_new.json'
  
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

  function convertToTextWithValues(sensorlist) {
    var newlist = sensorlist.map(x => JSON.parse('{"text": "' + x.SDS011ID + " - " + x.STREET_NAME + " - " + x.CITY + '", "value": "' + x.SDS011ID + '"}'))
    return newlist
  }

  function getDHTSensorIDFor(idx, sensors) {
    var DHT_sensor_id = sensors.filter(function(x) { return x.SDS011ID == idx; });
    return DHT_sensor_id[0].DHTID
  }

  export default {
    name: 'home',
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
        sensors: sensor_list,
        sensor_comparison: null,
        lowest_value: null,
        highest_value: null,
        current_value: null,
        current: null,
        sensor_list_string: [],
        DHT_sensor_id: null,
        median: null
      }
    },
    components: { 
      pm25component, 
      pm10component,
      CookieLaw
    },
    computed: {
      corrected_PM25: function() {
        if (this.median == null) {
          return NaN
        }
        return (Math.round(this.sensor_irceline_PM25_interpolated / this.median * this.sensor_PM25 * 100) / 100)
      }
    },
    watch: {
      sensor_id: function() {
        // Do something here.
        console.log('changed')
        this.updateCookie()
        this.updateDHTSensor_id()
        this.fetchData()
      }
    },
    methods: {
      fetchComparison: function() {
        console.log('mapping')

        var list_of_IDS = []
        if (this.sensors != null) {
          list_of_IDS = this.sensors.map(x => parseInt(x.SDS011ID));
        }
        
        //console.log(list_of_IDS)

        if (list_of_IDS.length > 0) {  
          let my_body =  
          {
            "sensor": parseInt(this.sensor_id),
            "list_of_sensors": list_of_IDS
          }
          let my_body_in_json = JSON.stringify(my_body);
          const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
          axios
          .post('https://b4wfj1hboi.execute-api.us-east-2.amazonaws.com/production/calculatemedian/',
            my_body_in_json,
            { 
              headers: headers
            }
            )
          .then(response => {
            //console.log(response)
            this.sensor_comparison = response.data.position
            this.highest_value = response.data.highest_value
            this.lowest_value = response.data.lowest_value
            this.current_value = response.data.current_value
            this.median = response.data.median
          })
          .catch((error) => {
            console.log(error)
          })
        }
      },
      updateCookie: function() {
        // whenever the current sensor is modified we update the cookie
        if (this.sensor_id !== null)
          {this.$cookies.set('sensor_sds011id', this.sensor_id)}
      },
      updateDHTSensor_id: function() {
        // whenever the current sensor is modified we execute fetchDate, so we also update the DHT sensor id
        this.DHT_sensor_id = getDHTSensorIDFor(this.sensor_id, this.sensors)
      },
      fetchData: function() {
        console.log('Fetching data for...' + this.sensor_id);

        axios
        .get('https://data.sensor.community/airrohr/v1/sensor/' + this.sensor_id + '/')
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
          var features_with_value_sorted = response.data.features.sort(function(a, b){return a.properties.timestamp - b.properties.timestamp})
          var feature_to_display = features_with_value_sorted[features_with_value_sorted.length - 1]
          this.sensor_irceline_PM10_interpolated = feature_to_display.properties.value
        });
        axios
        .get('https://data.sensor.community/airrohr/v1/sensor/' + this.DHT_sensor_id + '/')
        .then(response => {
          if (response.data.length > 0) {
            this.sensor_humidity = response.data[0].sensordatavalues.find(checkHumidity).value
            this.sensor_temp_full = response.data[0].sensordatavalues.find(checkTemperature).value
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
        this.fetchComparison()

      }
    },
    updated () {

    },
    created () {

      var sensor_id_cookie
      console.log("reading the cookie");
      if (this.$cookies.isKey('sensor_sds011id'))
      {
        sensor_id_cookie = this.$cookies.get('sensor_sds011id')
      }
      else
      { 
        console.log("using default sensor");
        sensor_id_cookie = "12030"
      }

      this.sensor_id = sensor_id_cookie

      console.log(this.sensor_id)

      console.log("reading the sensor list");
      axios
      .get('https://cors-anywhere.herokuapp.com:443/leuvenair.be/grabmeta.php?active=1')
      .then(response => {
        if (response.data.length > 0) {
          //var old_sensor_id = this.sensor_id
          this.sensors = response.data
          //this.sensor_id = this.sensors.find((element) => element.SDS011ID === old_sensor_id)
          this.sensor_list_string = convertToTextWithValues(this.sensors)
          //console.log(this.sensor_list_string)
          console.log('sensor list updated')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    mounted () {
    }
  }
</script>
