<template>
    <div class=" w-100 min-height card shadow-style">
        <!-- <h2 class="text-center p-3">Option pen</h2> -->
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Filters</button>
                <button v-if="joins.length > 0" class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Joins</button>
                <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Group By</button>
                <button class="nav-link" id="nav-sort-tab" data-bs-toggle="tab" data-bs-target="#nav-sort" type="button" role="tab" aria-controls="nav-sort" aria-selected="false">Sort By</button>
            </div>
        </nav>
        <div class="tab-content p-2 border bg-light" id="nav-tabContent" style="max-height: 200px; overflow-y: scroll; overflow-x: hidden;">
            <div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 12%"></th>
                                <th style="width: 30%">Field</th>
                                <th style="width: 12%">Operator</th>
                                <th style="width: 30%">Filter</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-for="(filter, index) in filters" :key="index">
                                <tr class="rule-container">
                                    <td>
                                        <select :class="[filter.flag ? 'form-control rule-visible' : 'form-control']" style="display: none;" v-model="filter.and_or">
                                            <option value="AND">And</option>
                                            <option value="OR">Or</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div class="form-group">
                                            <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" v-model="filter.column" required="required">
                                                <option value="" disabled selected>Please Choose</option>
                                                <option v-for="(col, index) in columnList()" :key="index" :value="col">
                                                    {{ col.column_name ? `${col.table_name} &gt; ${col.column_name}` : '' }}
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <select v-if="filter.column != ''" class="form-control" v-model="filter.operator_type">
                                            <option :value="null" disabled selected>Select</option>
                                            <option v-for="(operators, index) in (numeric_data_types.includes(filter.column.data_type) ? numbers_type_operator : date_and_time_data_types.includes(filter.column.data_type) ? date_type_operator : strings_type_operator)" :key="index" :value="operators.value">{{ operators.name }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div v-if="filter.operator_type != null">
                                            <div class="form-group d-flex align-items-center">
                                                <input :class="[(filter.operator_type == isBlank || filter.operator_type == isNotBlank) ? 'form-control d-none' : 'form-control']" :type="[numeric_data_types.includes(filter.column.data_type) ? 'number' : date_and_time_data_types.includes(filter.column.data_type) ? 'date' : 'text']" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" v-model="filter.filter_value.one" required="required" />
                                                <span v-if="filter.operator_type == 'between'" class="text-center fw-bold fs-5 mx-2">~</span>
                                                <input v-if="filter.operator_type == 'between'" :class="[(filter.operator_type == isBlank || filter.operator_type == isNotBlank) ? 'form-control d-none' : 'form-control']" :type="[numeric_data_types.includes(filter.column.data_type) ? 'number' : date_and_time_data_types.includes(filter.column.data_type) ? 'date' : 'text']" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" v-model="filter.filter_value.two" required="required" />
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                        <button @click="removeFilter(index)" class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex p-1 bg-light">
                    <button @click="addFilter" class="btn btn-primary">Add Filter</button>
                </div>
            </div>
            <div v-if="joins.length > 0" class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 35%">Primary Table Column</th>
                                <th style="width: 4%"></th>
                                <th style="width: 15%">Type of Join</th>
                                <th style="width: 4%"></th>
                                <th style="width: 35%">Secondary Table Column</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="rule-container" v-for="(join, index) in joins" :key="index">
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;"  required="required" v-model="join.from_column" @change="join.to_column= {}">
                                            <option :value="join.from_column">
                                                {{join.from_table}} &gt; {{ join.from_column.column_name }}
                                            </option>
                                            <option v-for="(col, i) in joinsPrimaryTable(join.from_table, join.from_column.column_name)" :key="i" :value="col">
                                                {{join.from_table}} &gt; {{col.column_name}}
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td data-bind="with: Field"></td>
                                <td data-bind="with: Field">
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;"  required="required" v-model="join.join_type">
                                            <option :value="join.join_type">
                                                {{ join.join_type }}
                                            </option>
                                            <option v-if="join.join_type != 'Left Join'" value="Left Join">Left Join</option>
                                            <option v-if="join.join_type != 'Right Join'" value="Right Join">Right Join</option>
                                            <option v-if="join.join_type != 'Inner Join'" value="Inner Join">Inner Join</option>
                                        </select>
                                    </div>
                                </td>
                                <td data-bind="with: Field"></td>
                                <td data-bind="with: Field">
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;"  required="required" v-model="join.to_column">
                                            <option disabled :value="{}">Please Choose</option>
                                            <option v-if="join.to_column.column_name" :value="join.to_column">
                                                {{`${join.to_table} &gt; ${join.to_column.column_name}`}}
                                            </option>
                                            <option v-for="(col, i) in joinsSecondaryTable(join)" :key="i" :value="col">
                                                {{col.column_name ? `${join.to_table} &gt; ${col.column_name}` : ''}}
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <button @click="removeJoins(join.join_id, index)" class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 40%">Column Field</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(gb, i) in group_by" :key="i" class="rule-container">
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" required="required" v-model="gb.column">
                                            <option :value="{}" disabled>Please Choose</option>
                                            <option v-for="(col, index) in columnList()" :key="index" :value="col">
                                                {{ col.column_name ? `${col.table_name} &gt; ${col.column_name}` : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                    <button @click="removeGroupBy(i)" class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex p-1 bg-light">
                    <button @click="addGroupBy" class="btn btn-primary">Add Group By</button>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-sort" role="tabpanel" aria-labelledby="nav-sort-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 40%">Column Field</th>
                                <th style="width: 12%">Order</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sb, i) in sort_by" :key="i" class="rule-container">
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" required="required" v-model="sb.column">
                                            <option :value="{}" disabled>Please Choose</option>
                                            <option v-for="(col, index) in columnList()" :key="index" :value="col">
                                                {{ col.column_name ? `${col.table_name} &gt; ${col.column_name}` : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <select :class="[sb.column.column_name ? 'form-control rule-visible' : 'form-control']" style="display: none;" v-model="sb.order">
                                        <option value="asc">ASC</option>
                                        <option value="desc">DESC</option>
                                    </select>
                                </td>
                                <td class="align-middle">
                                    <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                    <button @click="removeSortBy(i)" class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex p-1 bg-light">
                    <button @click="addSortBy" class="btn btn-primary">Add Sort By</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:[
        'filters',
        'joins',
        'group_by',
        'sort_by',
        'addFilter',
        'removeFilter',
        'removeJoins',
        'addGroupBy',
        'removeGroupBy',
        'addSortBy',
        'removeSortBy',
        'columns',
    ],
  data() {
    return {
      numbers_type_operator: [
        {name: '=', value: '='},
        {name: '>', value: '>'},
        {name: '<', value: '<'},
        {name: '>=', value: '>='},
        {name: '<=', value: '<='},
        {name: 'not equal', value: '!='},
        {name: 'between', value: 'between'},
        {name: 'is blank', value: '= ""'},
        {name: 'is not blank', value: '!= ""'},
      ],
      strings_type_operator: [
        {name: '=', value: '='},
        {name: 'like', value: 'like'},
        {name: 'not like', value: 'not like'},
        {name: 'not equal', value: '!='},
        {name: 'is blank', value: '= ""'},
        {name: 'is not blank', value: '!= ""'},
      ],
      date_type_operator: [
        {name: '=', value: '='},
        {name: '>', value: '>'},
        {name: '<', value: '<'},
        {name: '>=', value: '>='},
        {name: '<=', value: '<='},
        {name: 'not equal', value: '!='},
        {name: 'between', value: 'between'},
        {name: 'is blank', value: '= ""'},
        {name: 'is not blank', value: '!= ""'},
      ],
      numeric_data_types: [
        'int',
        'bigint',
        'float',
        'double',
        'decimal',
        'integer',
        'smallint',
        'numeric',
        'real',
        'double precision'
      ],
      date_and_time_data_types: [
        'date',
        'time',
        'datetime',
        'timestamp',
        'timestamptz',
        'interval'
      ],
      isBlank: '= ""',
      isNotBlank: '!= ""'
    };
  },
  methods: {
    columnList() {
        let columnList = []
        for (const column in this.columns) {
            for (const el of this.columns[column]) {
                columnList.push({
                    ...el,
                    table_name: column
                })
            }
        }
        return columnList;
    },
    joinsPrimaryTable(from_table, selected_column) {
        const columnList = this.columns[from_table].filter(column => column.column_name != selected_column);
        return columnList;
    },
    joinsSecondaryTable(join) {
        console.log(join)
        let columnList = [];
        if (join.to_column?.column_name != undefined) {
            columnList = this.columns[join.to_table].filter(column=>column.data_type == join.from_column.data_type && column.column_name != join.to_column?.column_name);
        } else {
            columnList = this.columns[join.to_table].filter(column=>column.data_type == join.from_column.data_type);
        }
        return columnList;
    }
  }
};
</script>
<style scoped>

.query-builder .rule-container, .query-builder .rule-placeholder, .query-builder .rules-group-container {
    position: relative;
    margin: 4px 0;
    border-radius: 5px;
    padding: 5px;
    border: 1px solid #eee;
    width: 100%;
}


.query-builder .rules-group-container {
    padding: 10px;
    padding-bottom: 6px;
    border: 1px solid #dcc896;
}

.query-builder .rules-group-header {
    margin-bottom: 10px;
}

.query-builder .rules-group-header .group-conditions .btn.readonly:not(.active), .query-builder .rules-group-header .group-conditions input[name$='_cond'] {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap
}

.query-builder .rules-group-header .group-conditions .btn.readonly {
    border-radius: 3px
}

.query-builder .rules-list {
    list-style: none;
    padding: 0 0 0 15px;
    margin: 0;
    background-color: #fff;
}

.query-builder .rules-list > ::after, .query-builder .rules-list > ::before {
    content: '';
    position: absolute;
    left: -10px;
    width: 10px;
    height: calc(50% + 4px);
    border-color: #ccc;
    border-style: solid
}

.query-builder .rules-list > ::before {
    top: -4px;
    border-width: 0 0 2px 2px;
}

.query-builder .rules-list > ::after {
    top: 50%;
    border-width: 0 0 0 2px
}

.query-builder .rules-list > :first-child::before {
    top: -12px;
    height: calc(50% + 14px)
}

.query-builder .rules-list > :last-child::before {
    border-radius: 0 0 0 4px
}

.query-builder .rules-list > :last-child::after {
    display: none
}
.min-height{
    min-height: 223px !important;
}

.rule-visible{
    display: block !important;
}
</style>