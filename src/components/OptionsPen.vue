<template>
    <div class=" w-100 min-height card shadow-style">
        <!-- <h2 class="text-center p-3">Option pen</h2> -->
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Filters</button>
                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Joins</button>
                <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Group By</button>
            </div>
        </nav>
        <div class="tab-content p-2 border bg-light" id="nav-tabContent">
            <div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Field</th>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Filter</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="rule-container">
                                <td>
                                    <select class="form-control" style="display: none;">
                                        <option>And</option>
                                        <option>Or</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" required="required"><option value="">Please Choose</option><option value="">Customer Records &gt; Customer ID</option><option value="">Customer Records &gt; Customer Data</option><option value="">Customer Records &gt; Address</option></select>
                                    </div>
                                </td>
                                <td data-bind="with: Field"></td>
                                <td data-bind="with: Field"></td>
                                <td>
                                    <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                    <button class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                    <!-- ko if: Field() && Field().fieldType == 'DateTime' && Operator() == 'range' && $root.canAddSeries() && $index()==0 --><!--/ko -->
                                </td>
                            </tr>
                            <!-- ko foreach: compareTo --><!-- /ko -->
                        </tbody>
                    </table>
                </div>
                <div class="d-flex p-1 bg-light">
                    <button class="btn btn-primary">Add Filter</button>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Field</th>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Filter</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="rule-container">
                                <td>
                                    <select class="form-control" style="display: none;">
                                        <option>And</option>
                                        <option>Or</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" required="required"><option value="">Please Choose</option><option value="">Customer Records &gt; Customer ID</option><option value="">Customer Records &gt; Customer Data</option><option value="">Customer Records &gt; Address</option></select>
                                    </div>
                                </td>
                                <td data-bind="with: Field"></td>
                                <td data-bind="with: Field"></td>
                                <td>
                                    <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                    <button class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                    <!-- ko if: Field() && Field().fieldType == 'DateTime' && Operator() == 'range' && $root.canAddSeries() && $index()==0 --><!--/ko -->
                                </td>
                            </tr>
                            <!-- ko foreach: compareTo --><!-- /ko -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                <div class="query-builder">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Field</th>
                                <th style="width: 10%"></th>
                                <th style="width: 30%">Filter</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="rule-container">
                                <td>
                                    <select class="form-control" style="display: none;">
                                        <option>And</option>
                                        <option>Or</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="form-group">
                                        <select class="form-control" style="width: 100%;" data-bind="options: $root.selectedFieldsCanFilter, optionsText: 'selectedFieldName', optionsCaption: 'Please Choose', value: Field, attr: {required: Field()==null?'required':false}, disable: Field() &amp;&amp; Field().forced" required="required"><option value="">Please Choose</option><option value="">Customer Records &gt; Customer ID</option><option value="">Customer Records &gt; Customer Data</option><option value="">Customer Records &gt; Address</option></select>
                                    </div>
                                </td>
                                <td data-bind="with: Field"></td>
                                <td data-bind="with: Field"></td>
                                <td>
                                    <span data-bind="visible: Field() &amp;&amp; Field().forced" class="badge badge-info" style="display: none;">Required Filter</span>
                                    <button class="btn btn-sm btn-secondary" data-bind="click: $parent.RemoveFilter, hidden: Field() &amp;&amp; Field().forced">Remove</button>
                                    <!-- ko if: Field() && Field().fieldType == 'DateTime' && Operator() == 'range' && $root.canAddSeries() && $index()==0 --><!--/ko -->
                                </td>
                            </tr>
                            <!-- ko foreach: compareTo --><!-- /ko -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
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
</style>