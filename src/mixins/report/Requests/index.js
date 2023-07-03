import axios from "axios";
import moment from "moment";
import  toaster from '@/utils/toaster';
const { toastr } = toaster
// all room notices report state
export default {
  data(){
    return {
        hkItemList: [],
        hkItem: [],
        reqByMl: ['all'],
    }
  },
  methods:{
    async getRequestedByTypesListMl() {
        const { data: { data }} = await axios.get("/get-requested-by-types");
        const list = data;
        this.requestedByList =  this.filteredData(list);
    },
    async gethkItemList() {
      this.hkItem=[]
      const info = {
          prop_id: this.props.toString(),
      };
      const {
          data: { data }
      } = await axios.post("/get-hk-items-list", info);
      this.flag++;
      if (data.length > 1) {
          this.hkItem=['all']
      } 
      if(data.length === 1) {
          this.hkItem[0] = data[0].value
      }
      const list = data.map(el=>{
          return {id: el.value, label: el.name}
      });
      this.hkItemList =  this.filteredData(list);
    },
    async getReqCompletedByList() {
      this.completedBy=[]
      if (typeof this.from_date.getMonth === 'function' && typeof this.to_date.getMonth === 'function') {
        this.from_date.setHours(0,0,0,0);
        this.to_date.setHours(0,0,0,0);
        if (this.from_date.getTime()> this.to_date.getTime()) {
            toastr.error(this.words['starting_date_warning']);
            return;
        }
      }
      let info = {
        prop_id: this.props.toString(),
        from_date: moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss"),
        to_date: moment(this.to_date).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss"),
        company_id: this.company_id,
        agreement: this.agreement_id
      };
      const {
          data: { data }
      } = await axios.post("/get-requests-completed-by-data", info);
      this.flagThree++;
      if (data.length >= 1) {
        this.completedBy=['all']
      } 
      if(data.length === 1) {
        this.completedBy[0] = data[0].value
      }
      const list = data.map(el=>{
        return {id: el.value, label: el.name}
      });
      this.completedByList = this.filteredData(list);

    },
    async reqItemTypeList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        from_date: null,
        to_date: null,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-req-item-type-data", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].value;
      }
      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.value, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    }
  }
}