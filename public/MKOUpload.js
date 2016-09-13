host = 'http://mko-test.oss-cn-shenzhen.aliyuncs.com';

var randomString = function(len){
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd + Date.now();
};

//签名相关信息

var storageSignInfo = {};

function MKOUpload(buttonID, containerID, callback){
	var self = this;
	this.currentFile = null;

	var multipart_params = {};
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash,silverlight,html4',
		browse_button : buttonID,
		container: document.getElementById(containerID),
		flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
		silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
		url : host,
		multipart_params: null,
		filters: {
			mime_types : [
				{ title : "Image files", extensions : "jpg,gif,png,jpeg" }
			],
			max_file_size: "5mb",
			prevent_duplicates: true
		},
		init: {
			PostInit: function() {
			},
			FilesAdded: function(up, files) {
				self.currentFile = files[0];
				Object.assign(multipart_params, storageSignInfo);
				var fileName = randomString(16);
				var fileExt = self.currentFile.name.split('.').pop();
				if (fileExt != self.currentFile.name){
					fileName = fileName + '.' + fileExt;
				}
				multipart_params.key = fileName;
				multipart_params.Filename = fileName;
				uploader.setOption({
					'url': host,
					'multipart_params': multipart_params
				});
				callback('filesAdd', {file: self.currentFile});
				uploader.start();
			},

			UploadProgress: function(up, file) {
				callback('uploadProgress', {file: file});
			},

			FileUploaded: function(up, file, info) {
				var url = host + '/' + multipart_params.key;
				callback('fileUploaded', {file: file, url: url});
				uploader.removeFile(file);
				self.currentFile = null;
			},

			Error: function(up, err) {
				callback('error', {error: error});
			}
		}
	});

	this.cancel = function(){
		if (uploader.state == plupload.STARTED){
			callback('cancel', {file: self.currentFile});
			uploader.stop();
		}
		if (self.currentFile){
			uploader.removeFile(self.currentFile);
			self.currentFile = null;
		}
	}
	uploader.init();
}


function MKOUploaderManager(){
	var uploaders = {};
	var uploaderCount = 0;
	$.ajax({
		type:"GET",
		url: '/admin/services/storage?action=signature&service=AliyunOSS',
		dataType:"json",
		success: function(json){
			if (json.code != 0){
				alert('存储服务签名失败!' + json.error);
				return;
			}
			var result = json.response;
			storageSignInfo = {
				'policy': result.policy,
				'OSSAccessKeyId': result.accessID,
				'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
				'signature': result.signature
			}
		},
		error:function(err){
			alert('存储服务签名失败!' + JSON.stringify(err));
		}
	});

	/* 上传参数
		opts = {
			button: buttonID,
			container: containerID,
			progressBar: progressBarID,
	 		label: labelID,
	 		context: context,    //Data
	 		beforeCallback: function(context)
	 		completedCallback: function(context, url)
		}
	 */
	this.newUploader = function(opts){
		this.uploaderCount += 1;
		var tmpUploader = new MKOUpload(opts.button, opts.container, function(type, value) {
			if (type == 'filesAdd') {
				if (typeof opts.beforeCallback == 'function'){
					opts.beforeCallback(opts.context);
				}
				$('#' + opts.progressBar).progress({
					percent: 0
				});
			} else if (type == 'uploadProgress') {
				$("#" + opts.label).text('正在上传' + value.file.percent + '%...');
				$('#' + opts.progressBar).progress({
					percent: value.file.percent
				});
				if (value.file.percent == 100) {
					$("#" + opts.label).text('上传成功!');
				}
			} else if (type == 'fileUploaded') {
				setTimeout(function () {
					$("#" + opts.label).text('选择文件');
					$('#' + opts.progressBar).progress({
						percent: 0
					});
				}, 500);
				if (typeof opts.completedCallback == 'function'){
					opts.completedCallback(opts.context, value.url);
				}
			} else if (type == 'error') {
				alert(value.error.message);
			} else if (type == 'cancel') {
			}
		});
		uploaders[uploaderCount.toString()] = tmpUploader;
		return uploaderCount.toString();
	}

	this.cancelAll = function(){
		for (var key in uploaders){
			var uploader = uploaders[key];
			uploader.cancel();
		}
	}

	this.removeByUploaderID = function(uploaderID){
		if (uploaderID in uploaders){
			var uploader = uploaders[uploaderID];
			uploader.cancel();
			delete uploaders[uploaderID];
		}
	}
}