<template>
  <div class="container my-5">
    <div class="row">
      <span @click="createCon = true" class="add"> +  Add </span>
    </div>
    <div class="row">
      <div class="col-md-4  p-0">
        <div class="card mt-5 shadow" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Connection Name</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">User name</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">Host:port</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/table-map" class="btn btn-primary w-100">Connect</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4  p-0">
        <div class="card mt-5 shadow" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Connection Name</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">User name</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">Host:port</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/" class="btn btn-primary w-100">Connect</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4  p-0">
        <div class="card mt-5 shadow" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Connection Name</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">User name</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">Host:port</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/" class="btn btn-primary w-100">Connect</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4  p-0">
        <div class="card mt-5 shadow" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Connection Name</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">User name</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">Host:port</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/" class="btn btn-primary w-100">Connect</router-link>
            </div>
          </div>
        </div>
      </div>
     
      <!-- <div class="col-md-3 mt-3 p-2">
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Connection Name</h5>
            <div class="d-flex">
              <i class="fa-solid fa-user  p-05 fs-12"></i> <p class="card-text">User name</p>
            </div>
            <div class="d-flex">
              <i class="fas fa-wave-square p-05 fs-12"></i><p class="card-text">Host:port</p>
            </div>
            <router-link to="/" class="btn btn-primary">Connect</router-link>
          </div>
        </div>
      </div> -->
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
export default {
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

// span{
// }

.add{
  display: inline-block;
  width: 50px;
  height: 30px;
  font-size: 40px;
  font-family: "Roboto";
  border-radius: 50%;
  background: #FFF;
  border-radius: 60px;
  width: 78px;
  box-shadow: 0 0 5px 0 #A0D468;
  font-size: 20px;
  cursor: pointer;
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


</style>