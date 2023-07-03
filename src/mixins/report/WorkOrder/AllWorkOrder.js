import axios from "axios";
// work order report state
export default {
    data(){
        return{
          itemTypeList: [],
          itemType: []
        }
    },
    methods:{
      async getItemTypeList() {
        this.itemTypeList = [];
        const { data: { data }} = await axios.post("/get-item-type-list-by-property",{
          prop_id: this.props.toString()
        });
        if (data.length>1) {
          this.itemTypeList = [{
            id:'all',
            label:'All',
            children:[
              ...data
            ]
          }];
        } 
        if (data.length===1) {
          this.itemTypeList = [...data];
          this.itemType[0] = data[0].id
        }
        if(this.itemTypeList[0].children.length>1){
          this.itemType[0] = 'all'
        }
      }
    }
}