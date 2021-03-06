//-----------------------------------------------------------------------
//-- mfpx-run
//-----------------------------------------------------------------------
var	mfpConfig   = require("./mfpx-config"),
	path		= require("path"),
	cfg         = mfpConfig.config;

//-----------------------------------------------------------------------
// Run the real version specific MFP
module.exports = function( args, sync ) {
	var cp  = require('child_process'),
		currentMfp = null,
		mfpCmd = "",
		action;

	if ( sync ) {
		action = cp.spawnSync;
		//console.log("Running 'mfp' with:", args);
	} else {
		action = cp.spawn;
	}
	
	//console.log("cfg.versions", cfg.mfp_versions);
	//console.log("cfg.version", cfg.mfp_version);
	currentMfp = mfpConfig.get("mfp_instance_version");
	mfpCmd = path.resolve(currentMfp.install_dir, "mfp");

	//console.log("MFP cmd:", mfpCmd, args.join(" "));
	
	if ( args[0] === "-v" ) {
		console.log("MFP eXtras version:", mfpConfig.mfpx_version);
		console.log("MFP eXtras current:", mfpConfig.get("mfp_version"));
	}

	try {
		if ( currentMfp.java_home ) {
			process.env['JAVA_HOME'] = currentMfp.java_home;
			process.env['PATH']      = currentMfp.java_home+"/bin:" + process.env['PATH'];
		}
				
		//-- Launch custom MFP
		action( mfpCmd, args, { stdio:'inherit' } );
	} catch(e) {
		console.log("MFP cmd:", mfpCmd, args.join(" "));
		console.error("Failed to run 'mfp'", args, sync, e);
	}
};

//-----------------------------------------------------------------------
