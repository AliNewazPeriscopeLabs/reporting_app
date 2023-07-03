<template>
  <div class="container my-5">
  <div class="row justify-content-center">
    <div class="col-lg-9">
      <h1 class="mb-3">Db Configuration</h1>
      <form>
        <div class="row g-3">
          <div class="col-12">
            <label for="db-type" class="form-label">Database Type</label>
            <select  class="form-control form-select" name="db-type" id="db-type" required>
              <option selected >Select Db type</option>
              <option value="sql">MySQL</option>
              <option value="postgres">PostGRES</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="host-name" class="form-label">Host</label>
            <input type="text" class="form-control" id="host-name" name="host-name" required>
          </div>
          <div class="col-md-6">
            <label for="port-no" class="form-label">Port No:</label>
            <input type="text" class="form-control" id="port-no" name="port-no" required>
          </div>
          <div class="col-md-6">
            <label for="user-name" class="form-label">User name:</label>
            <input type="text" class="form-control" id="user-name" name="user-name" required>
          </div>
          <div class="col-md-6">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password" required>
          </div>
          <div class="col-12">
            <div class="row">
              <div class="col-md-6">
                <button type="submit" class="btn btn-dark w-100 fw-bold" >Connect</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</template>
  
<script>
// import axios from 'axios'
export default {
  components:{
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>


</style>