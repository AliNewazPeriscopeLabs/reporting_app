import axios from "axios";
// work order report state
export default {
    data(){
        return{
            staffMemberList: [],
            staffMember: "all"
        }
    },
    methods:{
        async getStaffMemberList() {
          const { data: { data }} = await axios.post("/get-staff-member-list-by-property",{
            prop_id: this.prop
          });
          this.staffMemberList = data.map(e=>{
            return{
              label:e.name,
              id: e.value
            }
          });
          if (this.staffMemberList.length===1) {
            this.staffMember = this.staffMemberList[0].value
          } else {
            this.staffMember = 'all'
          }
          if (this.staffMemberList.length===0) {
            this.staffMember = ''
          }
        }
    }
}