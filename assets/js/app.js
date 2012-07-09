// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
    
    	pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - we won't be able to show you any maps");
        } else {
            alert("We can reach Google - get ready for some awesome maps!");
        }
    })();
    
    // a little inline controller
    when('#welcome');
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked',true);
				}
				if (saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
			
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);
            }, function () {
                x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
            });
        });
    });
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
        });
        display('#welcome');
    });
    
    var lat, long,timestamp;
    when('#video', function () {
            // Launch device video recording application,
	    // allowing user to capture up to 2 video clips
	    alert('video');
	    
	    pictureSource=navigator.camera.PictureSourceType;
            destinationType=navigator.camera.DestinationType;
	    
	    
	    	   navigator.geolocation.getCurrentPosition(function (position) {
	                    lat = position.coords.latitude;
	                    long = position.coords.longitude;
	                    timestamp = position.timestamp;
	                  }, function () {
	                    lat = "";
	                    long = "";
            });
	    
	    
	    //navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 2});
	    
	    navigator.device.capture.capturePicture(captureSuccess, captureError, {limit: 2});
	    
	    
	    when('#go', function () {
	             display('#welcome');   
	       });      
	    
	   
    });
    
    when("#see", function()
    {
       //ideaCommitLibraryVideoAttach();
       
       getImage(pictureSource.PHOTOLIBRARY);
        
    });
	    
    
    //================
        // Called when capture operation is finished
        //
        function captureSuccess(mediaFiles) {
        console.log(mediaFiles);
        
        
        
            var i, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                uploadFile(mediaFiles[i]);
            }
        }
    
        // Called if something bad happens.
        //
        function captureError(error) {
        	console.log(error);
            var msg = 'An error occurred during capture: ' + error.code;
            navigator.notification.alert(msg, null, 'Uh oh!');
    	}
    	
    	// Upload files to server
	    function uploadFile(mediaFile) {
	    console.log('upload');
	    
	   var path = mediaFile.fullPath,
	     name = mediaFile.name;
	    
	    
	   
	     
	     
	    var options = new FileUploadOptions();
		
		var params = new Object();
		params.latitude = lat;
		params.longitue = long;
		params.timestamp = timestamp;
		params.eventName= "The Event";


		options.params = params;
	    
	    	options.chunkedMode = true;
		options.fileKey = "file";
		options.fileName = name;
		options.mimeType = "video/mpeg";
	    
	    
	    
	        var ft = new FileTransfer();
		console.log(path)
				
	        ft.upload(path,
	            "http://www.mpdashboard.com/vid/upload.php",
	            //"http://192.168.1.8/vid/upload.php",
	            function(result) {
	                console.log('Upload success: ' + result.responseCode);
	                console.log(result.bytesSent + ' bytes sent');
	                console.log(result);
	            },
	            function(error) {
	                console.log('Error uploading file ' + path + ': ' + error.code);
	            },
	            options);
	            
    }
    
    
    
 
    
    
    
    function ideaCommitLibraryVideoAttach() {
    if(PhoneGap.available) {
        var options = {quality: 80};
        options["sourceType"] = 0;
        options["correctOrientation"] = true;
        options["allowEdit"] = true;
        options["mediaType"] = 1;
        navigator.camera.getPicture(ideaCommitLibraryVideoReceive, ideaCommitVideoAttachFail, options);
    }
    }
    
    function ideaCommitLibraryVideoReceive(data) {
    if(PhoneGap.available) {
        var gotFS = function(fileSystem) {
            var fail = function() {notify("Can't open file!");};
            var gotFileEntry = function(fileEntry) {
                var fail = function() {notify("Can't write attachment in a temporary file!");};
                var gotFileWriter = function(fileWriter) {
                    fileWriter.onwriteend = function(evt) {
                        ideaCommitVideoReceive([fileEntry]);
                    };
                    fileWriter.write(data);
                };
                fileEntry.createWriter(gotFileWriter, fail);
                file = fileEntry;
            };
            fileSystem.root.getFile("y"+ new Date().getTime()+".mp4", {create: true, exclusive: false}, gotFileEntry, fail);
    
        };
        var fail = function() {notify("Can't open file system!");};
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
}
    
    function ideaCommitVideoAttachFail(error)
    {
    	alert('error');
    }
    
    

function getImage(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}
 
    
    function onFail(message) {
          alert('Failed because: ' + message);
    }
    
    
    function onPhotoURISuccess(imageURI) {
          // Uncomment to view the image file URI 
          console.log(imageURI);
    
          // Get image handle
          //
          var image = document.getElementById('image');
    
          // Unhide image elements
          //
          image.style.display = 'block';
    
          // Show the captured photo
          // The inline CSS rules are used to resize the image
          //
          image.src = imageURI;
        }

   //============================== 
    
    
});
