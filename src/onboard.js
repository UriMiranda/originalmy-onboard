import Emitter from "./emitter";
import { extend, Cookies } from "./util";
import User from "./user";

class OnBoard extends Emitter {
  static initClass() {
    this.prototype.Emitter = Emitter;

    //Events that OnBoard Emit
    this.prototype.events = [
      "nextstep",
      "previousstep",
      "error",
      "sending",
      "completed",
      "phototaked",
      "canceled",
      "show",
      "hide"
    ];

    this.prototype.defaultOptions = {
      // Plugin mode usage
      mode: "production",

      // API Key
      api_key: null,

      // Cookies adapter
      cookies: Cookies,

      // Called when OnBoard initialized
      init() {},

      // Called when user go to next step
      nextstep(step) {},

      // Called when user go to previous step
      previousstep(step) {},

      // Called when the signup return any error
      error(error) {},

      // Called when user data is sending
      sending(file, xhr, formData) {},

      // When sign up is totaly completed
      completed(data) {},

      // When user take a webcam photo
      phototaked(file) {},

      //When user dismiss dialog and cancel onboard
      canceled() {},

      /**
       * The timeout for the XHR requests in milliseconds.
       */
      timeout: 30000,

      // Called when dialog hide
      hide() {},

      // Called when dialog shows
      show() {}
    };
  }

  constructor(options) {
    super();

    if (OnBoard.instances.length) {
      throw new Error("OriginalMy OnBoard already instanced");
    }
    OnBoard.instances.push(this);

    this.element = '#omy-onboard-dialog';

    if (typeof this.element === "string") {
      this.element = document.querySelector(this.element);
    }

    this.options = Dropzone.extend(
      {},
      this.defaultOptions,
      options != null ? options : {}
    );

    if (this.options.api_key == null) {
      throw new Error("Warning! The api_key is missing");
    }
    if(NODE_ENV == 'production') {
      this.host =
        this.options.mode == "production"
          ? "https://api1.originalmy.com"
          : "https://api1.testnet.originalmy.com";
    } else {
      this.host = 'http://localhost:4000'
    }

    this.user = new User;
    this.init();
  }

  init() {
    this.URL = window.URL !== null ? window.URL : window.webkitURL;

    // Setup all event listeners on the Dropzone object itself.
    // They're not in @setupEventListeners() because they shouldn't be removed
    // again when the dropzone gets disabled.
    for (let eventName of this.events) {
      this.on(eventName, this.options[eventName]);
    }

    this.on("sending", () => this.updateTotalUploadProgress());
  }

  // This function actually uploads the file(s) to the server.
  // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
  // files, or individual chunks for chunked upload).
  _uploadData(infos, dataBlocks) {
    let xhr = new XMLHttpRequest();

    // Put the xhr object in the file objects to be able to reference it later.
    for (let data of infos) {
      data.xhr = xhr;
    }

    let method = "POST";
    xhr.open(method, this.options.host + infos.url, true);

    // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
    xhr.timeout = this.resolveOption(this.options.timeout, infos);

    xhr.onload = e => {
      this._finishedUploading(files, xhr, e);
    };

    xhr.onerror = () => {
      this._handleUploadError(files, xhr);
    };

    // Some browsers do not have the .upload property
    let progressObj = xhr.upload != null ? xhr.upload : xhr;
    progressObj.onprogress = e =>
      this._updateFilesUploadProgress(files, xhr, e);

    let headers = {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "X-Requested-With": "XMLHttpRequest",
      Authorization: this.options.api_key
    };

    for (let headerName in headers) {
      let headerValue = headers[headerName];
      if (headerValue) {
        xhr.setRequestHeader(headerName, headerValue);
      }
    }

    let formData = new FormData();

    // Adding all @options parameters
    if (this.options.params) {
      let additionalParams = this.options.params;
      if (typeof additionalParams === "function") {
        additionalParams = additionalParams.call(
          this,
          files,
          xhr,
          files[0].upload.chunked ? this._getChunk(files[0], xhr) : null
        );
      }

      for (let key in additionalParams) {
        let value = additionalParams[key];
        formData.append(key, value);
      }
    }

    // Let the user add additional data if necessary
    for (let file of files) {
      this.emit("sending", file, xhr, formData);
    }

    this._addFormElementData(formData);

    // Finally add the files
    // Has to be last because some servers (eg: S3) expect the file to be the last parameter
    for (let i = 0; i < dataBlocks.length; i++) {
      let dataBlock = dataBlocks[i];
      formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
    }

    this.submitRequest(xhr, formData, files);
  }

  resolveOption(option, ...args) {
    if (typeof option === "function") {
      return option.apply(this, args);
    }
    return option;
  }

  _finishedUploading(files, xhr, e) {
    let response;

    if (files[0].status === Dropzone.CANCELED) {
      return;
    }

    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.responseType !== "arraybuffer" && xhr.responseType !== "blob") {
      response = xhr.responseText;

      if (
        xhr.getResponseHeader("content-type") &&
        ~xhr.getResponseHeader("content-type").indexOf("application/json")
      ) {
        try {
          response = JSON.parse(response);
        } catch (error) {
          e = error;
          response = "Invalid JSON response from server.";
        }
      }
    }

    this._updateFilesUploadProgress(files);

    if (!(200 <= xhr.status && xhr.status < 300)) {
      this._handleUploadError(files, xhr, response);
    } else {
      if (files[0].upload.chunked) {
        files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
      } else {
        this._finished(files, response, e);
      }
    }
  }

  _handleUploadError(files, xhr, response) {
    if (files[0].status === Dropzone.CANCELED) {
      return;
    }

    if (files[0].upload.chunked && this.options.retryChunks) {
      let chunk = this._getChunk(files[0], xhr);
      if (chunk.retries++ < this.options.retryChunksLimit) {
        this._uploadData(files, [chunk.dataBlock]);
        return;
      } else {
        console.warn("Retried this chunk too often. Giving up.");
      }
    }

    for (let file of files) {
      this._errorProcessing(
        files,
        response ||
          this.options.dictResponseError.replace("{{statusCode}}", xhr.status),
        xhr
      );
    }
  }

  submitRequest(xhr, formData, files) {
    xhr.send(formData);
  }

  hide() {
    return this.element.classList.remove('show');
  }

  show() {
    return this.element.classList.add('show');
  }
}

OnBoard.initClass();

OnBoard.options = {};

OnBoard.instances = [];

OnBoard.dataURItoBlob = function(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  let byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  let mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (
    let i = 0, end = byteString.length, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
};

// Augment jQuery
if (typeof jQuery !== "undefined" && jQuery !== null) {
  jQuery.fn.onboard = function(options) {
    return this.each(function() {
      return new OnBoard(this, options);
    });
  };
}

if (typeof module !== "undefined" && module !== null) {
  module.exports = OnBoard;
} else {
  window.OnBoard = OnBoard;
}