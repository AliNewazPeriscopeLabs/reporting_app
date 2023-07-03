import toaster from './toaster'
const { toastr } = toaster
import axios from 'axios';
import { VueCookieNext  } from 'vue-cookie-next';

const site_url = process.env.VUE_APP_BACKEND_HOST+'/api/v1';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // allow cross-origin requests to happen

// Set globals
axios.defaults.baseURL = site_url;
axios.defaults.headers.common["Cache-Control"] = "no-cache";

// set JWT token on headers
const token = VueCookieNext.getCookie('QV2Auth');
if (token) {
  axios.defaults.headers.common["Authorization"] = token
}

axios.interceptors.response.use(null , (error)=>{
  if(error.response.status == 500){
    if (error.response.data && error.response.data.errMessage) {
      toastr.error(error.response.data.errMessage);
    }
    if (error.response.data && error.response.data.message) {
      toastr.error(error.response.data.message);
    }
    if (process.env.NODE_ENV === "production") {
      toastr.error("Server Error");
    }
  }
})
