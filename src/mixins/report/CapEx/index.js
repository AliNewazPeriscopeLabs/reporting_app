import axios from "axios";
import moment from "moment";
import EndPoints from "../../../utils/endpoint";

// Capex report state
export default {
    watch: {
        output_format: function(x){
            if (x==='xlsx') {
                this.need_page_break = false    
            }
        },
        budgetYear: function(x){
            if (x !== null) {
                this.budgetMonth = 'all';
                this.flagFive++;
            }
        }
    },
    computed: {
        budgetMonthList(){
            if (!this.budgetYear) {
                return [];
            }
            const month = [
                {
                    label: this.words["January"],
                    id: 1
                    
                },
                {
                    label: this.words["February"],
                    id: 2
                },
                {
                    label:this.words[ "March"],
                    id: 3

                },
                {
                    label: this.words["April"],
                    id: 4

                },{
                    label: this.words["May"],
                    id: 5
                },
                {
                    label: this.words["June"],
                    id: 6
                },
                {
                    label: this.words["July"],
                    id: 7
                },
                {
                    label: this.words["August"],
                    id: 8
                },
                {
                    label: this.words["September"],
                    id: 9
                },
                {
                    label: this.words["October"],
                    id: 10
                },
                {
                    label: this.words["November"],
                    id: 11
                },
                {
                    label: this.words["December"],
                    id: 12
                }
            ];
            
            if (this.budgetYear === new Date().getFullYear() && (this.r_id !== 'capExRep05' && this.r_id !== 'capExRep06')) {
                const monthId = new Date().getMonth()+1;
                return month.filter(e=>e.id <= monthId);
            } else {
                return month;
            }
        }
    },
    data() {
        const self = this;
        return {
            output_format: 'xlsx',
            need_page_break: false,
            lastTenYears: self.getYears(11),
            budgetSettingYears: self.getBudgetYears(1),
            checkbookTxnYears: self.getTxnYears(10, 20),
            budgetYear: new Date().getFullYear(),
            budgetMonth: 'all',
            deptList:[],
            btCategoryList:[],
            outputList:[
                {
                    id: 'pdf',
                    label: 'PDF'
                },
                {
                    id: 'xlsx',
                    label: 'Excel'
                }
            ],
            statusGroupKey: ['all'],
            statusGroupList: [],
            inflationRate: 3,
            pdfOrientation: null,
            pdfOrientationList:[
                {
                    id: 'portrait',
                    label: 'Portrait'
                },
                {
                    id: 'landscape',
                    label: 'Landscape'
                }
            ],
            inclCurrYear: true,
            capexDateRange: 3,
            capexDateRangeList: self.getCapexDateRange(15)
        }
    },
    methods:{
      getTxnYears(last, next){
        const year = new Date().getFullYear();
        let txnYears = [];
        for (let i = -last; i <= 0; i++) {
          txnYears.push(
            {
              id: year + i,
              label: year + i
            }
          )
        }
        for (let i = 0; i < next; i++) {
          txnYears.push(
            {
              id: year + i + 1,
              label: year + i + 1
            }
          )
        }
        return txnYears;
      },
      getBudgetYears(count){
        const year = new Date().getFullYear();
        let budgetYears = [];
        for (let i = -count; i <= count; i++) {
          budgetYears.push(
            {
              id: year + i,
              label: year + i
            }
          )
        }
        return budgetYears;
      },
      getYears(back){
        const year = new Date().getFullYear();
        return Array.from({length: back}, (v, i) => {
          return {
            label: year - back + i + 1,
            id: year - back + i + 1
          }
        }).reverse();
      },
      getCapexDateRange(count){
        let DateRange = [];
        for (let i = 1; i <= count; i++) {
          DateRange.push(
            {
              id: i,
              label: i
            }
          )
        }
        return DateRange;
      },
      async getBudgetGeneralLedgerFile() {
          this.loaderOp(true);
          let filters_json = JSON.stringify(this.getFilterDetails());
          const details = {
            ...this.details,
            filters_json: filters_json,
            gmt: this.gmt, 
            user_name:this.user_name, 
            mins: this.mins,
            doAuto: this.doAuto,
            time: moment().local().format()
          }
          const {data:{data}} = await axios.post(EndPoints[this.r_id],{
            def: details,
            prop_id: this.props.toString(),
            file_type: this.output_format,
            break_on_prop: this.need_page_break,
            columns: this.columns,
          })
          var link = document.createElement("a");
          link.download = data.substr(data.lastIndexOf('/') + 1);
          link.href = process.env.VUE_APP_BACKEND_HOST+data;
          link.target ="_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.loaderOp();
          this.deleteFile(data);
          this.saveLog('pdf');
      },
      async getCheckbookVsBudgetFile() {
          this.loaderOp(true);
          let filters_json = JSON.stringify(this.getFilterDetails());
          const details = {
            ...this.details,
            filters_json: filters_json,
            gmt: this.gmt, 
            user_name:this.user_name, 
            mins: this.mins,
            doAuto: this.doAuto,
            time: moment().local().format()
          }
          const {data:{data}} = await axios.post(EndPoints[this.r_id],{
            def: details,
            b_year: this.budgetYear,
            b_month: this.budgetMonth,
            dept_id: this.filterOneDataValue,
            cat_id: this.filterTwoDataValue,
            prop_id: this.props.toString(),
            file_type: this.output_format,
            break_on_prop: this.need_page_break,
            columns: this.columns,
          })
          var link = document.createElement("a");
          link.download = data.substr(data.lastIndexOf('/') + 1);
          link.href = process.env.VUE_APP_BACKEND_HOST+data;
          link.target ="_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.loaderOp();
          this.deleteFile(data);
          this.saveLog('pdf');
      },
      async getBudgetDepartmentList(){
          const { data:{data} } = await axios.get('get-budget-department-list-data');
          this.deptList = data;
          if (data.length > 1) {
              this.filterOneDataValue = 'all'
          } else if (data.length === 1) {
              this.filterOneDataValue = data[0].id
          } else {
              this.filterOneDataValue = null
          }
          this.statusKey++;
          this.filterOneDataList = data;
      },
      async getBudgetCategoryList(){
          const { data:{data} } = await axios.post('get-budget-category-list',{
              prop_id: this.props.toString()
          });
          // this.btCategoryList = data;
          if (data.length > 1) {
              this.filterTwoDataValue = 'all'
          } else if (data.length === 1) {
              this.filterTwoDataValue = data[0].id
          } else {
              this.filterTwoDataValue = null
          }
          this.statusKey++;
          this.filterTwoDataList = data;
          
      },
      async getBudgetActualFile() {
        this.loaderOp(true);
        let filters_json = JSON.stringify(this.getFilterDetails());
        const details = {
          ...this.details,
          filters_json: filters_json,
          gmt: this.gmt, 
          user_name:this.user_name, 
          mins: this.mins,
          doAuto: this.doAuto,
          time: moment().local().format()
        }
        const {data:{data}} = await axios.post(EndPoints[this.r_id],{
          def: details,
          prop_id: this.props.toString(),
          status: this.status, 
          from_date: this.from_date === "" ? "" : 
          moment(this.from_date).add({hours: Math.abs(this.gmt), minutes: this.mins}).format("YYYY-MM-DD hh:mm:ss"),
          to_date: this.to_date === "" ? 
          moment(new Date()).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss") : 
          moment(this.to_date).add({hours:23+Math.abs(this.gmt),minutes:59+this.mins,seconds:59}).format("YYYY-MM-DD hh:mm:ss"),
          file_type: this.output_format, 
          break_on_prop: this.need_page_break, 
          columns: this.columns
        })
        var link = document.createElement("a");
        link.download = data.substr(data.lastIndexOf('/') + 1);
        link.href = process.env.VUE_APP_BACKEND_HOST+data;
        link.target ="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loaderOp();
        this.deleteFile(data);
        this.saveLog('pdf');
      },
      deleteFile(path=""){
        axios.post('/remove-file',{
          file_path: path 
        })
      },
      // All CapEx Request Report user filter
      async getCapExReqOwnershipList() {
        this.filterOneDataValue = null;

        let info = {
          company_id: this.company_id
        };

        const {
          data: { data },
        } = await axios.post("/get-all-capex-req-ownership-data", info);

        this.propKey++;

        if (data.length === 1) {
          this.filterOneDataValue = data[0].id;
        }

        if (data.length > 1) {
          this.filterOneDataValue=['all']
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });

        this.filterOneDataList = list;
      },
      async getCapExReqDepartmentList() {
        this.filterTwoDataValue = null;

        const {
          data: { data },
        } = await axios.get("/get-all-capex-req-department-data");     
        
        this.flag++;

        if (data.length === 1) {
          this.filterTwoDataValue = data[0].id
        } 
        if (data.length > 1) {
          this.filterTwoDataValue = ['all']
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });
        this.filterTwoDataList =  list
      },
      async getCapExReqPropertyList() {
        this.filterThreeDataValue = null;

        let info = {
          company_id: this.company_id,
          ownership_id: this.filterOneDataValue.toString()
        };

        const {
          data: { data },
        } = await axios.post("/get-all-capex-req-property-data", info);

        this.flagOne++;

        if (data.length === 1) {
          this.filterThreeDataValue = data[0].id;
        }

        if (data.length > 1) {
          this.filterThreeDataValue=['all']
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });

        this.filterThreeDataList = list;
      },
      async getCapExReqStatusGroupList() {

        const {
          data: { data },
        } = await axios.get("/get-all-capex-req-status-group-data");

        this.flagTwo++;

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });

        this.statusGroupList = list;
      },
      async getCapExReqStatusList() {
        this.filterFourDataValue = null;

        let info = {
          status_group: this.statusGroupKey.toString()
        };

        const {
          data: { data },
        } = await axios.post("/get-all-capex-req-status-data", info);

        this.flagThree++;

        if (data.length > 1) {
          this.filterFourDataValue=['all']
        } else {
          this.filterFourDataValue=null
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });

        this.filterFourDataList = list;
      },
      async getCapExReqDateRangeList() {
        this.typeDataKey = [];

        const { data: { data } } = await axios.get('/get-all-capex-req-daterange-data'); 

        this.flagFour++

        this.typeDataList =  data.map(e=>{
          return{
            label: e.name,
            id: e.id
          }
        });
      },
      async getBudgetGroupList(){
        const { data:{ data } } = await axios.post('/get-budget-group-list-data', {
            prop_id: this.props.toString()
        });
        if (data.length > 1) {
            this.filterTwoDataValue = 'all'
        } else if (data.length === 1) {
            this.filterTwoDataValue = data[0].id
        } else {
            this.filterTwoDataValue = null
        }
        this.statusKey++;
        this.filterTwoDataList = data;
      },
      async getBudgetSettingsFile() {
        this.loaderOp(true);
        let filters_json = JSON.stringify(this.getFilterDetails());
        const details = {
          ...this.details,
          filters_json: filters_json,
          gmt: this.gmt, 
          user_name:this.user_name, 
          mins: this.mins,
          doAuto: this.doAuto,
          time: moment().local().format()
        }
        const { data:{ data } } = await axios.post(EndPoints[this.r_id],{
          def: details,
          prop_id: this.props.toString(),
          b_year: this.budgetYear,
          b_month: this.budgetMonth,
          department_id: this.filterOneDataValue,
          group_id: this.filterTwoDataValue,
          file_type: this.output_format,
          break_on_prop: this.need_page_break,
          columns: this.columns,
        })
        var link = document.createElement("a");
        link.download = data.substr(data.lastIndexOf('/') + 1);
        link.href = process.env.VUE_APP_BACKEND_HOST + data;
        link.target ="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loaderOp();
        this.deleteFile(data);
        this.saveLog('pdf');
      },
      async getCapExBinderOwnership() {
        if (this.isDepartmentId) {
          this.filterOneDataValue = null;

          let info = {
            company_id: this.company_id
          };

          const {
            data: { data },
          } = await axios.post("/get-company-ownership", info);

          this.propKey++;

          if (data.length === 1) {
            this.filterOneDataValue = data[0].id;
          }

          if (data.length > 1) {
            this.filterOneDataValue=['all']
          }

          const list = data.map(el=>{
            return {id: el.id, label: el.name}
          });

          this.filterOneDataList = list;
        }
      },
      async getCapExBinderProperty() {
        this.filterThreeDataValue = null;
        let list = [];
        if (this.filterOneDataValue !== null) {
          let info = {
            company_id: this.company_id,
            ownership_id: this.filterOneDataValue.toString()
          };
          const {
            data: { data },
          } = await axios.post("/get-company-ownership-property", info);
          if (data.length === 1) {
            this.filterThreeDataValue = data[0].id;
          }
  
          if (data.length > 1) {
            this.filterThreeDataValue=['all']
          }
  
          list = data.map(el=>{
            return {id: el.id, label: el.name}
          });
        } else {
          let { data: { data } } = await axios.get('/get-property-data')
          if (data.length === 1) {
            this.filterThreeDataValue = data[0].id;
          }
  
          if (data.length > 1) {
            this.filterThreeDataValue=['all']
          }
  
          list = data.map(el=>{
            return {id: el.id, label: el.name}
          });
        }

        this.flagOne++;

        this.filterThreeDataList = list;
      },
      async getCapExBinderFile(){
        this.loaderOp(true);
        let info = {
          company_id: this.company_id, 
          cpx_ownership_id: this.filterOneDataValue === null ? 'all' : this.filterOneDataValue.toString(),
          cpx_property_id: this.filterThreeDataValue.toString(), 
          cpx_year: this.budgetYear, 
          cpx_rate: this.inflationRate, 
          cpx_status: this.status, 
          cpx_format: this.output_format, 
          cpx_orientation: this.pdfOrientation
        }
        await axios.post(EndPoints[this.r_id], info).then((response) => {
          if(response.data.success) {
            let file_path = response.data.filename;
            let link = document.createElement('A');
            link.href = process.env.VUE_APP_BACKEND_HOST+'/app/reports/'+file_path;
            link.download = file_path;
            link.target ="_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.loaderOp();
            this.deleteFile('/app/reports/'+file_path);
            this.saveLog('pdf');
          }
        }).catch(error => {
          console.log(error);
        })
      },
      async getCapExVendorList() {
        this.filterThreeDataValue = null;

        let info = {
          prop_id: this.props.toString()
        };

        const {
          data: { data },
        } = await axios.post("/get-txn-checkbook-vendor-data", info);

        this.flagThree++;

        if (data.length === 1) {
          this.filterThreeDataValue = data[0].id;
        }

        if (data.length > 1) {
          this.filterThreeDataValue=['all']
        }

        const list = data.map(el=>{
          return {id: el.id, label: el.name}
        });

        this.filterThreeDataList = list;
      },
      async getTransactionsCheckbookFile() {
        this.loaderOp(true);
        let filters_json = JSON.stringify(this.getFilterDetails());
        const details = {
          ...this.details,
          filters_json: filters_json,
          gmt: this.gmt, 
          user_name:this.user_name, 
          mins: this.mins,
          doAuto: this.doAuto,
          time: moment().local().format()
        }
        const { data: { data } } = await axios.post(EndPoints[this.r_id], {
          def: details,
          prop_id: this.props.toString(),
          b_year: this.budgetYear,
          b_month: this.budgetMonth,
          dept_id: this.filterOneDataValue.toString(),
          cat_id: this.filterTwoDataValue.toString(),
          ven_id: this.filterThreeDataValue.toString(),
          company_id: this.company_id,
          file_type: this.output_format,
          break_on_prop: this.need_page_break,
          columns: this.columns,
        })
        var link = document.createElement("a");
        link.download = data.substr(data.lastIndexOf('/') + 1);
        link.href = process.env.VUE_APP_BACKEND_HOST+data;
        link.target ="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loaderOp();
        this.deleteFile(data);
        this.saveLog('pdf');
      },
      async getCapExForecastFile () {
        this.loaderOp(true);
        const rate = parseFloat(parseFloat(this.inflationRate).toFixed(1))
        let filters_json = JSON.stringify(this.getFilterDetails());
        const details = {
          ...this.details,
          filters_json: filters_json,
          gmt: this.gmt, 
          user_name:this.user_name, 
          mins: this.mins,
          doAuto: this.doAuto,
          time: moment().local().format()
        }
        let info = {
          def: details,
          columns: this.columns,
          company_id: this.company_id, 
          cpx_ownership_id: this.filterOneDataValue === null ? 'all' : this.filterOneDataValue.toString(),
          cpx_property_id: this.filterThreeDataValue.toString(), 
          cpx_year_count: this.capexDateRange, 
          cpx_rate: rate,  
          cpx_format: this.output_format, 
          cpx_orientation: this.pdfOrientation,
          cpx_include_current_year: this.inclCurrYear === true ? 1 : 0
        }
        await axios.post(EndPoints[this.r_id], info).then((response) => {
          if(response.data.success) {
            let file_path = response.data.path;
            let link = document.createElement('A');
            link.href = process.env.VUE_APP_BACKEND_HOST+'/app/reports/'+file_path;
            link.target ="_blank";
            link.download = file_path;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.loaderOp();
            this.deleteFile(file_path);
            this.saveLog('pdf');
          }
        }).catch(error => {
          console.log(error);
        })
      }
    }
}