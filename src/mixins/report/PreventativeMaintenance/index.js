import axios from "axios";
// Preventative Maintenance report state
export default {
  data() {
    return {
      singleKey: null
    }
  },
  methods:{
    async pmTemplateListData(ml) {
      this.filterOneDataValue=null;
      this.singleKey=null;
      this.filterThreeDataList=[];
      let info = {
        prop_id: this.props.toString(),
        temp_table: 0,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-pm-template-list", info);

      this.flag++;
      this.statusKey++;
      if (!ml) {
        this.filterOneDataKey = [];
        this.filterOneDataValue = null;
      }
      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id;
        this.filterOneDataValue = data[0].id;
        await this.pmItemByTemplate()
      }
      if (data.length > 1 && ml) {
        this.filterOneDataKey=['all']
        this.filterOneDataValue='all'
      }
      
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    async pmTemplateListByTypeData() {
      this.filterOneDataKey = [];
      let info = {
        prop_id: this.props.toString(),
        type: this.filterTwoDataKey.toString() === '' ? 'all' : this.filterTwoDataKey.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-pm-by-property-and-type", info);

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
    async pmTypeList() {
      const {
        data: { data },
      } = await axios.get("/get-template-types");

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
    async pmResultList() {
      const {
        data: { data },
      } = await axios.get("/get-pm-result-types");

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
    async pmItemByTemplate() {
      this.singleKey = null
      const {
        data: { data },
      } = await axios.post("/get-pm-items-by-template",{
          prop_id: this.props.toString(),
          in_template_id: this.filterOneDataValue.toString(),
          company_id: this.company_id
      });

      this.statusKey++;
  
        if (data.length === 1) {
          this.singleKey = data[0].id;
        }
        if (data.length > 1) {
          this.singleKey=['all']
        }

      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });
  
      this.filterThreeDataList = list;
    }
  }
}