<template>
  <div class="container my-5">
    <div class="row text-center">
      <h2 class="data-title">Welcome to SQL Report Builder</h2>
      <span class="data-desc">
        SQL Report Builder is the graphical user interface (GUI) tool for Report Building. It lets you design your report SQL queries.
        Allows designing and executing SQL queries to work and save as Data Models.
        You can use the intuitive and user friendly Report Builder to create many types of Reports.
      </span>
      <!-- <span @click="createCon = true" class="add"> +  Add </span> -->
    </div>
    <div class="d-flex align-items-center ps-4 mt-5">
      <h4 class="me-3">SQL Connections</h4>
      <span @click="createCon = true" class="add" title="Create Connection">+</span>
    </div>
    <div class="row ps-5">
      <div v-for="(item , i) in connections" :key="i" class="col-md-4  p-0">
        <div class="card mt-3 shadow" :class="[item.connection_type === 'mysql' ? 'mysql-logo' : 'pg-logo']" style="width: 20rem;">
          <button class="btn btn-outline-danger rounded-pill d-flex justify-content-center align-items-center" style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px;" title="Remove Connection">
            <i class="fa-solid fa-xmark x-mark"></i>
          </button>
          <div class="card-body">
            <h5 class="card-title">{{item.connection_name}}</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">{{item.default_db}}</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">{{item.host_name}}:{{item.host_port}}</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/table-map" class="btn btn-primary w-100">Connect</router-link>
            </div>
          </div>
        </div>
      </div>
     
    </div>
    <ConnectionCreate 
      v-if="createCon"
      :close="close"
      :opLoader="opLoader"
    ></ConnectionCreate>
    <spinner v-if="loader"></spinner>
</div>
</template>
  
<script>
// import axios from 'axios'
import ConnectionCreate from './modal/ConnectionCreate.vue'
import spinner from './loader/spinner.vue';
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
      connections
    }
  },
  components:{
    ConnectionCreate,
    spinner
  },
  data() {
    return {
      createCon: false,
      loader: false
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    close(){
      this.createCon = false;
    },
    opLoader(flag = false){
      this.loader = flag;
    }
  }
}
</script>

<style lang="scss" scoped>

.p-05{
  padding: 0.5rem;
}
.card{
  padding: 1rem;
}

.mysql-logo {
  background-image: url(../../public/images/mysql.png);
  background-repeat: no-repeat;
  background-size: 7rem;
  background-position-x: right;
}

.pg-logo {
  background-image: url(../../public/images/pgsql.png);
  background-repeat: no-repeat;
  background-size: 7rem;
  background-position-x: right;
}

// span{
// }

.add{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  font-size: 40px;
  font-weight: 700;
  font-family: "Roboto";
  background: #FFF;
  border-radius: 50%;
  width: 30px;
  box-shadow: 0 0 5px 0 #A0D468;
  font-size: 20px;
  cursor: pointer;
}
.x-mark{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  font-size: 40px;
  font-weight: 700;
  border-radius: 50%;
  width: 30px;
  font-size: 20px;
}

// .add:after{
//   content: "Add";
//   font-size: 20px;
//   opacity: 1;
//   display: inline;
// }

.remove:after{
  content: "Remove";
  font-size: 20px;
  opacity: 1;
  display: inline;
}

.data-title{
  font-style: normal;
  font-weight: 700;
  font-size: 35.16px;
  line-height: 24px;
  color: #6f6b6b;
  margin-top: 24px;
  margin-bottom: 36px;
}
.data-desc{
  font-style: normal;
  font-weight: 400;
  font-size: 16.8px;
  line-height: 24px;
  color: #949494;
  margin-top: 6px;
  text-align: center;
}

</style>