import axios from "axios";
// All Logs report filters state
export default {
  data(){
    return{
      submittedBy: 1,
      printAllCurrent: false,
      disableOthers: false,
      GPPSubmittedByList: [],
      GPPSubmittedBy: [],
      adaComSubmittedByData:[],
      adaComSubmittedBy: ['all'],
      reserveFromDate: this.from_date,
      reserveToDate: this.to_date,
      keySign: true
    }
  },
  watch: {
    'printAllCurrent': function(x){
      if (x) {
        this.reserveFromDate = this.from_date
        this.from_date = 'dummy';
        this.to_date = 'dummy';
        this.status = 16;
        if (this.GPPSubmittedByList.length && this.GPPSubmittedByList[0].children) {
          this.GPPSubmittedBy = ['all'];
        } else if(this.GPPSubmittedBy[0]) {
          this.GPPSubmittedBy[0] = this.GPPSubmittedByList[0]?.id ? this.GPPSubmittedByList[0]?.id : null;
        }
        this.flagOne++;
      } else {
        this.status = 'all';
        this.from_date= this.reserveFromDate;
        this.to_date = new Date();
      }
    },
    'status' : function(x){
      if (this.$route.query.re === 'Hf7KV5zbzp' && x === 0) {
        this.reserveFromDate = this.from_date;
        this.reserveToDate = this.to_date;
        this.from_date = "";
        this.to_date = "";
        this.filterOneDataKey = ['all']
        this.keySign = false;
        this.statusKey++;
      } else if (this.$route.query.re === 'Hf7KV5zbzp' && x !== 0 && !this.keySign) {
        this.from_date = this.reserveFromDate;
        this.to_date = this.reserveToDate;
        this.keySign = true;
      }
    }
  },
  methods:{
    async getAdaComSubmittedByList() {
      this.adaComSubmittedBy = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: this.r_id === 'WbxRg96b3b' ? 1 : this.r_id === '9r5AWeMYVJ' ? 8: this.r_id ===  'jvfuxZ2gLR'? 14 : 5,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-by-property-for-log", info);
      this.flagOne++;
      this.adaComSubmittedBy = [];
      if (data.length===1) {
        this.adaComSubmittedBy[0] = data[0].user_id;
      }
      if (data.length>1) {
        this.adaComSubmittedBy = ['all'];
      }
      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });
      this.adaComSubmittedByData = this.filteredData(list);
    },
    async getSubmittedByListGuestPackage() {
      this.GPPSubmittedBy=[];
      const info = {
        ag_id: this.agreement_id,
        prop_id: this.props.toString(),
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-guest-package", info);
      
      this.flagOne++;

      if (data.length === 1) {
        this.GPPSubmittedBy[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.GPPSubmittedBy=['all']
      }
      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.GPPSubmittedByList = this.filteredData(list);
    },
    async getCashDisEmployeeList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id,
        agreement: this.agreement_id
      }

      const {
        data: { data },
      } = await axios.post("/get-employee-list-by-property-cash-dis", info);
      
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
    },
    async getKeySignKeyItemsList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id,
        agreement: this.agreement_id
      }

      const {
        data: { data },
      } = await axios.post("/get-key-items-list-by-property-key-sign", info);

      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].key_id
      } else {
        this.filterOneDataKey = [null]
      }
      
      this.filterOneDataList = data.map(el => {
        return {id: el.key_id, label: el.name}
      });
      this.statusKey++;

    },
    async getMailCheckSubmittedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 2,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-by-property-for-log", info);

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
    },
    async getKeyAuditProcessedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: this.r_id === 'jvfuxZ2gLR' ? 14 : 13,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-processed-by-list-by-property-logs", info);

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
    },
    async getKeyAuditSubmittedByList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 13,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-by-property-logs", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getPreDepAuditProcessedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 15,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-processed-by-list-by-property-logs", info);

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
    },
    async getPreDepAuditSubmittedByList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 15,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-by-property-logs", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getPreDepProcessedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        company_id: this.company_id,
        agreement: this.agreement_id
      };

      const {
        data: { data },
      } = await axios.post("/get-processed-by-list-pre-dep-data", info);

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
    },
    async getDDRShiftList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 3,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-shift-list-ddr-data", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].key_id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.key_id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    async getDDRCashierList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 3,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-cashier-list-ddr-data", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getWUCLoggedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 9,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-logged-by-list-by-property-wake-up", info);

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
    },
    async getRoomStSubmittedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 18,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-submitted-by-list-by-property-logs", info);

      this.statusKey++;

      if (data.length > 1) {
        this.filterOneDataKey = ['all']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].user_id
      } else {
        this.filterOneDataKey = [null]
      }
      
      this.filterOneDataList = data.map(el => {
        return {id: el.user_id, label: el.name}
      });
    },
    async getVRRecordedByList() {
      this.filterOneDataKey = [];
      this.filterOneDataList=[];
      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: this.r_id === '27Kax3Pj8L' ? 22 : 23,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-recorded-by-list-by-property-ven-reg", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      } 
      if (data.length>0) {
        const list = data.map(el=>{
          return {id: el.user_id, label: el.name}
        });
        this.filterOneDataList = this.filteredData(list);
      }
    },
    async getRLManagerList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 11,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-manager-list-rebate-log", info);

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
    },
    async getRLGsmList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 11,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-gsm-list-rebate-log", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getATHAreaList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 21,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-area-list-area-tem-humidity", info);

      this.flag++;

      if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].key_id;
      }

      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.key_id, label: el.name}
      });

      this.filterOneDataList = this.filteredData(list);
    },
    async getATHLoggedByList() {
      this.filterTwoDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 21,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-logged-by-list-area-tem-humidity", info);

      this.flagOne++;

      if (data.length === 1) {
        this.filterTwoDataKey[0] = data[0].user_id;
      }

      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.user_id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getSRRPreparedByList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        logsheet_id: 10,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-prepared-by-list-by-property-safe-removal", info);

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
    },
    async getLogAuthorList() {
      this.filterOneDataKey = [];

      let info = {
        prop_id: this.props.toString(),
        agreement: this.agreement_id,
        company_id: this.company_id
      };

      const {
        data: { data },
      } = await axios.post("/get-author-list-log-book", info);

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
    },
  }
}