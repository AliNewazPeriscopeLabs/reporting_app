import axios from "axios";
// inspection item details report state
export default {
  methods:{
    async getTemplates(prop = "", temp_status = "") {
      this.items = [];
      let info = {};

      info = {
        prop_id: prop === "" ? this.props.toString() : prop,
        company_id: this.company_id,
        temp_status: this.r_id === '67B3cKm8e7' ? 'all' : temp_status==="" ? this.tempStatus : temp_status,
      };

      const {
        data: { data },
      } = await axios.post("/get-templates-list", info);

      if (this.r_id === '67B3cKm8e7') {
        this.filterOneDataKey = []
        this.flag++;
        if (data.length === 1) {
          this.filterOneDataKey[0] = data[0].id;
        } else if (data.length > 1) {
          this.filterOneDataKey = ['all']
        } else {
          this.filterOneDataKey = ['']
        }
        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });
        this.filterOneDataList = this.filteredData(list);
      }

      this.templates = data.map(el=>{
        return {id: el.id, label: el.name}
      });
      this.template_id = null;
      this.statusKey++;

    },
    async getInspectionItems(temp_id = "",sche="") {
      const info = {
        temp_id: temp_id === "" ? this.template_id : temp_id,
        company_id: this.company_id,
      };
      this.item_id = [];
      if (this.template_id !== null && this.template_id !== '') {
        const {
          data: { data },
        } = await axios.post("/get-items-list", info);

        if (data.length === 1) {
          this.item_id[0] = data[0].id;
        } else if (data.length > 1) {
          this.item_id = ['all']
        } else {
          this.item_id = []
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });
        this.items = this.filteredData(list);
      }
      this.flagOne++;
      
      if (sche === "temp_up") {
        this.scheduleFilter.item_id = "";
      }
      this.itemDrop = true;
    },
  }
}