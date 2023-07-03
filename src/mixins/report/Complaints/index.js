import axios from "axios";
// complaints by creation date report state
export default {
  data(){
    return {
      in_area: ["all"],
      in_resolution: ["all"],
      in_issue: ["all"],
      resolutionList: [],
      issueList: [],
      issueClosedBy: null,
      issueClosedByList: [],
      areaList: []
    }
  },
  methods:{
    async getStaffMemberByPropertyList() {
      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-staff-member-list-by-property", info);
      this.flagThree++
      this.statusKey++
      if (data.length > 1) {
        this.staffMember=['all']
        this.issueClosedBy = 'all'
      } else if (data.length === 1) {
        this.staffMember = data[0].id
        this.issueClosedBy = data[0].id
      }
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });
      this.issueClosedByList = list;
      this.staffMemberList = this.filteredData(list);
      
      
    },
    async getResolutionList() {
      const info = {
        prop_id: this.props.toString(),
      };
      const {
        data: { data }
      } = await axios.post("/get-resolution-list", info);
      this.flagTwo++;
      if (data.length > 1) {
        this.in_resolution=['all']
      } else {
        this.in_resolution = data[0].id
      }
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });
      this.resolutionList =  this.filteredData(list);
      
    },
    async getIssueList() {
      const info = {
        prop_id: this.props.toString(),
      };
      const {
        data: { data },
      } = await axios.post("/get-issue-list", info);
      this.flagOne++;
      if (data.length > 1) {
        this.in_issue=['all']
      } else {
        this.in_issue = data[0].id
      }
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });
      this.issueList =  this.filteredData(list);
    },
    async getAreaList() {
      const info = {
        prop_id: this.props.toString(),
      };
      const {
        data: { data },
      } = await axios.post("/get-area-list", info);     
      this.flag++;
      if (data.length > 1) {
        this.in_area=['all']
      } else {
        this.in_area = data[0].area_name
      }
      const list = data.map(el=>{
        return {id: el.id, label: el.area_name}
      });
      this.areaList =  this.filteredData(list);
    },
    // Avg. Time to Res. By Staff Member report
    async getResolvedUserList() {
      const info = {
        prop_id: this.props.toString(),
        company_id: this.company_id,
        agreement: this.agreement_id
      };

      const {
        data: { data },
      } = await axios.post("/get-resolved-user-list", info);
      
      this.flag++;
      
      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].user_id
      } else {
        this.filterOneDataKey = []
      }

      const list = data.map(el => {
        return {id: el.user_id, label: el.name}
      })
      
      this.filterOneDataList =  this.filteredData(list);
    }
  }
}