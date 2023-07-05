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
    <div class="mt-3">
      <h5 class="fw-normal">
        <i class="fa-solid fa-file-invoice me-2"></i>Report Name
      </h5>
      <p class=" fw-normal">
        <i class="fa-solid fa-clipboard me-2"></i>Report Description
      </p>
    </div>
    <hr style="margin-top: 30px;">
    <div>
      <div class="card mt-5 py-2">
        <pre class="pre-scrollable border-start border-primary border-5 rounded" data-spy="scroll" style="height: 200px; margin-bottom: 0px;">
          SELECT 
            translation, 
            language_id, 
            name 
          FROM 
            vw_translate_all 
          where 
            language_id = 1 
            and type = 'label' 
          group by 
            translation
        </pre>
      </div>
    </div>
    <div class="table-responsive mt-5">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
export default {
  components:{
   
  },
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