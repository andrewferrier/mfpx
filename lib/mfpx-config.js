//-----------------------------------------------------------------------
//-- mfpx-config
//-----------------------------------------------------------------------
var fs      = require("fs"),
	fsx		= require("fs-extra"),
	path	= require("path");

module.exports = {
	ibmDir    : process.env.HOME + "/.ibm",
	cfgFile   : process.env.HOME + "/.ibm/mfpx.json",
	config    : {},

	//-----------------------------------------------------------------------
	// Load Config, or Create default configuration file
	load : function() {
		if ( !fs.existsSync( this.cfgFile ) ) {
			console.log("Creating default config file: ", this.cfgFile);
			this.config = require( "../lib/mfpx.json" );
			this.save();
			//fsx.copySync( path.resolve(__dirname,'..','lib','mfpx.json', this.cfgFile));
		} else {
			try {
				this.config = require( this.cfgFile );
			} catch(e) {
				console.error("Failed to read config file: ", this.cfgFile);
				console.log("Verify syntax using jsonlint.com. Error: ", e);
			}
		}
		var cfg = this.config;
		//-- verify all needed settings are present
		["mfp_version", "installers_dir", "mfp_versions"].forEach(function(key) {
			if (! cfg[key] ) {
				console.error("MFPX Config, missing required value '" + key + "' in config:");
				console.log(JSON.stringify(this.config, null, 2));
			}
		});
	},
	
	//-----------------------------------------------------------------------
	// Creates default configuration file
	save : function() {
		//console.log("Saving config: ", this.config);
		try {
			if ( !fs.existsSync( this.ibmDir ) ) {
				fs.mkdirSync( this.ibmDir );
			}
			fs.writeFileSync( this.cfgFile, JSON.stringify(this.config, null, 2));
		} catch(e) {
			console.error("Failed to save config!  Verify syntax using jsonlint.com. Error: ", e);
		}
	},
	
	//-----------------------------------------------------------------------
	// provide details on currently set MFP instance
	"get" : function( key ) {
		var iv = this.config.mfp_version;
		
		if ( key === "mfp_instance_version") {
			if ( this.config.mfp_versions[ iv ] ) {
				return this.config.mfp_versions[ iv ];
			} else {
				throw new Error("No mfp_versions entry for '" + iv + "'");
			}
		} else {
			return this.config[key];
		}
	},
	
	//-----------------------------------------------------------------------
	"set" : function( key, val ) {
		if ( key === "mfp_version" && !(this.config.mfp_versions[ val ]) ) {
			console.error("No mfp_versions entry for '%s' in config file '%s'.", val, this.cfgFile);
			console.log("Populate mfp_versions entry like:");
			console.log('"8.2":', JSON.stringify(this.sampleVersionEntry, null, 2) );
			throw new Error("No mfp_versions entry for '"+val+"'");
		} else {
			this.config[key] = val;
			this.save();
		}
	}

};

//-----------------------------------------------------------------------
