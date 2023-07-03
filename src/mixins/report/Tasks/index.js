import axios from "axios";
// tasks reports state
export default {
  data () {
    return {
      taskOriginKey: [],
      taskOriginList: []
    }
  },
  methods:{
    // All Tasks report task origin filter
    async getTaskOriginList() {
      this.taskOriginKey = [];

      const { data: { data } } = await axios.get('/get-task-origin-list-data'); 
      
      if (data.length > 1) {
        this.taskOriginKey = ['all']
      }

      this.taskOriginList =  data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
    }
  }
}