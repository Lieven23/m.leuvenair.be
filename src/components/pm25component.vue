
<template>
  
  <div v-bind:class="sensor_color_text">
    <div class="value">
      {{ pm25_string }}
    </div>
    <div class="label">
      PM2.5 <br>
      {{ sensor_text }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'pm25component',
  props: {
    pm25: {
      type: Number,
      required: true
    }
  },
  computed: {
    pm25_string: function() {
      if (isNaN(this.pm25)){
        return '...'
      }
      return this.pm25
    },
    sensor_color_text: function() {
      if (this.pm25 >= 60) {
        return 'red statistic'
      } 
      else if (this.pm25 >= 35) {
        return 'orange statistic'
      }
      else if (this.pm25 >= 10) {
        return 'green statistic'
      }
      else if (this.pm25 >= 5) {
        return 'teal statistic'
      }
      else {
        return 'blue statistic'
      }
    },
    sensor_text: function() {
      if (this.pm25 >= 60) {
        return 'Very bad'
      } 
      else if (this.pm25 >= 35) {
        return 'Bad'
      }
      else if (this.pm25 >= 10) {
        return 'Moderate'
      }
      else if (this.pm25 >= 5) {
        return 'Good'
      }
      else {
        return 'Excellent'
      }
    }
  }
}

</script>