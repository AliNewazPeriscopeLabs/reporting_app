<template>
    <div class=" modal-mask modal-dialog-centered modal-show-transform" id="schedulingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modalTable">
        <div class="ModaltableCell">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="favorite-color mt-2 text-center fw-normal" style="font-size: 24px;">Create Connection</h4>
              </div>
              <div class="modal-body quore-custom-scrollbar">
                <form v-if="!connectionTested" @submit.prevent="testConnection">
                  <div class="row g-3">
                    <div class="col-12">
                      <label for="db-type" class="form-label">Database Type</label>
                      <select v-model="connection_type"  class="form-control form-select" name="db-type" id="db-type" required>
                        <option value="" disabled selected>Select DB type</option>
                        <option value="mysql">MySQL</option>
                        <option value="postgres">PostGRES</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="host-name" class="form-label">Host</label>
                      <input v-model="host" type="text" class="form-control" id="host-name" name="host-name" required>
                    </div>
                    <div class="col-md-6">
                      <label for="port-no" class="form-label">Port No:</label>
                      <input v-model="port" type="number" class="form-control" id="port-no" name="port-no" required>
                    </div>
                    <div class="col-md-6">
                      <label for="user-name" class="form-label">User name:</label>
                      <input v-model="user_name" type="text" class="form-control" id="user-name" name="user-name" required>
                    </div>
                    <div class="col-md-6">
                      <label for="password" class="form-label">Password</label>
                      <input v-model="password" type="password" class="form-control" id="password" name="password">
                    </div>
                    <div class="col-12">
                      <div class="row justify-content-end">
                        <button type="submit" class="btn btn-dark w-20 fw-bold me-2" >Connect</button>
                        <button @click="close()" type="button" class="btn btn-light w-20 fw-bold" >Cancel</button>
                      </div>
                    </div>
                  </div>
                </form>
                <form v-else @submit.prevent="createConnection">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="connection-name" class="form-label">Connection Name</label>
                      <input v-model="connection_name" type="text" class="form-control" id="connection-name" name="connection-name" required>
                    </div>
                    <div  class="col-md-6">
                      <label for="password" class="form-label">Databases</label>
                      <select v-model="default_db"  class="form-control form-select" name="db-name" id="db-name" required>
                        <option value="" selected >Select Database</option>
                        <option v-for="(data, i) in databases" :key="i"  :value="data">{{data}}</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <div class="row justify-content-end">
                        <button type="submit" class="btn btn-dark w-20 fw-bold me-2" >Connect</button>
                        <button @click="close()" type="button" class="btn btn-light w-20 fw-bold" >Cancel</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import toastr from '@/utils/toaster';
import axios from 'axios'

export default {
  props:[
    'close',
    'opLoader'
  ],
  data() {
    return {
      isCancel: false,
      connection_type: '',
      user_name: null,
      host: null,
      password: null,
      port: 3306,
      databases: [],
      default_db: '',
      connectionTested: false,
      connection_name: null
    }
  },
  methods: {
    async testConnection(){
      this.opLoader(true)

      const { data:{ success,data,message } } = await axios.post('/test-connection',{
        connection_type: this.connection_type,
        user_name: this.user_name,
        host: this.host,
        password: this.password,
        port: this.port,
      });
      if (success) {
        this.connectionTested=success;
        this.databases = data
      } else {
        toastr.error(message);
      }
      this.opLoader()
    },
    async createConnection(){
      this.opLoader(true)
      const { data:{ success,message } } = await axios.post('/create-connection',{
        connection_name: this.connection_name,
        connection_type: this.connection_type,
        host: this.host,
        port: this.port,
        user_name: this.user_name,
        password: this.password,
        default_db: this.default_db,
      });
      if (success) {
        toastr.success(message);
        this.close()
      } else {
        toastr.error(message);
      }
      
      this.opLoader()
    }
  }
}
</script>
  
  <style scoped>
  .w-10{
    width: 10% !important;
  }
  .w-15{
    width: 15% !important;
  }
  .w-16{
    width: 16% !important;
  }
  .w-18{
    width: 18% !important;
  }
  .w-52{
    width: 52% !important;
  }
  .w-35{
    width: 35% !important;
  }
  .w-40{
    width: 40% !important;
  }
  .w-30{
    width: 30% !important;
  }
  .w-25{
    width: 25% !important;
  }
  .lbl-text{
    font-size: 14px;
    line-height: 25px;
  }
  .checkbox-text{
    font-weight: 380 !important;
  }
  .modal-body label{
    font-weight: bolder;
    display: flex;
    font-size: 12px;
    line-height: 15px;
  }
  .desc{
    color: #b4b4b4;
    font-size: 12px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .modal-enter {
    opacity: 0;
  }
  
  .modal-leave-active {
    opacity: 0;
  }
  
  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }
  .modal {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      outline: 0;
      display: none;
      transition: all 0.5s ease;
  }
  
  .modal-mask {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.5s ease;
  }
  
  .modal-wrapper {
    display: table-cell;
    vertical-align: top;
  }
  
  .modal-container {
    max-width: 650px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.5s ease;
  }
  
  .modalTable {
      display: table;
      height: 100%;
      width: 100%;
  }
  .ModaltableCell {
      display: table-cell;
      vertical-align: middle;
  }
  .modal-dialog {
    font-size: 14px;
    transform: none;
  }
  
  .modal.fade .modal-dialog {
    transition: transform .3s ease-out;
    transform: translate(0,-50px);
  }
  .modal-content {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      pointer-events: auto;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 0.3rem;
      outline: 0;
  }
  .modal-header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      padding: 1rem 1rem;
      border-bottom: none;
      font-size: inherit;
  }
  .reportTitle {
      margin-bottom: 5px;
  }
  .modal-title {
      margin-bottom: 0;
      line-height: 1.5;
      font-size: 15px;
  }
  .btn {
    border: 1.5px solid #f1f1f1 !important;
    font-weight: 400 !important;
  }
  .week-container {
    display: grid;
    grid-template-columns: repeat(7, 45px);
    gap: 3px;
  }
  .month-container {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 3px;
  }
  .year-container {
    display: grid;
    grid-template-columns: repeat(4, 50px);
    gap: 3px;
  }
  .frequency_item {
    display: flow-root !important;
  }
  .btn-close {
      box-sizing: content-box;
      width: 2em;
      height: 2em;
      padding: 0em 0em !important;
      position: absolute;
      right: 2.5%;
      top: 3%;
      color: #000;
      border: 0;
      border-radius: 50%;
      opacity: .5;
  }
  .modal-body {
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
      max-height: 80vh;
      overflow-x:hidden !important;
      overflow-y: auto !important;
  }
  .modal-footer {
      display: flex;
      flex-wrap: wrap;
      flex-shrink: 0;
      align-items: center;
      justify-content: flex-end;
      padding: 0.75rem;
      border-top: 1px solid #dee2e6;
      border-bottom-right-radius: calc(0.3rem - 1px);
      border-bottom-left-radius: calc(0.3rem - 1px);
  }
  .form-control {
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0rem 0.375rem 0.75rem;
    font-weight: 00;
    font-size: inherit;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  }
  .mx-icon-calendar, .mx-icon-clear {
    right: 5px !important;
  }
  @media (min-width: 576px){
    .modal-dialog {
        max-width: 800px !important;
        margin: 1.75rem auto;
        font-size: 14px !important;
    }
    .modal-dialog {
        position: relative;
        width: auto;
        pointer-events: none;
    }
    .modal-body label{
      font-weight: bolder;
      display: flex;
      font-size: 15px !important;
      line-height: 17px;
    }
    
    .modal-title {
      margin-bottom: 0;
      line-height: 1.5;
      font-weight: bolder;
      font-size: 20px !important;
    }
    
    .radio_container label {
      font-size: 12px !important; 
    }
    
    .btn-sche{
      width: 30% !important;
      font-weight: 400 !important;
      font-size: 16px;
      line-height: 24px;
    }
  }
  @media screen and (max-width: 575px) {
    .btn-close {
      right: 5.5%;
    }
  }
  .modal-dialog {
    max-width: 400px;
    margin: 1.75rem auto;
    font-size: 12px;
  }
  .modal-dialog {
    position: relative;
    width: auto;
    pointer-events: none;
  }
  
  .radio_container {
      display: flex;
      justify-content: space-between;
  }
  
  .radio_container input[type="radio"] {
      appearance: none;
      display: none;
  }
  
  .radio_container label {
    display: block;
    font-weight: 500 !important;
    padding: 10px 2px;
    justify-content: center;
    align-items: center;
    background-color: inherit;
    width: 95px;
    height: 40px;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;
    transition: linear 0.3s;
    border: 2px solid #f1f1f1;
    font-size: 9px;
  }
  
  input[type="radio"]:checked + label {
    background-color: #000;
    color: #fff;
    font-weight: 100;
    transition: 0.3s;
  }
  .mb{
    margin-bottom: 2.5rem !important;
  }
  .mt{
    margin-top: 2.5rem !important;
  }
  .btn-sche {
    width: 43%;
    font-weight: 400 !important;
    font-size: 16px;
    line-height: 24px;
  }
  .text-warning {
    border: 3px solid orange;
    border-radius: 5px;
    padding: 5px;
    text-align: center;
    color: darkorange !important;
  }
  .radio-text {
    background-color: #fff !important;
    color: black !important;
    transition: none !important;
    font-weight: normal !important;
    font-size: 14px !important;
    line-height: 35px !important;
  }
  </style>
  