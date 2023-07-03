import axios from "axios";
// Sales report state
export default {
  methods:{
    async getSalesPropertyList() {
      this.loaderOperate(true);
      this.premiumProps = null;

      const {
        data: { data },
      } = await axios.post("/get-sales-property-list", {company_id: this.company_id});

      this.premiumPropsData = data;

      if (data.length === 1) {
        this.premiumProps = data[0].id
      } else if (data.length > 1) {
        data.find(el => (parseInt(el.id) === this.primary_property_id)) !== undefined ? this.premiumProps = this.primary_property_id : this.premiumProps = null
      } else {
        this.premiumProps = null
      }
      
      this.premiumFlag++;
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.premiumPropsList = this.filteredData(list);
    },
    async getPropertyStaffList() {
      if (this.premiumProps !== null && this.premiumProps !== undefined) {
        this.filterThreeDataKey = [];

        let info = {
          prop_id: this.premiumProps,
          company_id: this.company_id
        };

        const {
          data: { data },
        } = await axios.post("/get-sales-property-staff-list", info);

        if (data.length > 1) {
          this.filterThreeDataKey = ['all']
          this.filterThreeDataValue = 'all'
        } else if (data.length === 1) {
          this.filterThreeDataKey[0] = data[0].id
          this.filterThreeDataValue = data[0].id
        } else {
          this.filterThreeDataKey = ['']
          this.filterThreeDataValue = null
        }

        this.filterThreeDataList = data.map(e=>{
          return{
            label:e.name,
            id: e.id
          }
        });
        this.statusKey++;
      } else {
        this.filterThreeDataKey = [''];
        this.filterThreeDataValue = null
        this.filterThreeDataList = [];
      }
      this.loaderOperate();
    },
  },
}