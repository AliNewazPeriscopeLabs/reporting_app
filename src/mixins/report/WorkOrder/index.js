import axios from "axios";
import moment from "moment";
// work order report state
export default {
    data(){
        return{
            areaTypeList: [],
            requestedByList: [],
            requestedBy: 'all',
            areaCategory: ['all'],
            staffList: [],
            occupiedByList: [],
            completedBy: [],
            completedByList: [],
            inOccupied: "all",
            reported_by: "all",
            staffMemberList: [],
            staffMember: ["all"],
            itemTypeList: [],
            reportedByList: [],
            itemType: []
        }
    },
    methods:{
        async getAreaTypeList() {
          const { data: { data }} = await axios.get("/get-area-type-list");
          this.flagOne++
          if (data.length > 1) {
            this.areaCategory=['all']
          } 
          if (data.length ===1) {
            this.areaCategory[0] = data[0].id
          }
          if (data.length > 0) {
            this.areaTypeList = this.filteredData(data);
          }
        },
        async getStaffList() {
          this.from_date.setHours(0,0,0,0)
          this.to_date.setHours(0,0,0,0)
          const { data: { data }} = await axios.post("/get-staff-list-by-property",{
            prop_id: this.props.toString(),
            from_date: this.from_date === "" ? "" : moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss"),
            to_date: this.to_date === "" ? 
            moment(new Date()).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss") : 
            moment(this.to_date).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss"),
            reported_by: this.inOccupied,
            agreement: this.agreement_id,
            com_id: this.company_id
          });
          this.staffList = data.map(el=>{
            return {id: el.value, label: el.name}
          });
          this.completedBy=[]
          this.completedByList=[]
          this.flagThree++
          if (data.length > 1) {
            this.completedBy=['all']
          } 
          if (data.length ===1) {
            this.completedBy[0] = data[0].value
          } 
          if (data.length > 0) {
            
            const list = data.map(el=>{
              return {id: el.value, label: el.name}
            });
            this.completedByList = this.filteredData(list);
          }
        },
        async getOccupiedByList() {
          const { data: { data }} = await axios.get("/get-occupied-by");
          this.occupiedByList = data;
        },
        async getStaffMemberList() {
            const { data: { data }} = await axios.post("/get-completed-by-list-by-property",{
                prop_id: this.prop
            });
            this.staffMemberList = data;
            if (this.staffMemberList.length===1) {
              this.staffMember = this.staffMemberList[0].value
            } else {
              this.staffMember = 'all'
            }
            if (this.staffMemberList.length===0) {
              this.staffMember = ''
            }
        },
        async getItemTypeList() {
          this.itemTypeList = [];
          this.itemType = [];
          const { data: { data }} = await axios.post("/get-item-type-list-by-property",{
            prop_id: this.props.toString()
          });
          if (data.length>1) {
            this.itemTypeList = [{
              id:'all',
              label:'All',
              children:[
                ...data
              ]
            }];
            this.itemType[0] = 'all'
          }
          // if(this.itemTypeList[0].children && this.itemTypeList[0].children.length>1){
          // }
          this.flag++
          if (data.length > 1) {
            this.itemType=['all']
          } 
          if (data.length ===1) {
            this.itemTypeList = [
              ...data
            ];
            this.itemType[0] = data[0].value
          }
          if (data.length > 0) {
            
            this.itemTypeList = this.filteredData(data);
          }
        },
        async getIssueSummaryItemTypeList() {
          const { data: { data }} = await axios.post("/get-issue-summary-items",{
            prop_id: this.props.toString()
          });
          this.itemTypeList = data.map(e=>{
            return{
              label:e.name,
              id: e.id
            }
          });
          if(data.length===1){
            this.itemType[0] = this.itemTypeList[0].id
          } 
          if(data.length > 1) {
            this.itemType[0] = 'all'
          }
          this.statusKey++
        },
        async getIssueSummaryCompletedByList() {
            const { data: { data }} = await axios.post("/get-issue-summary-completed-by",{
                prop_id: this.props.toString(),
                reported_by: this.reported_by
            });
            this.staffMemberList = data.map(e=>{
              return{
                label:e.name,
                id: e.value
              }
            });
            this.staffMember = '';
            if (this.staffMemberList.length===1) {
              this.staffMember = this.staffMemberList[0].value
            } else {
              this.staffMember = 'all'
            }
            if (this.staffMemberList.length===0) {
              this.staffMember = ''
            }
        },
        async getIssueSummaryReportedByList() {
            const { data: { data }} = await axios.get("/get-issue-summary-reported-by");
            this.reportedByList = data.map(e=>{
              return{
                ...e,
                id: e.value
              }
            });
        },
        async getRequestedByTypesList() {
            const { data: { data }} = await axios.get("/get-requested-by-types");
            this.requestedByList = data;
        },
        async getItemListIssueSummaryByItem() {
            this.filterOneDataKey = [];

            let info = {
              prop_id: this.props.toString(),
              company_id: this.company_id,
              agreement: this.agreement_id,
            };
            
            const { data: { data }} = await axios.post("/get-Item-List-Issue-Summary-By-Item", info);
            
            if (data.length > 1) {
              this.filterOneDataKey = ['all']
            } else if (data.length === 1) {
              this.filterOneDataKey[0] = data[0].id
            } else {
              this.filterOneDataKey = ['']
            }
            this.statusKey++;
            this.filterOneDataList = data.map(e=>{
              return{
                label:e.name,
                id: e.id
              }
            });
        },
    }
}