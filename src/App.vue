<template>
  <div id="body">
    <router-view
      :getConnectionList="getConnectionList"
      :connections="connections"
      :setConnectionList="setConnectionList"
      :columns="columns"
      :data_list="data_list"
      :setData="setData"
      :query_error="query_error"
      :query="query"
    ></router-view>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios';

export default {
  setup(){
    let connections = ref([]);
    onMounted( ()=>{
      getConnectionList()
    })
    async function getConnectionList(){
      const { data:{ data } } = await axios.get('/get-connection-list');
      connections.value = data;
    }
    return{
      connections,
      getConnectionList
    }
  },
  name: 'App',
  data() {
    return {
      found: false,
      agreement_id: null,
      primary_property_id: null,
      formLoader: false,
      columns: [],
      data_list: [],
      query_error: '',
      query:''
    }
  },
  methods:{
    setData({columns=[], data=[], query='', error_message=''} ){
      this.columns = [...columns]
      this.data_list = [...data]
      this.query = query
      this.query_error = error_message
    }
  }
}
</script>

<style>
</style>
