import axios from "axios";
// Connect report state
export default {
  methods:{
    async getConnectPropertyList() {
      this.loaderOperate(true);
      this.premiumProps = null;

      const {
        data: { data },
      } = await axios.get("/get-connect-property-list");

      this.premiumPropsData = data;

      if (data.length === 1) {
        this.premiumProps = data[0].id
      } else if (data.length > 1) {
        data.find(el => (parseInt(el.id) === this.primary_property_id)) !== undefined ? this.premiumProps = this.primary_property_id : this.premiumProps = 'all'
      } else {
        this.premiumProps = null
      }
      
      this.premiumFlag++;
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.premiumPropsList = this.filteredData(list);
      this.loaderOperate();
    },
  },
}