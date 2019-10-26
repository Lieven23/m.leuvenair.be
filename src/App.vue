<template>
  <div id="app">
    <head>
      <meta charset="utf-8"/>
      <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.11.8/semantic.min.js"></script>-->
      <link rel="shortcut icon" type="image/png" href="/assets/lvnr_ico.png"/>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.0/semantic.min.css">
    </head>
    <router-view/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <!-- <router-link to="/currentLocation">Location</router-link> | -->
      <router-link to="/about">About</router-link>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
