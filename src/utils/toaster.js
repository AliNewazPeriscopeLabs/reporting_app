import "toastr/build/toastr.css";
import toastr from "toastr/build/toastr.min.js";
import toastrB from "toastr/build/toastr.min.js";

toastr.options = {
	debug: false,
	newestOnTop: true,
	timeOut: 5000
};
toastrB.options = {
	debug: false,
	newestOnTop: true,
	closeButton: true,
	positionClass: "toast-bottom-right",
	timeOut: 5000
};

export default {
	toastr,
	toastrB
};
