export default {
    watch: {
        tempStatus: async function (x) {
          if (x !== "") {
            this.formLoader = true
            await this.getTemplates();
          }
          this.formLoader = false
        },
        template_id: async function (x) {
          if (x !== null && x !== '') {
            this.formLoader = true
            await this.getInspectionItems();
            this.formLoader = false
          } else {
            this.flagOne++;
            this.item_id = [];
            this.items = [];
          }
        },
        /*-----------------------------------
        Admin Usage Report watch state start
        -------------------------------------*/
        status: async function (x) {
          if (this.r_id === 'AdminUsgRe') {
            this.usageFlag === false ? this.loaderOperate(true) : this.formLoader = true;
            await this.getUsageDependent(x)
          }
          if (this.r_id === 'AdminUsgRe' && x==0) {
            this.filterOneDataKey=[];
            this.flag++;
          }
        },
        agreementsKey: async function (x) {
          if (x !== null && x !== undefined) {
            this.usageFlag === false ? this.loaderOperate(true) : this.formLoader = true;
            await this.getUsageProperties('in_usage_agreement', x)
            this.formLoader = false;
          } else {
            this.usageProp = [];
            this.usagePropKey = null;
          }
        },
        companiesKey: async function (x) {
          if (x !== null && x !== undefined) {
            this.formLoader = true;
            await this.getUsageProperties('in_usage_company', x)
            this.formLoader = false;
          } else {
            this.usageProp = [];
            this.usagePropKey = null;
          }
        },
        ownershipsKey: async function (x) {
          if (x !== null && x !== undefined) {
            this.formLoader = true;
            await this.getUsageProperties('in_usage_ownership', x)
            this.formLoader = false;
          } else {
            this.usageProp = [];
            this.usagePropKey = null;
          }
        },
        /*-----------------------------------
        Admin Usage Report watch state end
        -------------------------------------*/
    }
}