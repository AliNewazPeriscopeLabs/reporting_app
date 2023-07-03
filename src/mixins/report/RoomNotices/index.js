import axios from "axios";
// all room notices report state
export default {
  methods:{
    async roomNoticeTypeList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      }

      const {
        data: { data },
      } = await axios.post("/get-room-notice-type-list", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    }
  }
}