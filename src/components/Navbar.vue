<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <!-- <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button> -->
    
    <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <div class="navbar-brand h1 m-2 mr-auto text-dark">Report Builder</div>
        <div class="m-2">
            <button @click="$emit('toggleSidebar')" class="p-1 btn btn-lg btn-link btn-dark-outline text-dark" data-toggle="tooltip" data-placement="bottom" title="Toggle Sidebar">
                <i :class="{'active' : showSideBar}" class="fa fa-table-columns"></i>
            </button>
            <button @click="$emit('toggleOptionsPane')" class=" p-1 btn btn-lg btn-link btn-dark-outline text-dark" data-toggle="tooltip" data-placement="bottom" title="Toggle Options Pane">
                <i :class="{'active' : showOptionsPane}" class="fa fa-table-cells-large"></i>
            </button>
        </div>
        
    </div>
  </nav>
</template>
<script>
export default {
    props: [
        'showSideBar',
        'showOptionsPane'
    ],
    data() {
        return {
            
        }
    },
    methods: {
    },
};
</script>
<style scoped>
    .active{
        color: #063EC4
    }
</style>
