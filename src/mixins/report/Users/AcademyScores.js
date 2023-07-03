import axios from "axios";
// academy scores and user activity report state
export default {
  methods:{
    async getUsersList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-users-by-property-list", info);

      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id
      } else {
        this.filterOneDataKey = ['']
      }

      this.filterOneDataList = data.map(e=>{
        return {
          label:e.name,
          ...e
        }
      });
    }
  }
}