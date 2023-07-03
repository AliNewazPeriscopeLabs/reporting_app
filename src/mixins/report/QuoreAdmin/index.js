import axios from "axios";
import toaster from '@/utils/toaster';
const { toastr } = toaster;

export default {
  data() {
    return {
      preservedUsers:[],
      userIds:[],
      propertyIds:[],
      propertyList:[],
      callback:null,
      getPropertyOnSearch: null,
      dummyText:'No Data Found',
      setAsync: false,
      searchProp: false,
      propQuery: '',
      doOtherPms: true,
      agreements: [],
      agreementsKey: null,
      companies: [],
      companiesKey: null,
      ownerships: [],
      ownershipsKey: null,
      properties: [],
      propertiesKey: null,
      usageProp: [],
      usagePropKey: null,
      usageFlag: false
    }
  },
  watch:{
    'userIds': async function(x){
      if (x.length>0) {
        this.formLoader = true;
        await this.getPropertyList()
        this.filterOneDataList = [...x];
        this.formLoader = false;

      } else {
        this.filterOneDataList = [...this.preservedUsers];
        this.propertyList = [];
        this.propertyIds = [];
        this.flagId++;
      }
    }
  },
  methods:{
    checkQuery(searchQuery){
      this.filterOneDataList = [];
      if (searchQuery && searchQuery.length>1) {
        this.setAsync=true  
      }

      this.searchQuery = searchQuery
      this.getUserOnSearch();
    },
    async getOptionsList(query){
      if (query === 'all') {
        this.searchQuery = query
      }
      if (this.searchQuery && this.searchQuery.length>1) {
        const {
          data: { data },
        } = await axios.get(`/get-unsubscripted-user-list-by-query?query=${this.searchQuery}&${query === 'all'? 'get=all' : 'get='}`);
        this.filterOneDataList = data;
        if (query === 'all') {
          this.preservedUsers=data
        }
        this.setAsync=false
      } else {
        if (this.userIds.length>0) {
          this.filterOneDataList = [...this.userIds];
        } else {
          this.filterOneDataList = [...this.preservedUsers];
        }
        this.setAsync=false  
      }
    },
    async getActiveUsersList(){
      const {
        data: { data },
      } = await axios.get("/get-recent-active-users-list");

      this.flag++;
      if (data.length > 1) {
        this.filterOneDataKey=['all']
      }

      this.filterOneDataList = this.filteredData(data);
      await this.getPropertyList()
    },
    checkPropName(searchQuery){
      this.propertyList = [];
      if (searchQuery && searchQuery.length>1) {
        this.searchProp=true  
      }

      this.propQuery = searchQuery
      this.getPropertyOnSearch();
    },
    async getPropertyList(){
      if (!this.userIds.length && this.r_id !== 'tP3LPje7D9') {
        return;
      }
      
      const {
        data: { data },
      } = await axios.post(`/get-property-list-by-query`,{
        user_ids: this.r_id === 'tP3LPje7D9' ? (this.filterOneDataKey.toString() === 'all' ? this.filterOneDataList[0].children.map(e=>e.id) : this.filterOneDataKey) : 
        (this.userIds.toString() === 'all' ? this.filterOneDataList[0].children.map(e=>e.id) : this.userIds.map(e=>e.id))
      });
      if (data.length >1) {
        this.propertyIds=['all'];
      } else if (data.length === 1) {
        this.propertyIds=[data[0].id];
      } else {
        this.propertyIds=[];
      }
      this.propertyList = this.filteredData(data);
      this.flagId++;
    },
    async getQuoreCompanyList() {
      this.loaderOperate(true);
      this.filterOneDataKey = [];

      const {
        data: { data },
      } = await axios.post("/get-quore-company-list", {in_foo: 0});

      if (data.length > 1) {
        this.filterOneDataKey = ['']
      } else if (data.length === 1) {
        this.filterOneDataKey[0] = data[0].id
      } else {
        this.filterOneDataKey = ['']
      }

      this.filterOneDataList = data;
      this.loaderOperate();
    },
    async getReportGroupsList() {
      const {
        data: { data },
      } = await axios.get("/get-category-list");

      this.flagTwo++;
      if (data.length > 1) {
        this.filterTwoDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterTwoDataList = this.filteredData(list);
    },
    async getPropertyByRegion() {
      this.filterThreeDataList =  [{ id: 'all',label: this.words['all'] }];

      const {
        data: { data },
      } = await axios.post("/get-property-by-region-report",{ 
        reg_id: this.filterTwoDataValue.toString(),
        com_id: this.filterOneDataValue.toString(),
      });

      this.flagTwo++;
      this.filterThreeDataList = data.map(e=>{
        return{
          label:e.name,
          id: e.id
        }
      });
      if (data.length > 1) {
        this.filterThreeDataValue='all';
      } else if(data.length === 1) {
        this.filterThreeDataValue = data[0].id
      } else {
        this.filterThreeDataValue = 'all'
        this.filterThreeDataList = [{ id: 'all',label: this.words['all'] }];
      }
      this.statusKey++;
    },
    async getReportsByGroup() {
      this.filterThreeDataKey = [];
      const {
        data: { data }
      } = await axios.get(`/get-report-list-by-category?rep_group=${this.filterTwoDataKey.toString()}`);

      this.flagThree++;

      if (data.length === 1) {
        this.filterThreeDataKey[0] = data[0].id;
      }
      if (data.length > 1) {
        this.filterThreeDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.id, label: el.name}
      });

      this.filterThreeDataList = this.filteredData(list);
    },
    async getInitModeGroup() {

      this.statusDataKey = [];
      const {
        data: { data },
      } = await axios.get(`/get-init-mode-list`);

      this.flagThree++;

      if (data.length === 1) {
        this.statusDataKey[0] = data[0].value;
      }
      if (data.length > 1) {
        this.statusDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.value, label: el.name}
      });

      this.statusDataList = this.filteredData(list);
    },
    async getGenerateModeGroup() {

      this.statusDataKey = [];
      const {
        data: { data },
      } = await axios.get(`/get-generate-mode-list`);

      this.flagThree++;

      if (data.length === 1) {
        this.statusDataKey[0] = data[0].value;
      }
      if (data.length > 1) {
        this.statusDataKey=['all']
      }
      
      const list = data.map(el=>{
        return {id: el.value, label: el.name}
      });

      this.statusDataList = this.filteredData(list);
    },
    async getUsageDependent (status) {
      this.usageFlag === false ? this.loaderOperate(true) : '';
      this.companies = [];
      this.companiesKey = null;
      this.agreements = [];
      this.agreementsKey = null;
      this.ownerships = [];
      this.ownershipsKey = null;
      this.properties = [];
      this.propertiesKey = null;
      this.usageProp = [];
      this.usagePropKey = null;
      if (status === "A") {
        await axios.get('/get-agreements').then((response) => {
          if ((response?.data?.data).length > 0) {
            const list = (response.data.data).map(el=>{
              return {id: el.id, label: el.name}
            });
            this.agreements = this.filteredData(list);
            this.agreementsKey = 11;
            this.usgFlagOne++;
          } else {
            this.agreements = [];
            this.agreementsKey = null;
          }
        })
      } else if (status === "C") {
        await axios.get('/get-companies').then((response) => {
          if ((response?.data?.data).length > 0) {
            const list = (response.data.data).map(el=>{
              return {id: el.id, label: el.name}
            });
            this.companies = this.filteredData(list);
            this.companiesKey = list[0].id;
            this.usgFlagTwo++;
          } else {
            this.companies = [];
            this.companiesKey = null;
          }
        })
      } else if (status === "O") {
        await axios.get('/get-ownerships').then((response) => {
          if ((response?.data?.data).length > 0) {
            const list = (response.data.data).map(el=>{
              return {id: el.id, label: el.name}
            });
            this.ownerships = this.filteredData(list);
            this.ownershipsKey = list[0].id;
            this.usgFlagThree++;
          } else {
            this.ownerships = [];
            this.ownershipsKey = null;
          }
        })
      } else if (status === "P") {
        await axios.get('/get-properties').then((response) => {
          if ((response?.data?.data).length > 0) {
            const list = (response.data.data).map(el=>{
              return {id: el.id, label: el.name}
            });
            this.properties = this.filteredData(list);
            if (list.length === 1) {
              this.propertiesKey = list[0].id;
            } else if (list.length > 1) {
              this.propertiesKey = 'all';
            } else {
              this.propertiesKey = null;
            }
            this.usgFlagFive++;
          } else {
            this.properties = [];
            this.propertiesKey = null;
          }
        })
        this.loaderOperate();
        this.usageFlag = true;
        this.formLoader = false;
      } else {
        this.loaderOperate();
        this.usageFlag = true;
        this.formLoader = false;
      }
      this.usgFlagFour++;
    },
    async getUsageProperties (rp_name, id) {
      let key;
      if (rp_name === 'in_usage_agreement') {
        key = 'agreement_id';
      } else if (rp_name === 'in_usage_ownership') {
        key = 'ownership_id';
      } else {
        key = 'company_id';
      }
      if (id !== '') {
        await axios.get('/get-properties', {
          params: {
            key: key,
            id: id
          }
        }).then((response) => {
          this.usageProp = [];
          this.usagePropKey = null;
          if ((response?.data?.data).length > 0) {
            const list = (response.data.data).map(el=>{
              return {id: el.id, label: el.name}
            });
            this.usageProp = this.filteredData(list);
            if (list.length === 1) {
              this.usagePropKey = list[0].id;
            } else if (list.length > 1) {
              this.usagePropKey = 'all';
            } else {
              this.usagePropKey = null;
            }
            this.usgFlagFour++;
          } else {
            this.usageProp = [];
            this.usagePropKey = null;
            toastr.error('Property not found!');
          }
        })
      } else {
        this.usageProp = [];
        this.usagePropKey = null;
      }
      this.loaderOperate()
      this.usageFlag = true;
      this.formLoader = false;
    },
  },
  
}