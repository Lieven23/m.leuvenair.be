<template>
  <div class="home">
    <head>
      <link rel="shortcut icon" type="image/png" href="/assets/lvnr_ico.png"/>
    </head>
    <br>
    <select v-model="sensor_id" :options="sensors">
      <option v-for="sensor in sensors" :value="sensor.value">{{ sensor.text }}</option>
    </select>
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Luftdaten sensor ID : {{ sensor_id.dust_sensor_id }}
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_PM10"></pm10component>
    </div>
    <h4 class="ui horizontal divider header">
      <i class="bar chart icon"></i>
      Irceline Aarschot
    </h4>
    <div class="ui two statistics">       
      <pm25component v-bind:pm25="sensor_irceline_PM25"></pm25component>
      <pm10component v-bind:pm10="sensor_irceline_PM10"></pm10component>
    </div>
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
    <!-- <p>Time LeuvenAir: {{ sensor_lufdaten_timestamp }}</p>
    <p>UTC time Irceline: {{ sensor_irceline_timestamp }}</p> -->
    <cookie-law theme="blood-orange--rounded"></cookie-law>
  </div>
</template>

<script>

  import axios from 'axios'
  import pm25component from '../components/pm25component.vue'
  import pm10component from '../components/pm10component.vue'
  import CookieLaw from 'vue-cookie-law'
  
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
        sensor_lufdaten_timestamp: null,
        sensor_temp_full: null,
        sensor_irceline_PM25: NaN,
        sensor_irceline_timestamp: null,
        sensor_irceline_PM10: NaN,
        sensor_humidity: null,
        sensors: [
        {'value':{dust_sensor_id: 6561,temp_sensor_id: null },'text':' 6561 - Lentedreef - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8745,temp_sensor_id: 8746.0 },'text':' 8745 - Schapenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 8765 ,temp_sensor_id: 8766.0 },'text':' 8765 - Ernest Solvaystraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8769 ,temp_sensor_id: 8770.0 },'text':' 8769 - Tervuursevest - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8773 ,temp_sensor_id: 8774.0 },'text':' 8773 - Alfred Delaunoislaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8775 ,temp_sensor_id: 8776.0 },'text':' 8775 - Sint-Maartensdal - 3000 Leuven '},
        {'value':{dust_sensor_id: 8777 ,temp_sensor_id: 8778.0 },'text':' 8777 - Dekenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 8779 ,temp_sensor_id: 8780.0 },'text':' 8779 - Gemeenteplein - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8781 ,temp_sensor_id: 8782.0 },'text':' 8781 - Diestsesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8783 ,temp_sensor_id: 8784.0 },'text':' 8783 - Diestsesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8785 ,temp_sensor_id: 8786.0 },'text':' 8785 - Wijgmaalbroek - 3018 Wijgmaal '},
        {'value':{dust_sensor_id: 8787 ,temp_sensor_id: 8788.0 },'text':' 8787 - Jozef Wautersstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8789 ,temp_sensor_id: 8790.0 },'text':' 8789 - Leopold Ruelensstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8791 ,temp_sensor_id: 8792.0 },'text':' 8791 - Meugenslaan - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8793 ,temp_sensor_id: 8794.0 },'text':' 8793 - Tervuursevest - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8795 ,temp_sensor_id: 8796.0 },'text':' 8795 - Oudebaan - 3000 Leuven '},
        {'value':{dust_sensor_id: 8797 ,temp_sensor_id: 8798.0 },'text':' 8797 - Schoolbergenstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8799 ,temp_sensor_id: 8800.0 },'text':' 8799 - Kleine Huizenstraat - 3012 Wilsele '},
        {'value':{dust_sensor_id: 8801 ,temp_sensor_id: 8802.0 },'text':' 8801 - Gemeentestraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8803 ,temp_sensor_id: 8804.0 },'text':' 8803 - Leopold Ruelensstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8805 ,temp_sensor_id: 8806.0 },'text':' 8805 - Mechelsevest - 3000 Leuven '},
        {'value':{dust_sensor_id: 8807 ,temp_sensor_id: 8808.0 },'text':' 8807 - Naamsevest - 3000 Leuven '},
        {'value':{dust_sensor_id: 8809 ,temp_sensor_id: 8810.0 },'text':' 8809 - René Verbeeckstraat - 3012 Leuven '},
        {'value':{dust_sensor_id: 8811 ,temp_sensor_id: 8812.0 },'text':' 8811 - Désiré Mellaertsstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8813 ,temp_sensor_id: 8814.0 },'text':' 8813 - Dekenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 8817 ,temp_sensor_id: 8818.0 },'text':' 8817 - Dekenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 8819 ,temp_sensor_id: 8820.0 },'text':' 8819 - Koetsweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8821 ,temp_sensor_id: 8822.0 },'text':' 8821 - Brusselsestraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 8823 ,temp_sensor_id: 8824.0 },'text':' 8823 - Herentsesteenweg - 3012 Wilsele '},
        {'value':{dust_sensor_id: 8825 ,temp_sensor_id: 8826.0 },'text':' 8825 - Bierbeekstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8827 ,temp_sensor_id: 8828.0 },'text':' 8827 - Broekstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8827 ,temp_sensor_id: 8828.0 },'text':' 8827 - Naamsesteenweg - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8829 ,temp_sensor_id: 8830.0 },'text':' 8829 - Leopold Decouxlaan - 3012 Wilsele '},
        {'value':{dust_sensor_id: 8831 ,temp_sensor_id: 8832.0 },'text':' 8831 - Generaal Lemanstraat - 1560 Hoeilaart '},
        {'value':{dust_sensor_id: 8833 ,temp_sensor_id: 8834.0 },'text':' 8833 - Borstelsstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8835 ,temp_sensor_id: 8836.0 },'text':' 8835 - Holsbeeksesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8837 ,temp_sensor_id: 8838.0 },'text':' 8837 - Amerikalaan - 3000 Leuven '},
        {'value':{dust_sensor_id: 8839 ,temp_sensor_id: 8840.0 },'text':' 8839 - Abdijstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8841 ,temp_sensor_id: 8842.0 },'text':' 8841 - Watervloedstraat - 3012 Wilsele '},
        {'value':{dust_sensor_id: 8843 ,temp_sensor_id: 8844.0 },'text':' 8843 - Heidebergstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8845 ,temp_sensor_id: 8846.0 },'text':' 8845 - Diestsesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8849 ,temp_sensor_id: 12054.0 },'text':' 8849 - Leeuwerikenstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8853 ,temp_sensor_id: 8854.0 },'text':' 8853 - Pater Perquylaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 8855 ,temp_sensor_id: 8856.0 },'text':' 8855 - Desiré Mellaertsstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8857 ,temp_sensor_id: 8858.0 },'text':' 8857 - Leuvensesteenweg - 3012 Wilsele '},
        {'value':{dust_sensor_id: 8859 ,temp_sensor_id: 8860.0 },'text':' 8859 - Losting - 3221 Holsbeek '},
        {'value':{dust_sensor_id: 8950 ,temp_sensor_id: 8951.0 },'text':' 8950 - Van Rodestraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 8993 ,temp_sensor_id: 8994.0 },'text':' 8993 - Sluisstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9555 ,temp_sensor_id: 9556.0 },'text':' 9555 - Ketelmakerij - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9559 ,temp_sensor_id: 9560.0 },'text':' 9559 - Dellenhof - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9561 ,temp_sensor_id: 9562.0 },'text':' 9561 - Tervuursesteenweg - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9563 ,temp_sensor_id: 9564.0 },'text':' 9563 - Emile Mathieustraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9565 ,temp_sensor_id: 9566.0 },'text':' 9565 - Jean Baptiste Van Monsstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9567 ,temp_sensor_id: 9568.0 },'text':' 9567 - Langendaallaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9569 ,temp_sensor_id: 9570.0 },'text':' 9569 - René Verbeeckstraat - 3012 Wilsele '},
        {'value':{dust_sensor_id: 9571 ,temp_sensor_id: 9572.0 },'text':' 9571 - Stadionlaan - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9575 ,temp_sensor_id: 9576.0 },'text':' 9575 - Maria Theresiastraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9577 ,temp_sensor_id: 9578.0 },'text':' 9577 - Naamsesteenweg - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9579 ,temp_sensor_id: 9580.0 },'text':' 9579 - Philipslaan - 3000 Leuven '},
        {'value':{dust_sensor_id: 9583 ,temp_sensor_id: 9584.0 },'text':' 9583 - Waversebaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9585 ,temp_sensor_id: 9586.0 },'text':' 9585 - Dagobertstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9587 ,temp_sensor_id: 9588.0 },'text':' 9587 - Gemeentestraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9589 ,temp_sensor_id: 9590.0 },'text':' 9589 - Brouwersstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9591 ,temp_sensor_id: 9592.0 },'text':' 9591 - Biezenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9593 ,temp_sensor_id: 9594.0 },'text':' 9593 - Léon Schreursvest - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9595 ,temp_sensor_id: 9596.0 },'text':' 9595 - Kapucijnenvoer - 3000 Leuven '},
        {'value':{dust_sensor_id: 9597 ,temp_sensor_id: 9598.0 },'text':' 9597 - Albrecht Rodenbachstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9599 ,temp_sensor_id: 9600.0 },'text':' 9599 - Verenigingstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9601 ,temp_sensor_id: 9602.0 },'text':' 9601 - Bergstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9603 ,temp_sensor_id: 9604.0 },'text':' 9603 - Wijnbergenstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9605 ,temp_sensor_id: 9606.0 },'text':' 9605 - Arthur De Greefstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9609 ,temp_sensor_id: 9610.0 },'text':' 9609 - Schapenstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9611 ,temp_sensor_id: 9612.0 },'text':' 9611 - Koningin Astridlaan - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9613 ,temp_sensor_id: 9614.0 },'text':' 9613 - Parkstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 9619 ,temp_sensor_id: 9620.0 },'text':' 9619 - s-Hertogenlaan - 3000 Leuven '},
        {'value':{dust_sensor_id: 9621 ,temp_sensor_id: 9622.0 },'text':' 9621 - Bornestraat - 3012 Wilsele '},
        {'value':{dust_sensor_id: 9623 ,temp_sensor_id: 9624.0 },'text':' 9623 - Martelarenlaan - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9625 ,temp_sensor_id: 9626.0 },'text':' 9625 - Gebroeders Tassetstraat - 3018 Wijgmaal '},
        {'value':{dust_sensor_id: 9631 ,temp_sensor_id: 9632.0 },'text':' 9631 - Groenveldstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9633 ,temp_sensor_id: 9634.0 },'text':' 9633 - Korbeek-losestraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9635 ,temp_sensor_id: 9636.0 },'text':' 9635 - Borstelsstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9637 ,temp_sensor_id: 9638.0 },'text':' 9637 - Geldenaaksebaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 9639 ,temp_sensor_id: 9640.0 },'text':' 9639 - Grensstraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9643 ,temp_sensor_id: 9644.0 },'text':' 9643 - Rietgors - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9753 ,temp_sensor_id: 9754.0 },'text':' 9753 - René Eversstraat - 3020 Herent '},
        {'value':{dust_sensor_id: 9801 ,temp_sensor_id: 9802.0 },'text':' 9801 - Romeinse Ring - 3020 Herent '},
        {'value':{dust_sensor_id: 9812 ,temp_sensor_id: 9813.0 },'text':' 9812 - Gezusters Gregoirestraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 9825 ,temp_sensor_id: 9826.0 },'text':' 9825 - Kapucijnenvoer - 3000 Leuven '},
        {'value':{dust_sensor_id: 10045 ,temp_sensor_id: 10046.0 },'text':' 10045 - Eugeen Vanhoorenbekelaan - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 10739 ,temp_sensor_id: 10740.0 },'text':' 10739 - Tervuursesteenweg - 3001 Heverlee '},
        {'value':{dust_sensor_id: 11201 ,temp_sensor_id: 11202.0 },'text':' 11201 - Holsbeeksesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 11529 ,temp_sensor_id: 11530.0 },'text':' 11529 - Ridderstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 12030 ,temp_sensor_id: 12031.0 },'text':' 12030 - Pleinstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 12183 ,temp_sensor_id: 12184.0 },'text':' 12183 - De Herk - 3060 Bertem '},
        {'value':{dust_sensor_id: 12505 ,temp_sensor_id: 12506.0 },'text':' 12505 - Celestijnenlaan - 3001 Heverlee '},
        {'value':{dust_sensor_id: 12554 ,temp_sensor_id: 12555.0 },'text':' 12554 - Broekstraat - 3001 Heverlee '},
        {'value':{dust_sensor_id: 12609 ,temp_sensor_id: 12610.0 },'text':' 12609 - Holsbeeksesteenweg - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 12855 ,temp_sensor_id: 12856.0 },'text':' 12855 - Hoegaardsestraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 13526 ,temp_sensor_id: 13527.0 },'text':' 13526 - Ernest Solvaystraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 13528 ,temp_sensor_id: 13529.0 },'text':' 13528 - Ernest Solvaystraat - 3010 Kessel-Lo '},
        {'value':{dust_sensor_id: 13649 ,temp_sensor_id: 13650.0 },'text':' 13649 - Wijgmaalsesteenweg - 3020 Herent '},
        {'value':{dust_sensor_id: 14554 ,temp_sensor_id: 14555.0 },'text':' 14554 - Brugstraat - 3000 Leuven '},
        {'value':{dust_sensor_id: 15130 ,temp_sensor_id: 15131.0 },'text':' 15130 - Ellestraat - 3020 Herent '},
        {'value':{dust_sensor_id: 15986 ,temp_sensor_id: 15987.0 },'text':' 15986 - Kiezelstraat - 3078 Meerbeek '},
        {'value':{dust_sensor_id: 16358 ,temp_sensor_id: 16359.0 },'text':' 16358 - Grensstraat - 3010 Kessel-Lo '}
        ],
        sensors_backup: [
        {
          'value': { 
            dust_sensor_id: 6561,
            temp_sensor_id: null
          }, 
          'text': '6561 - Lentedreef - 3010 Kessel-Lo'
        },
        {
          'value': { 
            dust_sensor_id: 12030,
            temp_sensor_id: 12031
          }, 
          'text': '12030 - Pleinstraat - 3001 Heverlee'
        },
        {
          'value': {
            dust_sensor_id: 8745,
            temp_sensor_id: 8746
          }, 
          'text': '8745 - Schapenstraat - 3000 Leuven'
        },
        {
          'value': {
            dust_sensor_id: 8765,
            temp_sensor_id: 8766
          }, 
          'text': '8765 - Ernest Solvaystraat 1/3 - 3010 Kessel-Lo'
        },
        {
          'value': {
            dust_sensor_id: 8769,
            temp_sensor_id: 8770
          }, 
          'text': '8769 - Tervuursevest - 3001 Heverlee'
        },
        {
          'value': {
            dust_sensor_id: 8773,
            temp_sensor_id: 8774
          }, 
          'text': '8773 - Alfred Delaunoislaan - 3001 Heverlee'
        }
        ]
      }
    },
    components: { 
      pm25component, 
      pm10component,
      CookieLaw
    },
    methods: {

      fetchData: function() {
        console.log('Setting the cookie');

        if (this.sensor_id !== null)
          {this.$cookies.set('sensor_id', this.sensor_id)};
        console.log('Fetching data...');
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.dust_sensor_id + '/')
        .then(response => {
          this.sensor_PM25 = Number(response.data[0].sensordatavalues.find(checkPM25).value)
          this.sensor_PM10 = Number(response.data[0].sensordatavalues.find(checkPM10).value)
          var utcDate = new Date(response.data[0].timestamp + 'Z')
          this.sensor_lufdaten_timestamp = utcDate.toLocaleString()
        })
        .catch((error) => {
          this.sensor_PM10 = NaN
          this.sensor_PM25 = NaN
          this.sensor_lufdaten_timestamp = null
        });
        axios
        .get('https://geo.irceline.be/sos/api/v1/timeseries/100014') //irceline pm25 sensor
        .then(response => {
          this.sensor_irceline_PM25 = Number(response.data.lastValue.value)
          this.sensor_irceline_timestamp = response.data.lastValue.timestamp
        });
        axios
        .get('https://geo.irceline.be/sos/api/v1/timeseries/6716') //irceline pm10 sensor
        .then(response => {
          this.sensor_irceline_PM10 = Number(response.data.lastValue.value)
        });
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.temp_sensor_id + '/')
        .then(response => {
          this.sensor_humidity = response.data[0].sensordatavalues.find(checkHumidity).value
        })
        .catch((error) => {
          this.sensor_humidity = "..."
        });
        axios
        .get('https://api.luftdaten.info/v1/sensor/' + this.sensor_id.temp_sensor_id + '/')
        .then(response => {
          this.sensor_temp_full = response.data[0].sensordatavalues.find(checkTemperature).value
        })
        .catch((error) => {
          this.sensor_temp_full = "..."
        })
      }
    },
    updated () {
      this.fetchData()
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
