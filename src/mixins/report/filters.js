import moment from "moment";
import axios from "axios";
import  toaster from '@/utils/toaster';
const { toastr } = toaster
import EndPoints from "../../utils/endpoint";
const errorMessage = {
  data:{
    success: false,
    data: [],
    message: "We can't process your request. Please narrow down search criteria."
  }
}
export default {
  computed: {
    disRep() {
      // check required fields
      for (const e of this.filters) {
        if (parseInt(e.rp_required)) {
          if (
            (this.from_date === "" || !this.from_date) && 
            (e.rp_type === "datetime" || e.rp_type === "datetime_ignoregmt")
          ) {
            return true;
          }
          if (
            (this.to_date === "" || !this.to_date) && 
            (e.rp_type === "datetime_end" || e.rp_type === "datetime_end_ignoregmt")  && !this.printAllCurrent
          ) {
            return true;
          }
          if (e.rp_name === "in_resolution" && !this.in_resolution.length) {
            return true;
          }
          if (e.rp_name === "in_status" && this.status === null) {
            return true;
          }
          /* Key Sign In Out report */
          if (e.rp_name === "in_status_key" && this.status==='') {
            return true
          } else if (e.rp_name === "in_status_key" && this.status===0) {
            return false
          }
          // room notices report
          if (
            e.rp_name === 'in_status_list' && !this.statusDataKey.length || 
            e.rp_name === 'in_init_mode' && !this.statusDataKey.length|| 
            e.rp_name === 'in_generate_mode' && !this.statusDataKey.length
          ) {
            return true;
          }
          if (e.rp_name === "in_area" && !this.in_area.length) {
            return true;
          }
          if (e.rp_name === "in_issue" && !this.in_issue.length) {
            return true;
          }
          if (e.rp_name === "in_area_type" && (this.areaCategory[0] === '' || this.areaCategory.length===0)) {
            return true;
          }
          if (e.rp_name === "in_item_type_wo" && this.itemType[0]==='') {
            return true;
          }
          if (e.rp_name === "in_completed_by_wo" && this.staffMember==='') {
            return true;
          }
          if (e.rp_name === "in_property_id" && (Array.isArray(this.props) && !this.props.length) || (!Array.isArray(this.props) && this.props === undefined) || this.props === '') {
            return true;
          }
          if ((e.rp_name === "in_connect_property_id" || e.rp_name === "in_sales_property_id") && (this.premiumProps === null || this.premiumProps === undefined)) {
            return true;
          }
          if (e.rp_name === "in_template_id" && (this.template_id === null || this.template_id === "")) {
            return true;
          }
          if (e.rp_name === "in_requested_by" && this.requestedBy === "") {
            return true;
          }
          if (e.rp_name === "in_requested_by_rs" && !this.reqByMl.length) {
            return true;
          }
          if (e.rp_name === "in_item_id" && (!this.item_id.length || this.item_id[0] === "")) {
            return true;
          }
          if (e.rp_name === "in_hk_items" && !this.hkItem.length) {
            return true;
          }
          if (e.rp_name === "in_pm_item_id" && this.singleKey===null) {
            return true;
          }
          /* Academy Scores, User Activity, Room Status Exception, Properties Below Work Order Threshold, Area History, All To Do items, Issue Summary by Item reports, trace details, and cleaning plus report */
          if ((
            e.rp_name === "in_test_user_ids" || 
            e.rp_name === "in_submitted_by_rser" || 
            e.rp_name === "in_region_id" ||   
            e.rp_name === "in_item_wo" ||  
            e.rp_name === "in_cleanings_area_id" || 
            e.rp_name === "in_hk_breakout_id"
            ) && (!this.filterOneDataKey.length || this.filterOneDataKey[0] === "" || this.filterOneDataKey[0] === null)) {
            return true;
          }
          if ((e.rp_name === "in_quore_company" || e.rp_name === "in_area_his_id" || e.rp_name === "in_capex_ownership_id" || e.rp_name === "in_department") && !this.filterOneDataValue) {
            return true;
          }
          // if (e.rp_name === 'in_capex_bind_ownership' && this.isDepartmentId && this.filterOneDataValue === 0) {
          //   return false;
          // } else 
          if (e.rp_name === 'in_capex_bind_ownership' && this.filterOneDataValue===null) {
            return true;
          }
          if (e.rp_name === "in_task_origin_id" && this.taskOriginKey.toString() === "") {
            return true;
          }
          if ((e.rp_name === "in_type_id" || e.rp_name === "in_lf_type_id" || e.rp_name === "insp_result" || e.rp_name === "in_capex_date_range") && this.typeDataKey.toString() === "") {
            return true;
          }
          /* trace details and average cleaning times by attendant report */
          if (e.rp_name === "in_report_ids" && (!this.filterThreeDataKey.length || this.filterThreeDataKey[0] === "")) {
            return true;
          }
          if (( 
            e.rp_name === "in_cleanings_attendant_id" ||
            e.rp_name === "in_staff_id" ||
            e.rp_name === "in_region_property" || 
            e.rp_name === "in_capex_property_id" || 
            e.rp_name === "in_capex_bind_property" 
          ) && !this.filterThreeDataValue) {
            return true;
          }
          /* Key Sign In Out report */
          if (e.rp_name === "in_keys" && this.filterOneDataKey.toString() === "") {
            if (this.status === 0) {
              return false;
            } else {
              return true;
            }
          } else if (e.rp_name === "in_keys" && this.filterOneDataKey.toString() !== "" && this.status === 0) {
            return false;
          }
          if (e.rp_name === "in_template_ids"   && (this.filterOneDataValue === null || this.filterOneDataValue === '') && !e.rp_allowmultipleselect) {
            return true
          }
          /* Cash Discrepancy, Mail Check Register, Key Audit, Pre-Departure Call Audit,
          Pre-Departure Calls, Daily Deposit Record, Avg. Time to Res. By Staff Member,
          Wake Up calls, Vendor Register, Rebate Log, Area Temp. & Humidity Log, Safe Removal Record, Log Book Activities, readings, Completed PMs, top requested items, User Activity report, and Total Failed Items reports */
          if ((
            e.rp_name === "in_employee_id" || 
            e.rp_name === "in_mail_check_submitted_by" || 
            e.rp_name === "in_processed_by_key" || 
            e.rp_name === "in_processed_by_predep_audit" || 
            e.rp_name === "in_processed_by_predep" || 
            e.rp_name === "in_shift_id_ddr" || 
            e.rp_name === "in_resolved_user" || 
            e.rp_name === "in_logged_by" || 
            e.rp_name === "in_recorded_by" || 
            e.rp_name === "in_manager_auth" || 
            e.rp_name === "in_area_id" || 
            e.rp_name === 'in_prepared_by_srr' || 
            e.rp_name === 'in_author_id' || 
            e.rp_name === "in_posted_by" || 
            e.rp_name === "in_pm_template" || 
            (e.rp_name === "in_template_ids" && e.rp_allowmultipleselect) || 
            e.rp_name === "in_item_type_treq" || 
            e.rp_name === "in_user_act_id" || 
            e.rp_name === "in_attendant_id" || 
            e.rp_name === "in_inspector_id" || 
            e.rp_name === "in_staff_member_sat" || 
            e.rp_name === "cleaning_insp_item" ||
            e.rp_name === "cleaning_plus_insp_item" ||
            e.rp_name === "in_ins_template_id" || 
            e.rp_name === "in_active_users"
          ) && (!this.filterOneDataKey.length || this.filterOneDataKey[0]==='')) {
            return true;
          }
          /* Key Audit, Pre-Departure Call Audit, Daily Deposit Record, Rebate Log, Area Temp. & Humidity Log, and room notices reports */
          if ((
            e.rp_name === "in_submitted_by_key" || 
            e.rp_name === "in_submitted_by_predep_audit" || 
            e.rp_name === "in_cashier_id_ddr" || 
            e.rp_name === "in_gsm_auth" || 
            e.rp_name === "in_logged_by_ath" || 
            e.rp_name === "in_pm_result" || 
            e.rp_name === "in_pm_type" || 
            e.rp_name === "in_issue_hk" || 
            e.rp_name === "in_cleaning_type" || 
            e.rp_name === "in_supervisor_id" || 
            e.rp_name === "in_cleanings_rm_type_id" || 
            e.rp_name === "in_group_ids" || 
            e.rp_name === "in_admin_region" || 
            e.rp_name === "in_capex_department_id"
          ) && (!this.filterTwoDataKey.length || this.filterTwoDataKey[0]==='' || this.filterTwoDataKey[0]===null)) {
            return true;
          }
          if (e.rp_name === "in_occupied_by" && this.inOccupied === "") {
            return true;
          }
          if ((e.rp_name === "in_completed_by" || e.rp_name === 'completed_by_req') && (this.completedBy[0] === '' || !this.completedBy.length)) {
            return true;
          }
          if (e.rp_name === "in_staff_member_id" && this.staffMember.toString() === "") {
            return true;
          }
          if (e.rp_name === "in_item_type" && !this.itemType.length) {
            return true;
          }
          if (e.rp_name === "in_submitted_by" && !this.adaComSubmittedBy.length) {
            return true;
          }
          if (e.rp_name === "in_package_submitted_by" && !this.GPPSubmittedBy.length && !this.printAllCurrent) {
            return true;
          }
          if (e.rp_name === "in_staff_member" && !this.staffMember.length) {
            return true;
          }
          if (e.rp_name === "in_budget_year" && this.budgetYear === null) {
            return true;
          }
          if (e.rp_name === "in_budget_month" && !this.budgetMonth) {
            return true;
          }
          if (e.rp_name === "in_closed_by" && (this.issueClosedBy === "" || this.issueClosedBy === null)) {
            return true;
          }
          if (
            e.rp_name === "in_user_ids" && !this.userIds.length || 
            e.rp_name === "in_properties_id" && !this.propertyIds.length
          ) {
            return true;
          }
          if (e.rp_name === "in_usage_agreement" && this.status === "A" && (this.agreementsKey === null || this.agreementsKey === undefined)) {
            return true;
          }
          if (e.rp_name === "in_usage_company" && this.status === "C" && (this.companiesKey === null || this.companiesKey === undefined)) {
            return true;
          }
          if (e.rp_name === "in_usage_ownership" && this.status === "O" && (this.ownershipsKey === null || this.ownershipsKey === undefined)) {
            return true;
          }
          if (e.rp_name === "in_usage_property" && this.status === "P" && (this.propertiesKey === null || this.propertiesKey === undefined)) {
            return true;
          }
          if (e.rp_name === "in_agt_ows_co_props" && (this.usagePropKey === null || this.usagePropKey === undefined) && (this.status === "A" || this.status === "C" || this.status === "O")) {
            return true;
          }
          if (e.rp_name === "in_capex_status_group_id" && this.statusGroupKey === null) {
            return true;
          }
          if (e.rp_name === "in_capex_status_id" && this.filterFourDataValue === null) {
            return true;
          }
          if (e.rp_name === "in_budget_department" && this.filterOneDataValue === null) {
            return true;
          }
          if (e.rp_name === "in_budget_groups" && this.filterTwoDataValue === null) {
            return true;
          }
          if (e.rp_name === "in_pdf_orientation" && this.output_format === 'pdf' && this.pdfOrientation === null) {
            return true;
          }
          if (e.rp_name === "in_capex_bind_inflation" && (this.inflationRate === '' || this.inflationRate <= 0)) {
            return true;
          }
        }
      }
      return false;
    }
  },
  data() {
    const self=this;
    return {
      repIdsExportOnly:[
        'capExRep04',
        'capExRep05'
      ],
      reportFilterData:{
        'in_template_id':{
          method: async (x) => {
            // get templates list
            await self.getTemplates(x);
          }
        },
        'in_reported_by':{
          method: async (x) => {
            // get reported by types  list issue summary
            await self.getIssueSummaryReportedByList(x);
          }
        },
        'in_completed_by_wo':{
          method: async (x) => {
            // get reported by types  list issue summary
            await self.getIssueSummaryCompletedByList(x);
          }
        },
        'in_item_type_wo':{
          method: async (x) => {
            // get item type issue summary list
            await self.getIssueSummaryItemTypeList(x);
          }
        },
        'in_item_id':{
          method: async () => {
            // get item list
            await self.getInspectionItems();
          }
        },
        'in_area_type':{
          method: async () => {
            // get area type list
            await self.getAreaTypeList();
          }
        },
        'in_area':{
          method: async (x) => {
            // get area list
            await self.getAreaList(x);
          }
        },
        'in_issue':{
          method: async (x) => {
            // get issue list
            await self.getIssueList(x);
          }
        },
        'in_resolution':{
          method: async (x) => {
            // get resolution list
            await self.getResolutionList(x);
          }
        },
        'in_test_user_ids':{
          method: async () => {
            // get academy scores test users list
            await self.getUsersList();
          }
        },
        'in_issue_hk':{
          method: async () => {
            // get room notice type list
            await self.roomNoticeTypeList();
          }
        },
        'in_posted_by':{
          method: async () => {
            // get users postBy list for readings report
            await self.getReadingsUserPostedByList();
          }
        },
        'in_region_id':{
          method: async () => {
            // get region list
            await self.getRegionList();
          }
        },
        'in_admin_region':{
          method: async () => {
            // get region list
            await self.getAdminRegionList();
          }
        },
        'in_template_ids':{
          method: async (ml) => {
            // get template list
            await self.pmTemplateListData(ml);
          }
        },
        'in_pm_result':{
          method: async (ml) => {
            // get template list
            await self.pmResultList(ml);
          }
        },
        'in_staff_member_id':{
          method: async () => {
            // get template list
            await self.getStaffMemberList();
          }
        },
        'in_occupied_by':{
          method: async (x) => {
            // get template list
            await self.getOccupiedByList(x);
          }
        },
        'in_completed_by':{
          method: async () => {
            // get template list
            await self.getStaffList();
          }
        },
        'completed_by_req':{
          method: async () => {
            // get template list
            await self.getReqCompletedByList();
          }
        },
        'in_item_type':{
          method: async () => {
            // get item type list
            await self.getItemTypeList();
          }
        },
        'in_hk_items':{
          method: async () => {
            // get item type list
            await self.gethkItemList();
          }
        },
        'in_submitted_by':{
          method: async () => {
            // get ada compliance submitted by list
            await self.getAdaComSubmittedByList();
          }
        },
        'in_employee_id':{
          method: async () => {
            // get cash discrepancy employee list
            await self.getCashDisEmployeeList();
          }
        },
        'in_keys':{
          method: async () => {
            // get key sign in out key items list
            await self.getKeySignKeyItemsList();
          }
        },
        'in_package_submitted_by':{
          method: async () => {
            // get guest package submitted by user list
            await self.getSubmittedByListGuestPackage();
          }
        },
        'in_mail_check_submitted_by':{
          method: async () => {
            // get mail check register submitted by user list
            await self.getMailCheckSubmittedByList();
          }
        },
        'in_processed_by_key':{
          method: async () => {
            // get key audit processed by user list
            await self.getKeyAuditProcessedByList();
          }
        },
        'in_requested_by':{
          method: async () => {
            // get key audit processed by user list
            await self.getRequestedByTypesList();
          }
        },
        'in_requested_by_rs':{
          method: async () => {
            // get key audit processed by user list
            await self.getRequestedByTypesListMl();
          }
        },
        'in_submitted_by_key':{
          method: async () => {
            // get key audit submitted by user list
            await self.getKeyAuditSubmittedByList();
          }
        },
        'in_staff_member':{
          method: async () => {
            // get staff member list
            await self.getStaffMemberByPropertyList('in_staff');
          }
        },
        'in_pm_template':{
          method: async () => {
            // pm Template List By Type Data
            await self.pmTemplateListByTypeData();
          }
        },
        'in_pm_type':{
          method: async () => {
            // pm Template type List 
            await self.pmTypeList();
          }
        },
        'in_processed_by_predep_audit':{
          method: async () => {
            // get pre departure call audit processed by list
            await self.getPreDepAuditProcessedByList();
          }
        },
        'in_submitted_by_predep_audit':{
          method: async () => {
            // get pre departure call audit submitted by list
            await self.getPreDepAuditSubmittedByList();
          }
        },
        'in_processed_by_predep':{
          method: async () => {
            // get pre departure calls processed by list
            await self.getPreDepProcessedByList();
          }
        },
        'in_shift_id_ddr':{
          method: async () => {
            // get Daily Deposit Records Shift list
            await self.getDDRShiftList();
          }
        },
        'in_cashier_id_ddr':{
          method: async () => {
            // get Daily Deposit Records Cashier list
            await self.getDDRCashierList();
          }
        },
        'in_resolved_user':{
          method: async () => {
            // get Avg. Time to Res. By Staff Member resolved user list
            await self.getResolvedUserList();
          }
        },
        'in_logged_by':{
          method: async () => {
            // get wake up calls logged by list 
            await self.getWUCLoggedByList();
          }
        },
        'in_recorded_by':{
          method: async () => {
            // get Vendor Register recorded by list 
            await self.getVRRecordedByList();
          }
        },
        'in_submitted_by_rser':{
          method: async () => {
            // get Room St Exception submitted by list 
            await self.getRoomStSubmittedByList();
          }
        },
        'in_manager_auth':{
          method: async () => {
            // get Rebate log manager auth list 
            await self.getRLManagerList();
          }
        },
        'in_gsm_auth':{
          method: async () => {
            // get Rebate log GSM auth list 
            await self.getRLGsmList();
          }
        },
        'in_area_id':{
          method: async () => {
            // get Area Temperature & humidity Area list 
            await self.getATHAreaList();
          }
        },
        'in_logged_by_ath':{
          method: async () => {
            // get Area Temperature & humidity Logged By list 
            await self.getATHLoggedByList();
          }
        },
        'in_prepared_by_srr':{
          method: async () => {
            // get Safe Removal Records Prepared By list 
            await self.getSRRPreparedByList();
          }
        },
        'in_author_id':{
          method: async () => {
            // get Log Book Activity Author List 
            await self.getLogAuthorList();
          }
        },
        'in_item_type_treq':{
          method: async () => {
            // get Top Requested Items Item type List 
            await self.reqItemTypeList();
          }
        },
        'in_area_his_id':{
          method: async () => {
            // get Area List for Area History
            await self.getAreaHistoryAreaList();
          }
        },
        'in_user_act_id':{
          method: async () => {
            // User List for User Activity
            await self.getUserActivityUserList();
          }
        },
        'in_item_wo':{
          method: async () => {
            // Item List for Issue Summary By Item
            await self.getItemListIssueSummaryByItem();
          }
        },
        'in_attendant_id':{
          method: async () => {
            // Attendant List for Total Failed Items Report
            await self.getAttendantList();
          }
        },
        'in_supervisor_id':{
          method: async () => {
            // Supervisor List for Total Failed Items Report
            await self.getSupervisorList();
          }
        },
        'in_cleanings_attendant_id':{
          method: async () => {
            // Cleaning Attendant List for Cleanings Plus Report
            await self.getCleaningsPlusAttendantList();
          }
        },
        'in_cleanings_area_id':{
          method: async () => {
            // Cleaning Room List for Cleanings Plus Report
            await self.getCleaningsPlusRoomList();
          }
        },
        'in_inspector_id':{
          method: async () => {
            // Inspector List for Cleanings Plus Report
            await self.getInspectorListByProperty();
          }
        },
        'in_cleanings_rm_type_id':{
          method: async () => {
            // Cleaning Room Type List for Cleanings Plus Report
            await self.getCleaningsPlusRoomTypeList();
          }
        },
        'in_hk_breakout_id':{
          method: async () => {
            // Breakout List for Cleanings Plus Report
            await self.getCleaningsPlusBreakoutList();
          }
        },
        'in_init_mode':{
          method: async () => {
            // init mode List
            await self.getInitModeGroup();
          }
        },
        'in_generate_mode':{
          method: async () => {
            // init mode List
            await self.getGenerateModeGroup();
          }
        },
        'in_group_ids':{
          method: async () => {
            //  category List
            await self.getReportGroupsList();
          }
        },
        'in_report_ids':{
          method: async () => {
            //  report by category
            await self.getReportsByGroup();
          }
        },
        'in_user_ids':{
          method: async () => {
            //  all active users
            await self.getOptionsList('all');
          }
        },
        'in_active_users':{
          method: async () => {
            //  all active users
            self.filterOneDataKey = [];
            await self.getActiveUsersList();
          }
        },
        'in_staff_member_sat':{
          method: async () => {
            // staff member for satisfaction calls
            await self.staffMemberListForSatCalls();
          }
        },
        'cleaning_insp_item':{
          method: async () => {
            await self.getInspectionItemByCleaningList();
          }
        },
        'cleaning_plus_insp_item':{
          method: async () => {
            await self.getInspectionItemByCleaningPlusList();
          }
        },
        'insp_result':{
          method: async () => {
            // staff member for satisfaction calls
            await self.getInspectResultList();
          }
        },
        'in_ins_template_id':{
          method: async () => {
            // staff member for satisfaction calls
            await self.getTemplates();
          }
        },
        'in_capex_ownership_id':{
          method: async () => {
            // capEx report filter state
            await self.getCapExReqOwnershipList();
          }
        },
        'in_capex_status_group_id':{
          method: async () => {
            // capEx report filter state
            await self.getCapExReqStatusGroupList();
          }
        },
        'in_capex_department_id':{
          method: async () => {
            // capEx report filter state
            await self.getCapExReqDepartmentList();
          }
        },
        'in_capex_date_range':{
          method: async () => {
            // capEx report filter state
            await self.getCapExReqDateRangeList();
          }
        },
        'in_category':{
          method: async () => {
            await self.getBudgetCategoryList();
          }
        },
        'in_department':{
          method: async () => {
            await self.getBudgetDepartmentList();
          }
        },
        'in_budget_department':{
          method: async () => {
            await self.getBudgetDepartmentList();
          }
        },
        'in_vendor':{
          method: async () => {
            await self.getCapExVendorList();
          }
        },
      }
    }
  },
  methods:{
    async getPaceReportColumn(lang) {
      let info = {
        prop_id: this.props.toString(),
        from_date: this.from_date === "" ? "" : moment(this.from_date).format("YYYY-MM-DD 00:00:00"),
        to_date: this.to_date === "" ? moment(new Date()).format("YYYY-MM-DD 23:59:59") : moment(this.to_date).format("YYYY-MM-DD 23:59:59"),
        lang_id: lang
      }
      const {
        data: { data },
      } = await axios.post("/get-column-data-for-pace", info);
      if (data.length) {
        return data;
      }
    },
    getSelectedNames(nodes,col){
      const labels = nodes.map(e=> e[col]);
      return labels.join(', ')
    },
    getIds(nodes){
      const labels = nodes.map(e=> e.id);
      return labels.join(',')
    },
    getTotalCount(colToCount,colToCheck,flag){
      let sum=0;
      for (const row of this.datalist) {
        if (row[colToCount]!==undefined && flag.includes(row[colToCheck]) && !isNaN(row[colToCount])) {
          sum+= parseInt(row[colToCount]); 
        }
      }
      return sum;
    },
    getNames(arrParam, arrData){
      if (!arrData.length) {
        return '';
      }
      let arr=[];
      if (!arrData[0]?.children) {
        const name = arrData.find(e=>e.id == arrParam.toString()).label
        return [name];
      }
      if (Number.isInteger(arrParam)) {
        const name =arrData[0].children.find(e=>e.id == arrParam).label
        return [name];
      }
      if (arrParam.toString()==='all') {
        return this.words['all'];
      }
      if (arrData[0]?.children) {
        arrData[0].children.forEach(e=>{
          if (arrParam.includes(e.id)) {
            arr.push(e.label)          
          }
        })
      } else {
        if (arrParam.includes(arrData[0].id)) {
          arr.push(arrData[0].label)          
        }
      }
      return arr
    },
    async getFilterData(x){
      await Promise.all([
        ...(this.filters.find(el=> el.rp_name === "in_template_id") !== undefined ? [ this.reportFilterData['in_template_id']?.method(x) ]:[]),
        ...(this.filters.find(el=> el.rp_name === "in_item_id") !== undefined ? [ this.reportFilterData['in_item_id']?.method() ]:[]),
        ...(this.filters.find(el=> el.rp_name === "in_area_type") !== undefined ? [ this.reportFilterData['in_area_type']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_area") !== undefined ? [ this.reportFilterData['in_area']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_issue") !== undefined ? [ this.reportFilterData['in_issue']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_resolution") !== undefined ? [ this.reportFilterData['in_resolution']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_test_user_ids") !== undefined ? [ this.reportFilterData['in_test_user_ids']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_issue_hk") !== undefined ? [ this.reportFilterData['in_issue_hk']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_posted_by") !== undefined ? [ this.reportFilterData['in_posted_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_region_id") !== undefined ? [ this.reportFilterData['in_region_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_template_ids") !== undefined ? [ this.reportFilterData['in_template_ids']?.method(this.filters.find(el=> el.rp_name === "in_template_ids").rp_allowmultipleselect) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_completed_by") !== undefined ? [ this.reportFilterData['in_completed_by']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "completed_by_req") !== undefined ? [ this.reportFilterData['completed_by_req']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_occupied_by") !== undefined ? [ this.reportFilterData['in_occupied_by']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_id") !== undefined ? [ this.reportFilterData['in_staff_member_id']?.method(x) ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_item_type") !== undefined ? [ this.reportFilterData['in_item_type']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by") !== undefined ? [ this.reportFilterData['in_submitted_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_employee_id") !== undefined ? [ this.reportFilterData['in_employee_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_keys") !== undefined ? [ this.reportFilterData['in_keys']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_package_submitted_by") !== undefined ? [ this.reportFilterData['in_package_submitted_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_mail_check_submitted_by") !== undefined ? [ this.reportFilterData['in_mail_check_submitted_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_key") !== undefined ? [ this.reportFilterData['in_processed_by_key']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_key") !== undefined ? [ this.reportFilterData['in_submitted_by_key']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_staff_member") !== undefined ? [ this.reportFilterData['in_staff_member']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_closed_by") !== undefined ? [ this.reportFilterData['in_closed_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep_audit") !== undefined ? [ this.reportFilterData['in_processed_by_predep_audit']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_predep_audit") !== undefined ? [ this.reportFilterData['in_submitted_by_predep_audit']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep") !== undefined ? [ this.reportFilterData['in_processed_by_predep']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_shift_id_ddr") !== undefined ? [ this.reportFilterData['in_shift_id_ddr']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_cashier_id_ddr") !== undefined ? [ this.reportFilterData['in_cashier_id_ddr']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_resolved_user") !== undefined ? [ this.reportFilterData['in_resolved_user']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_logged_by") !== undefined ? [ this.reportFilterData['in_logged_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_recorded_by") !== undefined ? [ this.reportFilterData['in_recorded_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_rser") !== undefined ? [ this.reportFilterData['in_submitted_by_rser']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_manager_auth") !== undefined ? [ this.reportFilterData['in_manager_auth']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_gsm_auth") !== undefined ? [ this.reportFilterData['in_gsm_auth']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_area_id") !== undefined ? [ this.reportFilterData['in_area_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_logged_by_ath") !== undefined ? [ this.reportFilterData['in_logged_by_ath']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_prepared_by_srr") !== undefined ? [ this.reportFilterData['in_prepared_by_srr']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_item_type_wo") !== undefined ? [ this.reportFilterData['in_item_type_wo']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_completed_by_wo") !== undefined ? [ this.reportFilterData['in_completed_by_wo']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_reported_by") !== undefined ? [ this.reportFilterData['in_reported_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_author_id") !== undefined ? [ this.reportFilterData['in_author_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_requested_by") !== undefined ? [ this.reportFilterData['in_requested_by']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_requested_by_rs") !== undefined ? [ this.reportFilterData['in_requested_by_rs']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_hk_items") !== undefined ? [ this.reportFilterData['in_hk_items']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_pm_template") !== undefined ? [ this.reportFilterData['in_pm_template']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_pm_type") !== undefined ? [ this.reportFilterData['in_pm_type']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_pm_result") !== undefined ? [ this.reportFilterData['in_pm_result']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_item_type_treq") !== undefined ? [ this.reportFilterData['in_item_type_treq']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_area_his_id") !== undefined ? [ this.reportFilterData['in_area_his_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_user_act_id") !== undefined ? [ this.reportFilterData['in_user_act_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_item_wo") !== undefined ? [ this.reportFilterData['in_item_wo']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_attendant_id") !== undefined ? [ this.reportFilterData['in_attendant_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_supervisor_id") !== undefined ? [ this.reportFilterData['in_supervisor_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_cleaning_type") !== undefined ? [ this.reportFilterData['in_cleaning_type']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_attendant_id") !== undefined ? [ this.reportFilterData['in_cleanings_attendant_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_area_id") !== undefined ? [ this.reportFilterData['in_cleanings_area_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_inspector_id") !== undefined ? [ this.reportFilterData['in_inspector_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_rm_type_id") !== undefined ? [ this.reportFilterData['in_cleanings_rm_type_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_hk_breakout_id") !== undefined ? [ this.reportFilterData['in_hk_breakout_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_group_ids") !== undefined ? [ this.reportFilterData['in_group_ids']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_report_ids") !== undefined ? [ this.reportFilterData['in_report_ids']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_user_ids") !== undefined ? [ this.reportFilterData['in_user_ids']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_active_users") !== undefined ? [ this.reportFilterData['in_active_users']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_init_mode") !== undefined ? [ this.reportFilterData['in_init_mode']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_generate_mode") !== undefined ? [ this.reportFilterData['in_generate_mode']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_sat") !== undefined ? [ this.reportFilterData['in_staff_member_sat']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "cleaning_insp_item") !== undefined ? [ this.reportFilterData['cleaning_insp_item']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "cleaning_plus_insp_item") !== undefined ? [ this.reportFilterData['cleaning_plus_insp_item']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "insp_result") !== undefined ? [ this.reportFilterData['insp_result']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_ins_template_id") !== undefined ? [ this.reportFilterData['in_ins_template_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_admin_region") !== undefined ? [ this.reportFilterData['in_admin_region']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_region_property") !== undefined ? [ this.reportFilterData['in_region_property']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_capex_ownership_id") !== undefined ? [ this.reportFilterData['in_capex_ownership_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_capex_status_group_id") !== undefined ? [ this.reportFilterData['in_capex_status_group_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_capex_department_id") !== undefined ? [ this.reportFilterData['in_capex_department_id']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_capex_date_range") !== undefined ? [ this.reportFilterData['in_capex_date_range']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_category") !== undefined ? [ this.reportFilterData['in_category']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_budget_department") !== undefined ? [ this.reportFilterData['in_budget_department']?.method() ]:[]) ,
        ...(this.filters.find(el=> el.rp_name === "in_vendor") !== undefined ? [ this.reportFilterData['in_vendor']?.method() ]:[])
      ]); 
    },
    async getReportData(re='') {
      if (typeof this.from_date.getMonth === 'function' && typeof this.to_date.getMonth === 'function') {
        this.from_date.setHours(0,0,0,0);
        this.to_date.setHours(0,0,0,0);
        if (this.from_date.getTime()> this.to_date.getTime()) {
            toastr.error(this.words['starting_date_warning']);
            return;
        }
      }
      this.load = false;
      let info = {
        ...(this.filters.find(el=> el.rp_name === "in_date") !== undefined ? { 
          date: this.from_date === "" ? 
          moment(new Date()).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss") : 
          moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss")
        } : this.filters.find(el=> el.rp_name === "in_pace_start_date") !== undefined ? {
          from_date: this.from_date === "" ? "" : moment(this.from_date).format("YYYY-MM-DD 00:00:00")
        } : {
          from_date: this.from_date === "" ? "" : 
          moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss")
        }),
        ...(this.filters.find(el=> el.rp_name === "in_date") !== undefined ? { 
          // no need to_date
        } : this.filters.find(el=> el.rp_name === "in_pace_end_date") !== undefined ? {
          to_date: this.to_date === "" ? 
          moment(new Date()).format("YYYY-MM-DD 23:59:59") : moment(this.to_date).format("YYYY-MM-DD 23:59:59")
        } : {
          to_date: this.to_date === "" ? 
          moment(new Date()).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss") : 
          moment(this.to_date).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss")
        }),
        ...(this.filters.find(el=> el.rp_displaytype === "property_id") !== undefined ? { prop_id: this.props.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_id") !== undefined ? { temp_id: this.template_id }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_id") !== undefined ? { item_id: this.item_id.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_status" || el.rp_name === "in_status_key") !== undefined ? { status: this.status }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_status_list") !== undefined ? { status_key: this.statusDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_type") !== undefined ? { area_type: this.areaCategory.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area") !== undefined ? { in_area: this.in_area.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_issue") !== undefined ? { in_issue: this.in_issue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_resolution") !== undefined ? {  in_resolution: this.in_resolution.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_test_user_ids") !== undefined ? {  test_user_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_issue_hk") !== undefined ? { notice_type: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_posted_by") !== undefined ? {  in_posted_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_region_id") !== undefined ? {  in_region_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_ids")?.rp_allowmultipleselect === 1 ? {  in_template_id: this.filterOneDataKey.toString() } : (this.filters.find(el=> el.rp_name === "in_template_ids") && this.filters.find(el=> el.rp_name === "in_template_ids")?.rp_allowmultipleselect !==1) ? { in_template_id: this.filterOneDataValue ? this.filterOneDataValue.toString() : this.filterOneDataValue } : {}),
        ...(this.filters.find(el=> el.rp_name === "in_occupied_by") !== undefined ? {  in_occupied_by: this.inOccupied }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_completed_by") !== undefined ? {  in_completed_by: this.completedBy.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "completed_by_req") !== undefined ? {  in_completed_by: this.completedBy.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_id") !== undefined ? {  in_staff_member_id: this.staffMember }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type") !== undefined ? {  in_item_type: this.itemType.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by") !== undefined ? {  in_submitted_by: this.adaComSubmittedBy.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_employee_id") !== undefined ? {  in_employee_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_keys") !== undefined ? {  in_keys: (this.status === 0) ? "all" : this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_package_submitted_by") !== undefined ? {  in_submitted_by: this.GPPSubmittedBy.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_print_all_current") !== undefined ? {  in_print_all: this.printAllCurrent ? 1 : 0 }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_mail_check_submitted_by") !== undefined ? {  in_submitted_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_key") !== undefined ? {  in_processed_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_key") !== undefined ? {  in_submitted_by: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member") !== undefined ? {  in_staff_member: this.staffMember.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_closed_by") !== undefined ? {  in_closed_by: this.issueClosedBy.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep_audit") !== undefined ? {  in_processed_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_predep_audit") !== undefined ? {  in_submitted_by: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep") !== undefined ? {  in_processed_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_shift_id_ddr") !== undefined ? {  shift_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cashier_id_ddr") !== undefined ? {  cashier_id: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_resolved_user") !== undefined ? {  resolved_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_logged_by") !== undefined ? {  logged_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_recorded_by") !== undefined ? {  recorded_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_rser") !== undefined ? {  submitted_by: this.filterOneDataKey.toString() } : {} ),
        ...(this.filters.find(el=> el.rp_name === "in_manager_auth") !== undefined ? {  manager_auth: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_gsm_auth") !== undefined ? {  gsm_auth: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_id") !== undefined ? {  area_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_logged_by_ath") !== undefined ? {  logged_by: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_prepared_by_srr") !== undefined ? {  prepared_by: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_reported_by") !== undefined ? {  in_reported_by: this.reported_by }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_completed_by_wo") !== undefined ? {  in_completed_by: this.staffMember }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type_wo") !== undefined ? {  in_item_type: this.itemType[0] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_author_id") !== undefined ? {  author_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_requested_by") !== undefined ? {  requested_by: this.requestedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_requested_by_rs") !== undefined ? {  requested_by: this.reqByMl.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_hk_items") !== undefined ? {  hk_item: this.hkItem.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_template") !== undefined ? {  in_pm_template: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_type") !== undefined ? {  in_pm_type: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_result") !== undefined ? {  in_pm_result: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_item_id") !== undefined ? {  in_item_id: this.singleKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type_treq") !== undefined ? {  item_type: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_his_id") !== undefined ? {  in_area_id: this.filterOneDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_type_id") !== undefined ? {  type_id: this.typeDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_user_act_id") !== undefined ? {  staff_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_wo") !== undefined ? {  item_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_task_origin_id") !== undefined ? {  task_origin_id: this.taskOriginKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_quore_company") !== undefined ? {  quore_company: this.filterOneDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_sales_property_id") !== undefined ? {  prop_id: this.premiumProps }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_id") !== undefined ? {  sales_staff: this.filterThreeDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_attendant_id") !== undefined ? {  attendant_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_supervisor_id") !== undefined ? {  supervisor_id: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleaning_type") !== undefined ? {  cleaning_type: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_attendant_id") !== undefined ? {  attendant_id: this.filterThreeDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_area_id") !== undefined ? {  area_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_inspector_id") !== undefined ? {  inspector_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_rm_type_id") !== undefined ? {  room_type: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_hk_breakout_id") !== undefined ? {  breakout: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_user_ids") !== undefined ? {  user_ids: this.getIds(this.userIds) }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_active_users") !== undefined ? {  user_ids: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_group_ids") !== undefined ? {  rep_group_ids: this.filterTwoDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_report_ids") !== undefined ? {  rep_ids: this.filterThreeDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_properties_id") !== undefined ? {  prop_ids: this.propertyIds.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_init_mode") !== undefined ? {  init_mode: this.statusDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_generate_mode") !== undefined ? {  init_mode: this.statusDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_sat") !== undefined ? {  staff_member: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "cleaning_insp_item") !== undefined ? {  inspection_item: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "cleaning_plus_insp_item") !== undefined ? {  inspection_item: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "insp_result") !== undefined ? {  inspection_result: this.typeDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_lf_type_id") !== undefined ? {  type_id: this.typeDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_ins_template_id") !== undefined ? {  in_template_id: this.filterOneDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_status") !== undefined ? {  tem_status: this.tempStatus }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_connect_property_id") !== undefined ? {  prop_id: this.premiumProps }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_do_other_pms") !== undefined ? {  do_other_pms: this.doOtherPms }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_agreement") !== undefined ? {  agreements: this.agreementsKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_company") !== undefined ? {  company: this.companiesKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_ownership") !== undefined ? {  ownership: this.ownershipsKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_property") !== undefined ? {  property: this.usagePropKey === null ? this.propertiesKey : this.usagePropKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_property_id") !== undefined ? {  prop_id: this.filterThreeDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_department_id") !== undefined ? {  department_id: this.filterTwoDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_status_id") !== undefined ? { 
          status_id: (this.filterFourDataValue.toString() === 'all' && this.statusGroupKey === 'approved') ? '5,6,7' 
          : (this.filterFourDataValue.toString() === 'all' && this.statusGroupKey === 'closed') ? '4,8,9,10' 
          : (this.filterFourDataValue.toString() === 'all' && this.statusGroupKey === 'pending') ? '1,2,3' 
          : this.filterFourDataValue.toString() 
        } : {}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_date_range") !== undefined ? {  date_type: this.typeDataKey.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_bind_property") !== undefined ? {  prop_id: this.filterThreeDataValue.toString() }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_bind_ownership") !== undefined ? {  owners_id: this.filterOneDataValue === null ? 'all' : this.filterOneDataValue.toString() }:{}),
        ...(this.r_id === 'AdminUsgRe' ? { getReportType: "data" } : {}),
        company_id: this.company_id,
        agreement: this.agreement_id,
      };
      const {
        data: { data, success, message, subject },
      } = await axios.post(EndPoints[this.r_id], info).catch(()=>{
        return errorMessage;
      });
      if (this.details.allow_double_table) {
        this.summaryData = data.shift()
        this.reservedSummaryData = JSON.parse(JSON.stringify(this.summaryData));
        this.datalist = data.shift()
        this.reservedData = JSON.parse(JSON.stringify(this.datalist));
      } else {
        this.datalist = data;
        this.reservedData = JSON.parse(JSON.stringify(data));
      }

      if (subject) {
        this.usageRepSub = subject;
      }

      if (this.datalist && (this.r_id === '9fOUn8o5R3' || this.r_id === 'YtQF8tPLTZ' || this.r_id === 'H7Vf223wGa')) {
        await this.getColumns(); //for boiler readings, pool readings, and pace report only
      }

      if (!success) {
        toastr.error(message);
      }
      if (this.sortedCol.length>0) {
        this.sortDataByCols(this.datalist, this.sortedCol);
      }
      this.list = Number.isInteger(this.props) ? [this.props] : [...this.props];
      this.prop_dummy = this.prop;
      this.from_dummy = this.from_date;
      this.to_dummy = this.to_date;
      if (re !== 'refresh') {
        await this.saveLog();
      }
      this.getDetails();
      this.load = true;
      await this.getRecentReportList();

    },
    findFilter(rp){
      return  (rp.rp_type === 'key' && rp.rp_displaytype === 'property_id') ||
        rp.rp_displaytype === 'dummy' ||
        rp.rp_type === 'datetime' ||
        rp.rp_type === 'datetime_ignoregmt' || 
        rp.rp_name === 'in_area_type' ||
        rp.rp_type === 'datetime_end' ||
        rp.rp_type === 'datetime_end_ignoregmt' ||
        rp.rp_name === 'in_status' ||
        rp.rp_name === 'in_status_key' ||
        rp.rp_name === 'in_status_list' ||
        rp.rp_name === 'in_template_status' ||
        rp.rp_name === 'in_test_user_ids' ||
        rp.rp_name === 'in_issue_hk' ||
        rp.rp_name === 'in_posted_by' ||
        rp.rp_name === 'in_region_id' ||
        rp.rp_name === 'in_item_type' ||
        rp.rp_name === 'in_keys' ||
        rp.rp_name === 'in_processed_by_key' ||
        rp.rp_name === 'in_submitted_by_key' ||
        rp.rp_name === 'in_processed_by_predep_audit' ||
        rp.rp_name === 'in_submitted_by_predep_audit' ||
        rp.rp_name === 'in_processed_by_predep' ||
        rp.rp_name === 'in_shift_id_ddr' ||
        rp.rp_name === 'in_cashier_id_ddr' ||
        rp.rp_name === 'in_submitted_by' ||
        rp.rp_name === 'in_requested_by' ||
        rp.rp_name === 'in_requested_by_rs' ||
        rp.rp_name === 'in_employee_id' ||
        rp.rp_name === 'in_package_submitted_by' ||
        rp.rp_name === 'in_mail_check_submitted_by' ||
        rp.rp_name === 'in_print_all_current' ||
        rp.rp_name === 'in_occupied_by' ||
        rp.rp_name === 'in_completed_by' ||
        rp.rp_name === 'completed_by_req' ||
        rp.rp_name === 'in_hk_items' ||
        rp.rp_name === 'in_pm_template' ||
        rp.rp_name === 'in_pm_type' ||
        rp.rp_name === 'in_pm_result' ||
        rp.rp_name === 'in_pm_item_id' ||
        (rp.rp_name === 'in_staff_member_id' && this.staffMemberList.length>0) ||
        rp.rp_name === 'in_template_ids' ||
        rp.rp_name === 'in_resolution' ||
        rp.rp_name === 'in_area' ||
        rp.rp_name === 'in_issue' ||
        rp.rp_name === 'in_staff_member' ||
        rp.rp_name === 'in_closed_by' ||
        rp.rp_name === 'in_resolved_user' ||
        rp.rp_name === 'in_logged_by' ||
        rp.rp_name === 'in_recorded_by' ||
        rp.rp_name === 'in_submitted_by_rser' ||
        rp.rp_name === 'in_manager_auth' ||
        rp.rp_name === 'in_gsm_auth' ||
        rp.rp_name === 'in_area_id' ||
        rp.rp_name === 'in_logged_by_ath' ||
        rp.rp_name === 'in_prepared_by_srr' ||
        rp.rp_name === 'in_reported_by' ||
        rp.rp_name === 'in_completed_by_wo' ||
        rp.rp_name === 'in_item_type_wo' ||
        rp.rp_name === 'in_author_id' ||
        rp.rp_name === 'in_item_type_treq' ||
        rp.rp_name === 'in_area_his_id' ||
        rp.rp_name === 'in_type_id' || 
        rp.rp_name === 'in_lf_type_id' || 
        rp.rp_name === 'in_user_act_id' ||
        rp.rp_name === 'in_item_wo' ||
        rp.rp_name === 'in_task_origin_id' ||
        rp.rp_name === 'in_quore_company' ||
        rp.rp_name === 'in_sales_property_id' ||
        rp.rp_name === 'in_staff_id' ||
        rp.rp_name === 'in_attendant_id' ||
        rp.rp_name === 'in_supervisor_id' ||
        rp.rp_name === 'in_cleaning_type' ||
        rp.rp_name === 'in_cleanings_attendant_id' ||
        rp.rp_name === 'in_cleanings_area_id' || 
        rp.rp_name === 'in_inspector_id' || 
        rp.rp_name === 'in_cleanings_rm_type_id' || 
        rp.rp_name === 'in_hk_breakout_id' || 
        rp.rp_name === 'in_user_ids' || 
        rp.rp_name === 'in_active_users' || 
        rp.rp_name === 'in_group_ids' || 
        rp.rp_name === 'in_report_ids' || 
        rp.rp_name === 'in_properties_id' || 
        rp.rp_name === 'in_init_mode' || 
        rp.rp_name === 'in_generate_mode' || 
        rp.rp_name === 'in_staff_member_sat' || 
        rp.rp_name === 'cleaning_insp_item' || 
        rp.rp_name === 'cleaning_plus_insp_item' || 
        rp.rp_name === 'insp_result' || 
        rp.rp_name === 'in_ins_template_id' || 
        rp.rp_name === 'in_admin_region' || 
        rp.rp_name === 'in_region_property' || 
        rp.rp_name === 'in_template_id' || 
        rp.rp_name === 'in_item_id' || 
        rp.rp_name === 'in_connect_property_id' || 
        rp.rp_name === 'in_output_format' || 
        rp.rp_name === 'in_page_break' || 
        rp.rp_name === 'in_budget_page_break' || 
        rp.rp_name === 'in_budget_year' || 
        rp.rp_name === 'in_budget_month' || 
        rp.rp_name === 'in_category' || 
        rp.rp_name === 'in_department' || 
        (this.status === "A" && rp.rp_name === 'in_usage_agreement') || 
        (this.status === "C" && rp.rp_name === 'in_usage_company') || 
        (this.status === "O" && rp.rp_name === 'in_usage_ownership') || 
        (this.status === "P" && rp.rp_name === 'in_usage_property') || 
        (this.status !== "P" && rp.rp_name === 'in_agt_ows_co_props') || 
        rp.rp_name === 'in_do_other_pms' || 
        rp.rp_name === 'in_capex_date_range' || 
        rp.rp_name === 'in_capex_ownership_id' || 
        rp.rp_name === 'in_capex_department_id' || 
        rp.rp_name === 'in_capex_property_id' || 
        rp.rp_name === 'in_capex_status_group_id' || 
        rp.rp_name === 'in_capex_status_id' || 
        rp.rp_name === 'in_budget_department' || 
        rp.rp_name === 'in_budget_groups' || 
        (rp.rp_name === 'in_capex_bind_ownership' && this.isDepartmentId) || 
        rp.rp_name === 'in_capex_bind_property' || 
        rp.rp_name === 'in_capex_bind_inflation' || 
        (this.output_format === 'pdf' && rp.rp_name === 'in_pdf_orientation') || 
        rp.rp_name === 'in_vendor' || 
        rp.rp_name === 'in_forecast_date_range' || 
        rp.rp_name === 'in_incl_curr_year'
    },
    getFilterDetails(flag = false, forSche = false) {
      const params = [];
      let details = [];
      let copyFilter = [...this.filters];
      copyFilter.sort((a,b)=>{
        if (a['rp_order_in_header'] === b['rp_order_in_header']) {
          return 0;
        }
        if (
          a['rp_order_in_header'] === undefined ||
          a['rp_order_in_header'] === "" ||
          !a['rp_order_in_header']
        ) {
          return 1;
        }
        if (
          b['rp_order_in_header'] === undefined ||
          b['rp_order_in_header'] === "" ||
          !b['rp_order_in_header']
        ) {
          return -1;
        }
        return a.rp_order_in_header - b.rp_order_in_header
      });
      for (const el of copyFilter) {
        if (!el.rp_hide_on_pdf && el.rp_display) {
          details =  [...this.getFIlterValue(params,el,flag,forSche)]
        }
      }
      if (this.datalist.length>1 && this.sortedCol.length && !this.details.allow_double_table) {
        let arr = [];
        this.sortedCol.forEach(e => {
          arr.push(e.rcol_display+'-'+this.words[e.direction])
        });
        details.push([ this.words.sorted_by + ":", arr.join(' | ')])
      }
      if (this.summaryData.length>1 && this.sortedSecCol.length && this.details.allow_double_table) {
        let arr = [];
        this.sortedSecCol.forEach(e => {
          arr.push(e.rcol_display+'-'+this.words[e.direction])
        });
        details.push([ this.words.first+" "+this.words.table+" "+this.words.sorted_by + ":", arr.join(' | ')])
      }
      if (this.datalist.length>1 && this.sortedCol.length && this.details.allow_double_table) {
        let arr = [];
        this.sortedCol.forEach(e => {
          arr.push(e.rcol_display+'-'+this.words[e.direction])
        });
        details.push([ this.words.second+" "+this.words.table+" "+this.words.sorted_by + ":", arr.join(' | ')])
      }
      return details;
    },
    getFilterSchedule(){
      let info = {
        ...(this.filters.find(el=> el.rp_displaytype === "property_id") !== undefined ? { prop_id: this.props }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_id") !== undefined ? { temp_id: this.template_id }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_id") !== undefined ? { item_id: this.item_id }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_status" || el.rp_name === "in_status_key") !== undefined ? { status: this.status }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_status_list") !== undefined ? { status_key: this.statusDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_type") !== undefined ? { area_type: this.areaCategory }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area") !== undefined ? { in_area: this.in_area }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_issue") !== undefined ? { in_issue: this.in_issue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_resolution") !== undefined ? {  in_resolution: this.in_resolution }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_test_user_ids") !== undefined ? {  test_user_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_issue_hk") !== undefined ? { notice_type: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_posted_by") !== undefined ? {  in_posted_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_region_id") !== undefined ? {  in_region_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_ids") !== undefined ? {  in_template_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_occupied_by") !== undefined ? {  in_occupied_by: this.inOccupied }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_completed_by") !== undefined ? {  in_completed_by: this.completedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "completed_by_req") !== undefined ? {  in_completed_by: this.completedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_id") !== undefined ? {  in_staff_member_id: this.staffMember }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type") !== undefined ? {  in_item_type: this.itemType }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by") !== undefined ? {  in_submitted_by: this.adaComSubmittedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_employee_id") !== undefined ? {  in_employee_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_keys") !== undefined ? {  in_keys: (this.status === 0) ? "all" : this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_package_submitted_by") !== undefined ? {  in_submitted_by: this.GPPSubmittedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_print_all_current") !== undefined ? {  in_print_all: this.printAllCurrent ? 1 : 0 }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_mail_check_submitted_by") !== undefined ? {  in_submitted_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_key") !== undefined ? {  in_processed_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_key") !== undefined ? {  in_submitted_by: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member") !== undefined ? {  in_staff_member: this.staffMember }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_closed_by") !== undefined ? {  in_closed_by: this.issueClosedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep_audit") !== undefined ? {  in_processed_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_predep_audit") !== undefined ? {  in_submitted_by: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_processed_by_predep") !== undefined ? {  in_processed_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_shift_id_ddr") !== undefined ? {  shift_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cashier_id_ddr") !== undefined ? {  cashier_id: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_resolved_user") !== undefined ? {  resolved_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_logged_by") !== undefined ? {  logged_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_recorded_by") !== undefined ? {  recorded_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_submitted_by_rser") !== undefined ? {  submitted_by: this.filterOneDataKey } : {} ),
        ...(this.filters.find(el=> el.rp_name === "in_manager_auth") !== undefined ? {  manager_auth: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_gsm_auth") !== undefined ? {  gsm_auth: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_id") !== undefined ? {  area_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_logged_by_ath") !== undefined ? {  logged_by: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_prepared_by_srr") !== undefined ? {  prepared_by: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_reported_by") !== undefined ? {  in_reported_by: this.reported_by }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_completed_by_wo") !== undefined ? {  in_completed_by: this.staffMember }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type_wo") !== undefined ? {  in_item_type: this.itemType[0] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_author_id") !== undefined ? {  author_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_requested_by") !== undefined ? {  requested_by: this.requestedBy }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_requested_by_rs") !== undefined ? {  requested_by: this.reqByMl }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_hk_items") !== undefined ? {  hk_item: this.hkItem }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_template") !== undefined ? {  in_pm_template: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_type") !== undefined ? {  in_pm_type: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_result") !== undefined ? {  in_pm_result: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_pm_item_id") !== undefined ? {  in_item_id: this.singleKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_type_treq") !== undefined ? {  item_type: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_area_his_id") !== undefined ? {  in_area_id: this.filterOneDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_type_id") !== undefined ? {  type_id: this.typeDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_user_act_id") !== undefined ? {  staff_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_item_wo") !== undefined ? {  item_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_task_origin_id") !== undefined ? {  task_origin_id: this.taskOriginKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_quore_company") !== undefined ? {  quore_company: this.filterOneDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_sales_property_id") !== undefined ? {  prop_id: [this.premiumProps] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_id") !== undefined ? {  sales_staff: this.filterThreeDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_attendant_id") !== undefined ? {  attendant_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_supervisor_id") !== undefined ? {  supervisor_id: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleaning_type") !== undefined ? {  cleaning_type: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_attendant_id") !== undefined ? {  attendant_id: this.filterThreeDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_area_id") !== undefined ? {  area_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_inspector_id") !== undefined ? {  inspector_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_cleanings_rm_type_id") !== undefined ? {  room_type: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_hk_breakout_id") !== undefined ? {  breakout: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_user_ids") !== undefined ? {  user_ids: this.userIds }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_active_users") !== undefined ? {  user_ids: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_group_ids") !== undefined ? {  rep_group_ids: this.filterTwoDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_report_ids") !== undefined ? {  rep_ids: this.filterThreeDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_properties_id") !== undefined ? {  prop_ids: this.propertyIds }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_init_mode") !== undefined ? {  init_mode: this.statusDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_generate_mode") !== undefined ? {  init_mode: this.statusDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "cleaning_insp_item") !== undefined ? {  inspection_item: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "cleaning_plus_insp_item") !== undefined ? {  inspection_item: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "insp_result") !== undefined ? {  inspection_result: this.typeDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_staff_member_sat") !== undefined ? {  staff_member: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_lf_type_id") !== undefined ? {  type_id: this.typeDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_ins_template_id") !== undefined ? {  in_template_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_template_status") !== undefined ? {  tem_status: this.tempStatus }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_admin_region") !== undefined ? {  pm_region_id: this.filterTwoDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_region_property") !== undefined ? {  pm_property_id: this.filterThreeDataValue }:{}),
        ...(this.r_id === 'Ry28Lje0W3' ? {  pm_company_id: this.filterOneDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_connect_property_id") !== undefined ? {  prop_id: [this.premiumProps] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_agreement") !== undefined ? {  agreements: [this.agreementsKey] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_company") !== undefined ? {  company: [this.companiesKey] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_ownership") !== undefined ? {  ownership: [this.ownershipsKey] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_usage_property") !== undefined ? {  property: this.usagePropKey === null ? [this.propertiesKey] : [this.usagePropKey] }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_date_range") !== undefined ? {  date_type: this.typeDataKey }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_department_id") !== undefined ? {  department_id: this.filterTwoDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_do_other_pms") !== undefined ? {  do_other_pms: this.doOtherPms }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_property_id") !== undefined ? {  prop_id: this.filterThreeDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_status_id") !== undefined ? {  status_id: this.filterFourDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_department") !== undefined ? {  dept_id: this.filterOneDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_category") !== undefined ? {  cat_id: this.filterTwoDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_budget_department") !== undefined ? {  department_id: this.filterOneDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_budget_groups") !== undefined ? {  group_id: this.filterTwoDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_capex_bind_property") !== undefined ? {  prop_id: this.filterThreeDataValue }:{}),
        ...(this.filters.find(el=> el.rp_name === "in_vendor") !== undefined ? {  ven_id: this.filterThreeDataValue }:{}),
        company_id: this.company_id,
        agreement: this.agreement_id,
        sorted_by: this.sortedCol,
      };
      return info;
    },
    setPredefinedFilters(data){      
      this.filters.find(el=> el.rp_displaytype === "property_id") !== undefined ? this.props = data['prop_id'] : {}
      this.filters.find(el=> el.rp_name === "in_template_id") !== undefined ? this.template_id=data['temp_id'] : {};
      this.filters.find(el=> el.rp_name === "in_item_id") !== undefined ? this.item_id = data['item_id'] : {};
      this.filters.find(el=> el.rp_name === "in_status" || el.rp_name === "in_status_key") !== undefined ? this.status = data['status']:{};
      this.filters.find(el=> el.rp_name === "in_status_list") !== undefined ? this.statusDataKey = data['status_key'] : {};
      this.filters.find(el=> el.rp_name === "in_area_type") !== undefined ? this.areaCategory = data['area_type'] : {};
      this.filters.find(el=> el.rp_name === "in_area") !== undefined ? this.in_area = data['in_area'] : {};
      this.filters.find(el=> el.rp_name === "in_issue") !== undefined ? this.in_issue = data['in_issue'] : {};
      this.filters.find(el=> el.rp_name === "in_resolution") !== undefined ? this.in_resolution = data['in_resolution'] : {};
      this.filters.find(el=> el.rp_name === "in_test_user_ids") !== undefined ? this.filterOneDataKey = data['test_user_id'] : {};
      this.filters.find(el=> el.rp_name === "in_issue_hk") !== undefined ?  this.filterTwoDataKey = data['notice_type'] : {};
      this.filters.find(el=> el.rp_name === "in_posted_by") !== undefined ?  this.filterOneDataKey = data['in_posted_by']: {};
      this.filters.find(el=> el.rp_name === "in_region_id") !== undefined ? this.filterOneDataKey = data['in_region_id'] : {};
      this.filters.find(el=> el.rp_name === "in_template_ids") !== undefined ?  this.filterOneDataKey = data['in_template_id'] : {};
      this.filters.find(el=> el.rp_name === "in_occupied_by") !== undefined ? this.inOccupied = data['in_occupied_by'] : {};
      this.filters.find(el=> el.rp_name === "in_completed_by") !== undefined ?  this.completedBy = data['in_completed_by'] : {};
      this.filters.find(el=> el.rp_name === "completed_by_req") !== undefined ?  this.completedBy = data['in_completed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_staff_member_id") !== undefined ?  this.staffMember = data['in_staff_member_id'] : {};
      this.filters.find(el=> el.rp_name === "in_item_type") !== undefined ? this.itemType = data['in_item_type'] : {};
      this.filters.find(el=> el.rp_name === "in_submitted_by") !== undefined ? this.adaComSubmittedBy = data['in_submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_employee_id") !== undefined ? this.filterOneDataKey = data['in_employee_id'] : {};
      this.filters.find(el=> el.rp_name === "in_keys") !== undefined ? this.filterOneDataKey = data['in_keys'] : {};
      this.filters.find(el=> el.rp_name === "in_package_submitted_by") !== undefined ? this.GPPSubmittedBy = data['in_submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_print_all_current") !== undefined ? this.printAllCurrent = data['in_print_all'] : {};
      this.filters.find(el=> el.rp_name === "in_mail_check_submitted_by") !== undefined ? this.filterOneDataKey = data['in_submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_processed_by_key") !== undefined ? this.filterOneDataKey = data['in_processed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_submitted_by_key") !== undefined ? this.filterTwoDataKey = data['in_submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_staff_member") !== undefined ? this.staffMember = data['in_staff_member'] : {};
      this.filters.find(el=> el.rp_name === "in_closed_by") !== undefined ?  this.issueClosedBy = data['in_closed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_processed_by_predep_audit") !== undefined ?  this.filterOneDataKey = data['in_processed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_submitted_by_predep_audit") !== undefined ? this.filterTwoDataKey = data['in_submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_processed_by_predep") !== undefined ?  this.filterOneDataKey = data['in_processed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_shift_id_ddr") !== undefined ?  this.filterOneDataKey = data['shift_id'] : {};
      this.filters.find(el=> el.rp_name === "in_cashier_id_ddr") !== undefined ?  this.filterTwoDataKey = data['cashier_id'] : {};
      this.filters.find(el=> el.rp_name === "in_resolved_user") !== undefined ?  this.filterOneDataKey = data['resolved_id'] : {};
      this.filters.find(el=> el.rp_name === "in_logged_by") !== undefined ?  this.filterOneDataKey = data['logged_by'] : {};
      this.filters.find(el=> el.rp_name === "in_recorded_by") !== undefined ?  this.filterOneDataKey =data['recorded_by'] : {};
      this.filters.find(el=> el.rp_name === "in_submitted_by_rser") !== undefined ? this.filterOneDataKey = data['submitted_by'] : {};
      this.filters.find(el=> el.rp_name === "in_manager_auth") !== undefined ? this.filterOneDataKey = data['manager_auth'] : {};
      this.filters.find(el=> el.rp_name === "in_gsm_auth") !== undefined ? this.filterTwoDataKey = data['gsm_auth'] : {};
      this.filters.find(el=> el.rp_name === "in_area_id") !== undefined ?  this.filterOneDataKey = data['area_id']: {};
      this.filters.find(el=> el.rp_name === "in_logged_by_ath") !== undefined ?  this.filterTwoDataKey = data['logged_by']: {};
      this.filters.find(el=> el.rp_name === "in_prepared_by_srr") !== undefined ?  this.filterOneDataKey = data['prepared_by'] : {};
      this.filters.find(el=> el.rp_name === "in_reported_by") !== undefined ? this.reported_by = data['in_reported_by'] : {};
      this.filters.find(el=> el.rp_name === "in_completed_by_wo") !== undefined ?  this.staffMember = data['in_completed_by'] : {};
      this.filters.find(el=> el.rp_name === "in_item_type_wo") !== undefined ? this.itemType[0] = data['in_item_type'] : {};
      this.filters.find(el=> el.rp_name === "in_author_id") !== undefined ? this.filterOneDataKey = data['author_id'] : {};
      this.filters.find(el=> el.rp_name === "in_requested_by") !== undefined ?  this.requestedBy = data['requested_by'] : {};
      this.filters.find(el=> el.rp_name === "in_requested_by_rs") !== undefined ? this.reqByMl = data['requested_by'] : {};
      this.filters.find(el=> el.rp_name === "in_hk_items") !== undefined ? this.hkItem = data['hk_item'] : {};
      this.filters.find(el=> el.rp_name === "in_pm_template") !== undefined ? this.filterOneDataKey = data['in_pm_template'] : {};
      this.filters.find(el=> el.rp_name === "in_pm_type") !== undefined ?  this.filterTwoDataKey = data['in_pm_type'] : {};
      this.filters.find(el=> el.rp_name === "in_pm_result") !== undefined ?  this.filterTwoDataKey = data['in_pm_result'] : {};
      this.filters.find(el=> el.rp_name === "in_pm_item_id") !== undefined ?  this.singleKey = data['in_item_id'] : {};
      this.filters.find(el=> el.rp_name === "in_item_type_treq") !== undefined ?  this.filterOneDataKey = data['item_type'] : {};
      this.filters.find(el=> el.rp_name === "in_area_his_id") !== undefined ? this.filterOneDataValue = data['in_area_id'] : {};
      this.filters.find(el=> el.rp_name === "in_type_id") !== undefined ? this.typeDataKey = data['type_id'] : {};
      this.filters.find(el=> el.rp_name === "in_user_act_id") !== undefined ?  this.filterOneDataKey = data['staff_id']: {};
      this.filters.find(el=> el.rp_name === "in_item_wo") !== undefined ? this.filterOneDataKey = data['item_id'] : {};
      this.filters.find(el=> el.rp_name === "in_task_origin_id") !== undefined ?  this.taskOriginKey  = data['task_origin_id'] : {};
      this.filters.find(el=> el.rp_name === "in_quore_company") !== undefined ?  this.filterOneDataValue = data['quore_company'] : {};
      this.filters.find(el=> el.rp_name === "in_sales_property_id") !== undefined ?  this.premiumProps  = data['prop_id']: {};
      this.filters.find(el=> el.rp_name === "in_staff_id") !== undefined ?  this.filterThreeDataValue  = data['sales_staff'] : {};
      this.filters.find(el=> el.rp_name === "in_attendant_id") !== undefined ?  this.filterOneDataKey = data['attendant_id'] : {};
      this.filters.find(el=> el.rp_name === "in_supervisor_id") !== undefined ?  this.filterTwoDataKey = data['supervisor_id'] : {};
      this.filters.find(el=> el.rp_name === "in_cleaning_type") !== undefined ?  this.filterTwoDataKey = data['cleaning_type'] : {};
      this.filters.find(el=> el.rp_name === "in_cleanings_attendant_id") !== undefined ?  this.filterThreeDataValue  = data['attendant_id'] : {};
      this.filters.find(el=> el.rp_name === "in_cleanings_area_id") !== undefined ? this.filterOneDataKey = data['area_id'] : {};
      this.filters.find(el=> el.rp_name === "in_inspector_id") !== undefined ? this.filterOneDataKey = data['inspector_id'] : {};
      this.filters.find(el=> el.rp_name === "in_cleanings_rm_type_id") !== undefined ? this.filterTwoDataKey = data['room_type'] : {};
      this.filters.find(el=> el.rp_name === "in_hk_breakout_id") !== undefined ? this.filterOneDataKey = data['breakout'] : {};
      this.filters.find(el=> el.rp_name === "in_user_ids") !== undefined ? this.userIds = data['user_ids'] : {};
      this.filters.find(el=> el.rp_name === "in_active_users") !== undefined ? this.userIds = data['user_ids'] : {};
      this.filters.find(el=> el.rp_name === "in_group_ids") !== undefined ? this.filterTwoDataKey = data['rep_group_ids'] : {};
      this.filters.find(el=> el.rp_name === "in_staff_member_sat") !== undefined ?  this.filterOneDataKey = data['staff_member'] : {};
      this.filters.find(el=> el.rp_name === "in_lf_type_id") !== undefined ? this.typeDataKey = data['type_id'] : {};
      this.filters.find(el=> el.rp_name === "in_ins_template_id") !== undefined ?  this.filterOneDataKey = data['in_template_id'] : {};
      this.filters.find(el=> el.rp_name === "in_template_status") !== undefined ? this.tempStatus = ['tem_status'] : {};
      this.filters.find(el=> el.rp_name === "in_connect_property_id") !== undefined ?  this.premiumProps  = data['prop_id']: {};
      this.filters.find(el=> el.rp_name === "in_do_other_pms") !== undefined ? this.doOtherPms = data['in_do_other_pms'] : {};
      this.filters.find(el=> el.rp_name === "in_usage_agreement") !== undefined ?  this.agreementsKey = data['in_usage_agreement'] : {};
      this.filters.find(el=> el.rp_name === "in_usage_company") !== undefined ?  this.companiesKey = data['in_usage_company'] : {};
      this.filters.find(el=> el.rp_name === "in_usage_ownership") !== undefined ?  this.ownershipsKey = data['in_usage_ownership'] : {};
      this.filters.find(el=> el.rp_name === "in_usage_property") !== undefined ? (this.usagePropKey === '' ? this.propertiesKey = data['in_usage_property'] : this.usagePropKey = data['in_agt_ows_co_props']) : {};
      this.filters.find(el=> el.rp_name === "in_capex_date_range") !== undefined ? this.typeDataKey = data['date_type'] : {};
      this.filters.find(el=> el.rp_name === "in_capex_department_id") !== undefined ? this.filterTwoDataValue = data['department_id'] : {};
      this.filters.find(el=> el.rp_name === "in_capex_property_id") !== undefined ?  this.filterThreeDataValue = data['prop_id'] : {};
      this.filters.find(el=> el.rp_name === "in_capex_status_id") !== undefined ?  this.filterFourDataValue = data['status_id'] : {};
      this.filters.find(el=> el.rp_name === "in_budget_department") !== undefined ? this.filterOneDataValue = data['department_id'] : {};
      this.filters.find(el=> el.rp_name === "in_budget_groups") !== undefined ? this.filterTwoDataValue = data['group_id'] : {};
      this.filters.find(el=> el.rp_name === "in_capex_bind_property") !== undefined ? this.filterThreeDataValue = data['prop_id'] : {}
      this.propKey++;
      this.flag++;
      this.flagOne++;
      this.flagTwo++;
      this.flagThree++;
      this.statusKey++;
    },
    async getStatusList(){
      this.statusDataKey = [];
      
      const {data:{data}} = await axios.get('/get-status-list?r_id='+this.r_id);
      this.statusData = data;

      this.flag++;
      this.statusKey++;
      this.status = this.filters.find(el=> ((el.rp_name === "in_status" || el.rp_name === "in_status_key") && el.rp_allowselectall)) !== undefined ? "all" : this.r_id === 'AdminUsgRe' ? "A" : this.r_id === 'capExRep01' ? 0 : null;
      
      if (data.length > 1) {
        this.statusDataKey=['all']
      }

      const list = data.map(el=>{
        return {id: el.value, label: el.name}
      });

      this.statusDataList = this.filteredData(list);
    },
    getFIlterValue(params,el, flag, forSche = false){
      if (el.rp_name === "in_property_id" && (this.props.toString() === "all" || !forSche) ) {
        params.push([
          el.rp_display + ":",this.props.toString() === "all"
          ? this.words['all']
          : this.getNames(this.props, this.propList).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : ''
        ]);
      }
      if ((el.rp_name === "in_connect_property_id" || el.rp_name === "in_sales_property_id") && (this.premiumProps === "all" || !forSche) ) {
        params.push([
          el.rp_display + ":",this.premiumProps === "all"
          ? this.words['all']
          : this.getNames(this.premiumProps, this.premiumPropsList).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : ''
        ]);
      }
      if (el.rp_name === "in_status" || el.rp_name === "in_status_key") {
        if (this.statusData.find((e) => e.value === this.status)?.name === this.words.all_guests) {
          params.push([
            el.rp_display + ":",
            this.status === "all"
            ? this.words.all_guests :
            '',
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
          ]);
        } else {
          params.push([
            el.rp_display + ":",
            this.status === "all"
            ? this.words.all :
            this.statusData.find((e) => e.id === this.status).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
          ]);
        }
      }
      if (el.rp_name === "in_do_other_pms") {
        params.push([
          el.rp_display + ":",
          this.doOtherPms === true
          ? this.words.yes : this.words.no,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_capex_bind_inflation") {
        params.push([
          el.rp_display + ":",
          this.inflationRate,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_forecast_date_range") {
        params.push([
          el.rp_display + ":",
          this.capexDateRangeList.find((e) => (e.id).toString() === this.capexDateRange.toString()).label,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_incl_curr_year") {
        params.push([
          el.rp_display + ":",
          this.inclCurrYear === true
          ? this.words.yes : this.words.no,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_usage_agreement" && (this.agreementsKey !== null && this.agreementsKey !== undefined)) {
        params.push([
          el.rp_display + ":",
          this.agreementsKey === "all" 
          ? this.words.all : 
          this.getNames(this.agreementsKey, this.agreements).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_usage_ownership" && (this.ownershipsKey !== null && this.ownershipsKey !== undefined)) {
        params.push([
          el.rp_display + ":",
          this.ownershipsKey === "all" 
          ? this.words.all : 
          this.getNames(this.ownershipsKey, this.ownerships).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_usage_company" && (this.companiesKey !== null && this.companiesKey !== undefined)) {
        params.push([
          el.rp_display + ":",
          this.companiesKey === "all" 
          ? this.words.all : 
          this.getNames(this.companiesKey, this.companies).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_usage_property" && (this.propertiesKey !== null && this.propertiesKey !== undefined)) {
        params.push([
          el.rp_display + ":",
          this.propertiesKey === "all" 
          ? this.words.all : 
          this.getNames(this.propertiesKey, this.properties).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_agt_ows_co_props" && (this.usagePropKey !== null && this.usagePropKey !== undefined)) {
        params.push([
          el.rp_display + ":",
          this.usagePropKey === "all" 
          ? this.words.all : 
          this.getNames(this.usagePropKey, this.usageProp).toString(),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_status_list" ||
        el.rp_name === "in_init_mode" ||
        el.rp_name === "in_generate_mode"
      ) {
        params.push([
          el.rp_display + ":",
          this.statusDataKey === "all"
            ? this.words['all']
            : this.getNames(this.statusDataKey, this.statusDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_template_status") {
        params.push([
          el.rp_display + ":",
          this.tempStatusData.find((e) => e.id === this.tempStatus).label,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_area" || el.rp_name === "in_area_dummy") {
        params.push([
          el.rp_display + ":",
          this.in_area === "all"
            ? this.words['all']
            : this.getNames(this.in_area,this.areaList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_resolution") {
        params.push([
          el.rp_display + ":",
          this.in_resolution === "all"
            ? this.words['all']
            : this.getNames(this.in_resolution,this.resolutionList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_issue") {
        params.push([
          el.rp_display + ":",
          this.in_issue === "all"
            ? this.words['all']
            : this.getNames(this.in_issue,this.issueList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_template_id") {
        params.push([
          el.rp_display + ":",
          this.template_id === "all"
            ? this.words['all']
            : this.templates.find((e) => e.id === this.template_id).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_area_type") {
        params.push([
          el.rp_display + ":",
          this.areaCategory.toString() === "all"
            ? this.words.all
            : this.getNames(this.areaCategory,this.areaTypeList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_item_id") {
        params.push([
          el.rp_display + ":",
          this.item_id.toString() === "all"
            ? this.words['all']
            : this.getNames(this.item_id, this.items).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_item") {
        params.push([
          el.rp_display + ":",
          this.item_id === "all"
            ? this.words['all']
            : '',
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_completed_by" || el.rp_name === 'completed_by_req') {
        params.push([
          el.rp_display + ":",
          this.completedBy.toString() === "all"
            ? this.words.all
            : this.getNames(this.completedBy,this.completedByList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_hk_items") {
        params.push([
          el.rp_display + ":",
          this.hkItem.toString() === "all"
            ? this.words.all
            : this.getNames(this.hkItem,this.hkItemList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_occupied_by") {
        params.push([
          el.rp_display + ":",
          this.inOccupied === "all"
            ? this.words.all
            : this.occupiedByList.find((e) => e.id === this.inOccupied).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_staff_member_id" || el.rp_name === "in_staff_member") {
        params.push([
          el.rp_display + ":",
          this.staffMember.toString() === "all"
            ? this.words['all']
            : this.getNames(this.staffMember, this.staffMemberList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_closed_by" ) {
        params.push([
          el.rp_display + ":",
          this.issueClosedBy.toString() === "all"
            ? this.words['all']
            : this.issueClosedByList.find((e) => e.id === this.issueClosedBy).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === 'in_item_type_wo' ) {
        params.push([
          el.rp_display + ":",
          this.itemType.toString() === "all"
            ? this.words['all']
            : this.itemTypeList.find((e) => e.id === this.itemType[0]).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === 'in_reported_by' ) {
        params.push([
          el.rp_display + ":",
          this.reported_by.toString() === "all"
            ? this.words['all']
            : this.reportedByList.find((e) => e.id === this.reported_by).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === 'in_completed_by_wo' ) {
        params.push([
          el.rp_display + ":",
          this.staffMember === "all"
            ? this.words['all']
            : this.staffMemberList.find((e) => e.id === this.staffMember)?.label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === 'in_requested_by' ) {
        params.push([
          el.rp_display + ":",
          this.requestedBy === "all"
            ? this.words['all']
            : this.requestedByList.find((e) => e.id === this.requestedBy).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === 'in_pm_item_id' ) {
        params.push([
          el.rp_display + ":",
          this.singleKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.singleKey,this.filterThreeDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_item_type") {
        params.push([
          el.rp_display + ":",
          this.itemType.toString() === "all"
            ? this.words.all
            : this.getNames(this.itemType,this.itemTypeList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_requested_by_rs") {
        params.push([
          el.rp_display + ":",
          this.reqByMl.toString() === "all"
            ? this.words.all
            : this.getNames(this.reqByMl,this.requestedByList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_total_pkg_received" && !forSche) {
        params.push([
          el.rp_display + ":",
          this.getTotalCount('qty','status',['received','picked-received']),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : ''
        ]);
      }
      if (el.rp_name === "in_total_pkg_picked_up" && !forSche) {
        params.push([
          el.rp_display + ":",
          this.getTotalCount('qty','status',['pickup','picked-received']),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : ''
        ]);
      }
      if (el.rp_name === "in_submitted_by") {
        params.push([
          el.rp_display + ":",
          this.adaComSubmittedBy.toString() === "all"
            ? this.words['all']
            : this.getNames(this.adaComSubmittedBy, this.adaComSubmittedByData).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_package_submitted_by") {
        params.push([
          el.rp_display + ":",
          this.GPPSubmittedBy.toString() === "all"
            ? this.words['all']
            : this.getNames(this.GPPSubmittedBy, this.GPPSubmittedByList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_user_ids" ) {
        params.push([
          el.rp_display + ":", this.getSelectedNames(this.userIds,'label'),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_properties_id") {
        params.push([
          el.rp_display + ":", 
          this.propertyIds.toString() === "all"
            ? this.words['all'] : this.getNames(this.propertyIds, this.propertyList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_type_id" ||
        el.rp_name === "insp_result" || 
        el.rp_name === "in_lf_type_id" || 
        el.rp_name === "in_capex_date_range"
      ) {
        params.push([
          el.rp_display + ":",
          this.typeDataKey.toString() === "all"
            ? this.words['all']
            : this.typeDataList.find((e) => (e.id).toString() === this.typeDataKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_task_origin_id") {
        params.push([
          el.rp_display + ":",
          this.taskOriginKey.toString() === "all"
            ? this.words['all']
            : this.taskOriginList.find((e) => (e.id).toString() === this.taskOriginKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_test_user_ids" || 
        el.rp_name === "in_submitted_by_rser" || 
        el.rp_name === "in_inspector_id"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataKey.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_region_id" || 
        el.rp_name === "in_item_wo" || 
        el.rp_name === "in_cleanings_area_id" || 
        el.rp_name === "in_hk_breakout_id"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataKey.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_cleanings_rm_type_id") {
        params.push([
          el.rp_display + ":",
          this.filterTwoDataKey.toString() === "all"
            ? this.words['all']
            : this.filterTwoDataList.find((e) => (e.id).toString() === this.filterTwoDataKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_pm_type" || 
        el.rp_name === "in_issue_hk"|| 
        el.rp_name === "in_pm_result"|| 
        el.rp_name === "in_cleaning_type"|| 
        el.rp_name === "in_group_ids"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterTwoDataKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.filterTwoDataKey, this.filterTwoDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_employee_id" || 
        el.rp_name === "in_processed_by_key" || 
        el.rp_name === "in_mail_check_submitted_by" || 
        el.rp_name === "in_processed_by_predep_audit" || 
        el.rp_name === "in_processed_by_predep" || 
        el.rp_name === "in_logged_by" || 
        el.rp_name === "in_recorded_by" || 
        el.rp_name === "in_resolved_user" || 
        el.rp_name === "in_manager_auth" || 
        el.rp_name === "in_prepared_by_srr" || 
        el.rp_name === "in_author_id" ||  
        el.rp_name === "in_posted_by" || 
        el.rp_name === "in_user_act_id" || 
        el.rp_name === "in_attendant_id" || 
        el.rp_name === "in_staff_member_sat" || 
        el.rp_name === "cleaning_insp_item" || 
        el.rp_name === "cleaning_plus_insp_item" || 
        el.rp_name === "in_active_users"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.filterOneDataKey, this.filterOneDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_cashier_id_ddr" || 
        el.rp_name === "in_submitted_by_key" || 
        el.rp_name === "in_submitted_by_predep_audit" || 
        el.rp_name === "in_gsm_auth" ||
        el.rp_name === "in_logged_by_ath" || 
        el.rp_name === "in_supervisor_id"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterTwoDataKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.filterTwoDataKey, this.filterTwoDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_keys") {
        params.push([
          el.rp_display + ":",
          this.filterOneDataKey.toString() === "all"
            ? this.words['all']
            : this.filterOneDataKey.toString() === "" ? this.words['all']
            : (this.filterOneDataKey.toString() !== "" && this.status === 0) ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (
        el.rp_name === "in_shift_id_ddr" ||
        el.rp_name === "in_area_id" || 
        el.rp_name === "in_pm_template" ||
        (el.rp_name === "in_template_ids" && el.rp_allowmultipleselect) || 
        el.rp_name === "in_item_type_treq" || 
        el.rp_name === "in_ins_template_id"
      ) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.filterOneDataKey, this.filterOneDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_template_ids" && !el.rp_allowmultipleselect) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataList[0].children.find(el=>el.id === this.filterOneDataValue)?.label,
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_completed_start" && !forSche) {
        params.push([
          el.rp_display + ":",
          this.from_dummy !== null ?
          moment(this.from_dummy).format("MM-DD-YYYY") : 'Not Available',
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : ''
        ]);
      }
      if (el.rp_name === "in_completed_end" && !forSche) {
        params.push([el.rp_display + ":",
          this.to_dummy === 'today' ? 'Today' : moment(this.to_dummy).format("MM-DD-YYYY"),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : ''
        ]);
      }
      if ((el.rp_name === "in_posted_start" || el.rp_name === "in_posted_start_rdg") && !forSche) {
        if (this.r_id === 'Hf7KV5zbzp' && this.status === 0) {
          // do nothing
        } else if(this.from_date !== 'dummy') {
          params.push([
            el.rp_display + ":",
            moment(this.from_dummy !== "" ? this.from_dummy : this.from_date).format("MM-DD-YYYY"),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : ''
          ]);
        }
      }
      if ((el.rp_name === "in_posted_end" || el.rp_name === "in_posted_end_rdg") && !forSche) {
        if (this.r_id === 'Hf7KV5zbzp' && this.status === 0) {
          // do nothing
        } else if(this.to_date !== 'dummy')  {
          params.push([el.rp_display + ":", 
          this.to_dummy === 'today' ? this.words['today'] : moment(this.to_dummy !== "" ? this.to_dummy : this.to_date).format("MM-DD-YYYY"),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : '']);
        }
      }
      if ((el.rp_name === "in_start_date" || el.rp_name === "in_start_date_req" || el.rp_name === "in_pace_start_date" || el.rp_name === "from_date_insp"|| el.rp_name === "from_date_clplus"  || el.rp_name=="in_start_date_wo") && !forSche) {
        params.push([
          el.rp_display + ":",
          moment(this.from_dummy).format("MM-DD-YYYY"),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : ''
        ]);
      }
      if (el.rp_name === "in_date" && !forSche) {
        params.push([
          el.rp_display + ":",
          moment(this.from_dummy).format("MM-DD-YYYY"),
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : ''
        ]);
      }
      if (el.rp_name === "in_company_id") {
        params.push([el.rp_display + ":", this.company_name,
        flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : '']);
      }
      if (el.rp_name === "in_quore_company" || el.rp_name === "in_area_his_id" || el.rp_name === "in_capex_ownership_id") {
        params.push([
          el.rp_display + ":",
          this.filterOneDataValue.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : ''
        ]);
      }
      if (el.rp_name === 'in_capex_bind_ownership' && this.isDepartmentId) {
        params.push([
          el.rp_display + ":",
          this.filterOneDataValue.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : ''
        ]);
      }
      if (el.rp_name === "in_department") {
        params.push([
          el.rp_display + ":",
          this.filterOneDataValue.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_category") {
        params.push([
          el.rp_display + ":",
          this.filterTwoDataValue.toString() === "all"
            ? this.words['all']
            : this.filterTwoDataList.find((e) => (e.id).toString() === this.filterTwoDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_vendor") {
        params.push([
          el.rp_display + ":",
          this.filterThreeDataValue.toString() === "all"
            ? this.words['all']
            : this.filterThreeDataList.find((e) => (e.id).toString() === this.filterThreeDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_budget_department") {
        params.push([
          el.rp_display + ":",
          this.filterOneDataValue.toString() === "all"
            ? this.words['all']
            : this.filterOneDataList.find((e) => (e.id).toString() === this.filterOneDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_capex_department_id" || el.rp_name === "in_budget_groups") {
        params.push([
          el.rp_display + ":",
          this.filterTwoDataValue.toString() === "all"
            ? this.words['all']
            : this.filterTwoDataList.find((e) => (e.id).toString() === this.filterTwoDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_capex_property_id" || el.rp_name === "in_capex_bind_property") {
        params.push([
          el.rp_display + ":",
          this.filterThreeDataValue.toString() === "all"
            ? this.words['all']
            : this.filterThreeDataList.find((e) => (e.id).toString() === this.filterThreeDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/prop.png" : ''
        ]);
      }
      if (el.rp_name === "in_capex_status_group_id") {
        params.push([
          el.rp_display + ":",
          this.statusGroupKey.toString() === "all"
            ? this.words['all']
            : this.statusGroupList.find((e) => (e.id).toString() === this.statusGroupKey.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_capex_status_id") {
        params.push([
          el.rp_display + ":",
          this.filterFourDataValue.toString() === "all"
            ? this.words['all']
            : this.filterFourDataList.find((e) => (e.id).toString() === this.filterFourDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_staff_id" || el.rp_name === "in_cleanings_attendant_id") {
        params.push([
          el.rp_display + ":",
          this.filterThreeDataValue.toString() === "all"
            ? this.words['all']
            : this.filterThreeDataList.find((e) => (e.id).toString() === this.filterThreeDataValue.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_report_ids") {
        params.push([
          el.rp_display + ":",
          this.filterThreeDataKey.toString() === "all"
            ? this.words['all']
            : this.getNames(this.filterThreeDataKey, this.filterThreeDataList).toString(),
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_budget_year") {
        params.push([
          el.rp_display + ":",
          this.budgetYear.toString() === "all"
            ? this.words['all']
            : (this.r_id === 'capExRep05' ? this.budgetSettingYears 
            : this.r_id === 'capExRep06' ? this.checkbookTxnYears 
            : this.lastTenYears).find((e) => (e.id).toString() === this.budgetYear.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_budget_month") {
        params.push([
          el.rp_display + ":",
          this.budgetMonth.toString() === "all"
            ? this.words['all']
            : this.budgetMonthList.find((e) => (e.id).toString() === this.budgetMonth.toString()).label,
            flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/filter.png" : ''
        ]);
      }
      if (el.rp_name === "in_unreturned" && !forSche) {
        let count = 0
        for (const el of this.datalist) {
          if (el.time_in === '') {
            count++
          }
        }
        params.push([this.words['total_unreturned_key']+":", count, 
        flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : '']);
      }
      if (el.rp_name === "in_total_amount"  && !forSche ) {
        let count = 0
        for (const el of this.datalist) {
          if (el.check_amt) {
            let amt = el.check_amt;
            amt = parseFloat(amt.split(',').join(''));
            count += amt;
          }
        }
        params.push([`${this.words['tot_amount']} :`, count.toFixed(2), 
        flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : '']);
      }
      if (
        ((el.rp_name === "in_total_pre_dep") || 
        (el.rp_name === "in_total_wake_up_calls") || 
        (el.rp_name === "in_total_log_book")) && !forSche
      ) {
        params.push([
          el.rp_display + ":", this.datalist.length, 
          flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : ''
        ]);
      }
      if (el.rp_name === "in_total_ser_issue" && !forSche) {
        let count = 0
        for (const el of this.datalist) {
          if (el.service_issue_notes !== "") {
            count++;
          }
        }
        params.push([ el.rp_display + ":", count, 
        flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/total.png" : '']);
      }
      
      if ((el.rp_name === "in_end_date" || el.rp_name === "in_end_date_req" || el.rp_name === "in_pace_end_date" || el.rp_name === "to_date_insp" || el.rp_name === "to_date_clplus" || el.rp_name=="in_end_date_wo") && !forSche) {
        
        params.push([el.rp_display + ":", this.to_dummy === 'today' ? this.words['today'] : moment(this.to_dummy).format("MM-DD-YYYY"), flag ? process.env.VUE_APP_PUBLIC_PATH + "/images/date.png" : '']);
      }
      return params;
    }
  }
}