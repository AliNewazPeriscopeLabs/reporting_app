import axios from "axios";
// total failed items report state
export default {
  methods:{
    async getAttendantList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-attendant-list-data", info);

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
    async getSupervisorList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-supervisor-list-data", info);

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
    },
    async getCleaningTypesList() {
      this.filterTwoDataKey = [null];
      const {
        data: { data },
      } = await axios.get("/get-cleaning-types-data");

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].id;
      }

      if (data.length > 1) {
        if (this.filters.find(el=> el.rp_name === "in_cleaning_type")?.rp_allowmultipleselect === 1) {
          this.filterTwoDataKey=['all'];
        } else {
          this.filterTwoDataKey=[null];
        }
      }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
  }
}