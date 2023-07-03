import axios from "axios";
import moment from "moment";
// Cleanings Plus report state
export default {
  methods:{
    async getCleaningsPlusAttendantList() {
      this.filterThreeDataKey = [];
      this.filterThreeDataValue = null;

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-cleanings-plus-attendant-list", info);

      if (data.length > 1) {
        this.filterThreeDataKey = ['all']
        this.filterThreeDataValue = 'all'
      } else if (data.length === 1) {
        this.filterThreeDataValue = data[0].id
      } else {
        this.filterThreeDataValue = null
      }
      this.statusKey++;
      this.filterThreeDataList = data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
    },
    async getCleaningsPlusRoomTypeList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-cleanings-plus-room-type-list", info);

      this.statusKey++

      if (data.length > 1) {
        this.filterTwoDataKey = ['all']
      } else if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].room_type
      } else {
        this.filterTwoDataKey = [null]
      }

      const list = data.map(el=>{
        return {id: el.room_type, label: el.room_type}
      });

      this.filterTwoDataList = list;
    },
    async getCleaningsPlusRoomList() {
      this.filterOneDataKey = [];

      const info = {
        prop_id: this.props.toString(),
      };

      const {
        data: { data },
      } = await axios.post("/get-area-list", info);     
      
      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id
      } else {
        this.filterOneDataKey = [null]
      }
      this.statusKey++;
      const list = data.map(el=>{
        return {id: el.id, label: el.area_name}
      });

      this.filterOneDataList =  list;
    },
    async getInspectorListByProperty() {
      this.filterOneDataKey = [];

      const info = {
        prop_id: this.props.toString(),
      };

      const {
        data: { data },
      } = await axios.post("/get-inspectors-by-property", info);     
      
      this.statusKey++

      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id
      } else {
        this.filterOneDataKey = [null]
      }

      this.filterOneDataList =  data.map(e=>{
        return {
          label:e.name,
          id: e.id
        }
      });
    },
    async getCleaningsPlusBreakoutList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-cleanings-plus-breakout-list", info);
      
      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id
      } else {
        this.filterOneDataKey = [null]
      }
      this.statusKey++
      const list = data.map(el=>{
        return {id: el.id, label: moment.utc(el.name).format("YYYY-M-D | h:mm:ss")}
      });

      this.filterOneDataList = list;
    },
  },
}