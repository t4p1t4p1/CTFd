import $ from "jquery";
import jQuery from "jquery";
import { ezProgressBar } from "./ezq";

const files = {
  upload: (form, extra_data, cb) => {
    const CTFd = window.CTFd;
    if (form instanceof jQuery) {
      form = form[0];
    }
    var formData = new FormData(form);
    formData.append("nonce", CTFd.config.csrfNonce);
    for (let [key, value] of Object.entries(extra_data)) {
      formData.append(key, value);
    }

    var pg = ezProgressBar({
      width: 0,
      title: "Upload Progress"
    });
    $.ajax({
      url: CTFd.config.urlRoot + "/api/v1/files",
      data: formData,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            var width = (e.loaded / e.total) * 100;
            pg = ezProgressBar({
              target: pg,
              width: width
            });
          }
        };
        return xhr;
      },
      success: function(data) {
        form.reset();
        pg = ezProgressBar({
          target: pg,
          width: 100
        });
        setTimeout(function() {
          pg.modal("hide");
        }, 500);

        if (cb) {
          cb(data);
        }
      }
    });
  }
};

const helpers = {
  files
};

export default helpers;
