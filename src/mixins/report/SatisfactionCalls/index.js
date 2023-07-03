import axios from "axios";
// satisfaction calls report state
export default {
  methods: {
    async staffMemberListForSatCalls() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-staff-member-list-by-property", info);

      this.flagOne++;

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
    }
  }
}