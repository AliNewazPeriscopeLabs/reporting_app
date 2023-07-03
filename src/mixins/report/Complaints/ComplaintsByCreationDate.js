import axios from "axios";
// complaints by creation date report state
export default {
  data(){
    return {
      resolutionList: [],
      in_resolution: "all",
      issueList: [],
      in_issue: "all",
      areaList: [],
      in_area: "all"
    }
  },
  methods:{
    async getResolutionList(prop = "") {
      const info = {
        prop_id: prop === "" ? this.prop : prop,
      };
      if (prop!=="all" && prop!=="") {
        const {
          data: { data }
        } = await axios.post("/get-resolution-list", info);
        this.resolutionList = data;
      } else {
        this.resolutionList = [];
      }
    },
    async getIssueList(prop = "") {
      const info = {
        prop_id: prop === "" ? this.prop : prop
      };
      if (prop!=="all" && prop!=="") {
        const {
          data: { data },
        } = await axios.post("/get-issue-list", info);
        this.issueList = data;
      } else {
        this.issueList = [];
      }
    },
    async getAreaList(prop = "") {
      const info = {
        prop_id: prop === "" ? this.prop : prop,
      };
      if (prop!=="all" && prop!=="") {
        const {
          data: { data },
        } = await axios.post("/get-area-list", info);
        this.areaList = data;
      } else{
        this.areaList = [];
      }
    }
  }
}