<template>
  <div id="body">
    <router-view></router-view>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      found: false,
      agreement_id: null,
      primary_property_id: null,
      formLoader: false
    }
  },
  setup(){

  },
  components:{
  },
  methods:{

  }
}
</script>

<style>
</style>
