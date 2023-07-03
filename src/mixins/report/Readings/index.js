import axios from "axios";
import moment from "moment";
import  toaster from '@/utils/toaster';
const { toastr } = toaster
// readings report state
export default {
  methods:{
    tempLabel(props = []) {
      if (props.toString() === 'all' || props.length > 1) {
        return '°C'
      } else {
        return '°F'
      }
    },
    getReadingsReportColumn(data) {
      let datalist = [];
      if (data.length > 0) {
        for (const el of data) {
          if (el.rcol_spcolname === "domestic") {
            el.rcol_display = `${el.rcol_display} (${this.tempLabel(this.props)})`
          } else if (el.rcol_spcolname === "feed") {
            el.rcol_display = `${el.rcol_display} (${this.tempLabel(this.props)})`
          } else if (el.rcol_spcolname === "return") {
            el.rcol_display = `${el.rcol_display} (${this.tempLabel(this.props)})`
          } else if (el.rcol_spcolname === "storage") {
            el.rcol_display = `${el.rcol_display} (${this.tempLabel(this.props)})`
          } else if (el.rcol_spcolname === "col12") {
            el.rcol_display = `${el.rcol_display} (${this.tempLabel(this.props)})`
          }
          datalist.push(el);
        }
        return datalist;
      }
    },
    async getReadingsUserPostedByList() {
      this.filterOneDataKey = [];

      if (typeof this.from_date.getMonth === 'function' && typeof this.to_date.getMonth === 'function') {
        this.from_date.setHours(0,0,0,0);
        this.to_date.setHours(0,0,0,0);
        if (this.from_date.getTime()> this.to_date.getTime()) {
            toastr.error(this.words['starting_date_warning']);
            return;
        }
      }

      let info = {
        re_id: this.r_id,
        prop_id: this.props.toString(),
        from_date: moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss"),
        to_date: moment(this.to_date).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss"),
        company_id: this.company_id,
        agreement: this.agreement_id
      };
      
      const {
        data: { data },
      } = await axios.post("/get-userpostby-list-readings", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].user_id;
      }
      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    }
  }
}