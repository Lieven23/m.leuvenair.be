<template>
  <div v-bind:class="sensor_color_text">
    <div class="value">
      {{ pm10_string }}
    </div>
    <div class="label">
      PM10 <br>
      {{ sensor_text }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'pm10component',
  props: {
    pm10: {
      type: Number,
      required: true
    }
  },
  computed: {
    pm10_string: function() {
      if (isNaN(this.pm10)){
        return '...'
      }
      return this.pm10
    },
    sensor_color_text: function() {
      if (this.pm10 >= 70) {
        return 'red statistic'
      } 
      else if (this.pm10 >= 40) {
        return 'orange statistic'
      }
      else if (this.pm10 >= 20) {
        return 'green statistic'
      }
      else if (this.pm10 >= 10) {
        return 'teal statistic'
      }
      else {
        return 'blue statistic'
      }
    },
    sensor_text: function() {
      if (this.pm10 >= 70) {
        return 'Very bad'
      } 
      else if (this.pm10 >= 40) {
        return 'Bad'
      }
      else if (this.pm10 >= 20) {
        return 'Moderate'
      }
      else if (this.pm10 >= 10) {
        return 'Good'
      }
      else {
        return 'Excellent'
      }
    }
  }
}

</script>
