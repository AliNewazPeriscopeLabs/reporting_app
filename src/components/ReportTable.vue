<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mt-2">
      <router-link :to="{ name: 'table-map', query:{ id: id } }" class="text-decoration-none">
        <i class="fa-solid fa-arrow-left me-2"></i>Table Map
      </router-link>
      <div class="d-flex justify-content-center align-items-center">
        <button type="button" class="btn btn-outline-primary btn-sm shadow-none me-2">
          <i class="fa-solid fa-floppy-disk me-2"></i>Save
        </button>
        <div class="dropdown">
          <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa-solid fa-download me-2"></i>Export
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-pdf me-2"></i>PDF
            </button>
            <button class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-excel me-2"></i>EXCEL
            </button>
            <button class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-csv me-2"></i>CSV
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-0">
      <div v-if="report_has_info" class="mt-3">
        <h5 class="fw-normal mb-3">
          <i class="fa-solid fa-file-invoice me-2"></i>Sales Report
        </h5>
        <p class=" fw-normal text-muted">
          <i class="fa-solid fa-clipboard me-2"></i>This report describe about monthly sales report.
        </p>
      </div>
      <div v-else>
        <div class="form-floating mb-0 w-50">
          <input type="text" class="form-control" id="floating1" placeholder="Enter Your Report Name">
          <label for="floating1">
            <i class="fa-solid fa-file-invoice me-2"></i>Enter Your Report Name
          </label>
        </div>
        <div class="form-floating w-50">
          <input type="text" class="form-control" id="floating2" placeholder="Enter Your Report Description">
          <label for="floating2">
            <i class="fa-solid fa-clipboard me-2"></i>Enter Your Report Description
          </label>
        </div>
      </div>
    </div>
    <hr :class="[report_has_info ? 'mt-4' : '']">
    <div>
      <div class="card mt-5 py-2">
        <pre class="pre-scrollable border-start border-primary border-5 rounded" data-spy="scroll" style="font-size: 0.85rem; height: 200px; margin-bottom: 0px;">
          {{ query }}
        </pre>
      </div>
    </div>
    <div class="table-responsive mt-5" style="height: 80vh;">
      <table class="table table-striped border border-1">
        <thead>
          <tr>
            <th v-for="(item, i) in columns" :key="i"  scope="col">{{item}}</th>
            <!-- <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, i) in data_list" :key="i">
            <td v-for="(col, j) in columns" :key="j" scope="row">{{ data[col] }}</td>
            <!-- <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
export default {
  props:[
    'columns',
    'query',
    'data_list'
  ],
  computed: {
    id(){
      if (this.$route && this.$route.query) {
        return this.$route.query.id
      } 
      return null;
    }
  },
  data() {
    return {
      report_has_info: false
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
/* .form-floating > .form-control, .form-floating > .form-select {
    height: calc(3rem + 2px) !important;
} */
</style>