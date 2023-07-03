import axios from "axios";
// work order report state
export default {
    data(){
        return{
            staffList: [],
            occupiedByList: [],
            completedBy: [],
            inOccupied: "all",
        }
    },
    computed: {
      completedByList(){
        if (this.staffList.length>0) {
          const list = this.staffList.map(el=>{
            return {id: el.value, label: el.name}
          });
          return [
            {
              id: 'all',
              label: 'All',
              children: [...list]
            }
          ];
        }
        return [];
      }
    },
    methods:{
      async getOccupiedByList() {
        const { data: { data }} = await axios.get("/get-occupied-by");
        this.occupiedByList = data;
      }
    }
}