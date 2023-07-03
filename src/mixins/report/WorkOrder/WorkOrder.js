import axios from "axios";
// work order report state
export default {
    data(){
        return{
            areaTypeList: [],
            areaCategory: ['all']
        }
    },
    methods:{
        async getAreaTypeList() {
          const { data: { data }} = await axios.get("/get-area-type-list");
          this.areaTypeList = [{
            id: 'all',
            label: 'All',
            children:[
                ...data
            ]
          }];
        }
    }
}