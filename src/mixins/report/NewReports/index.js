import axios from "axios";
// new reports state
export default {
  data () {
    return {
      typeDataKey: ['all'],
      typeDataList: []
    }
  },
  methods:{
    // User Activity Report user filter
    async getUserActivityUserList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-users-by-property-list", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    // Area History Report area filter
    async getAreaHistoryAreaList() {
      this.filterOneDataValue = null;

      const info = {
        prop_id: this.props.toString(),
      };

      const {
        data: { data },
      } = await axios.post("/get-area-list", info);     
      
      if (data.length === 1) {
        this.filterOneDataValue = data[0].area_name
      } else {
        this.filterOneDataValue = null
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.area_name}
      });
      this.statusKey++;
      this.filterOneDataList =  list;
    },
    // inspection item by cleanings filter
    async getInspectionItemByCleaningList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString()
      };

      const {
        data: { data },
      } = await axios.post("/get-inspection-item-by-cleaning-type", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    // inspection item by cleanings plus filter
    async getInspectionItemByCleaningPlusList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString()
      };

      const {
        data: { data },
      } = await axios.post("/get-inspection-item-by-cleaning-plus-type", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    // All To Do Items report type filter
    async getAllToDoTypeList() {
      this.typeDataKey = [];

      const { data: { data } } = await axios.get('/get-type-list'); 
      
      if (data.length > 1) {
        this.typeDataKey = ['all']
      }

      this.statusKey++

      this.typeDataList =  data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
    },
    // get inspection results list
    async getInspectResultList() {
      this.typeDataKey = [];

      const { data: { data } } = await axios.get('/get-inspection-result-set'); 
      
      if (data.length > 1) {
        this.typeDataKey = ['all']
      }

      this.statusKey++

      this.typeDataList =  data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
    },
    // Lost And Found Items report type filter
    async getLostAndFoundTypeList() {
      this.typeDataKey = [];

      const { data: { data } } = await axios.get('/get-type-list-data'); 
      
      if (data.length > 1) {
        this.typeDataKey = ['all']
      }

      this.statusKey++

      this.typeDataList =  data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
    }
  }
}