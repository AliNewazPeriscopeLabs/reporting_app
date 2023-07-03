import axios from "axios";
// get region list by company id for thresholds report
export default {
  methods:{
    async getRegionList() {
      if (this.company_id==='all') {
        this.filterOneDataKey = null
        return;
      }
      const {
        data: { data }
      } = await axios.get(`/get-region-list?com_id=${this.company_id}`);

      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id;
      } else {
        this.filterOneDataKey = ['']
      }

      if (data.length > 0) {
        this.filterOneDataList = data
      }
    },
    async getAdminRegionList() {
      if (!this.filterOneDataValue || this.filterOneDataValue === "all") {
        this.filterTwoDataValue = null
        this.filterThreeDataValue = null
        this.filterTwoDataList = []
        this.filterThreeDataList = []
        return;
      }
      const {
        data: { data }
      } = await axios.get(`/get-region-list?com_id=${this.filterOneDataValue}`);

      if (data && data.length > 1) {
        this.filterTwoDataValue = 'all'
        this.filterThreeDataValue = 'all'
        this.filterThreeDataList = [{id:'all',label:this.words['all']}]
      } else if (data && data.length === 1) {
        this.filterTwoDataValue = data[0].id;
        await this.getPropertyByRegion();
      } else {
        this.filterTwoDataValue = null
        this.filterThreeDataKey = null
      }
      this.statusKey++;
      if (data && data.length > 0) {
        this.filterTwoDataList = data
      }
    }
  }
}