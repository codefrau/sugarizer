// Etoys activity for Sugarizer
// using SqueakJS https://squeak.js.org

define([
    "sugar-web/activity/activity",
    "sugar-web/env",
    "squeak",
    ], (
    activity,
    env,
    ) => {
    activity.setup();

    const argv = [
        "Etoys.activity/lib/squeak.js", 		// vm    (unused)
        "Etoys.activity/resources/etoys.image", // image (unused)
        "",              						// doc   (unused)
    ];

    env.getEnvironment((err, environment) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("env", environment);


        argv.push("ACTIVITY_ID",  environment.activityId);
        argv.push("BUNDLE_ID",    environment.bundleId);
        if (environment.objectId) {
            argv.push("OBJECT_ID", environment.objectId);
        }
        console.log("argv", argv);
    });

    // getProperties (metadata)
    // mime_type: application/x-squeak-project
    // title: project name

    Squeak.registerExternalModule('DBusPlugin', SugarizerDBusPlugin());

    SqueakJS.runSqueak(
        'resources/etoys.image',
        sqCanvas,
        {
            appName: "Etoys Activity",
            argv,
            fixedWidth: 1200,
            fixedHeight: 900,
            spinner: sqSpinner,
            files: ["etoys.changes", "EtoysV5.stc"], // same dir as etoys.image
            root: "/Etoys",
            templates: { "/Etoys": "." },	         // same dir too
            onQuit: () => {
                // // Set metadata
                // activity.getDatastoreObject().setMetadata({
                // 	title: "Etoys Activity",
                // 	title_set_by_user: "0",
                // });

                // Set data
                const stateObj = { foo: "bar" };
                activity.getDatastoreObject().setDataAsText(stateObj);

                // Save the object
                activity.getDatastoreObject().save((error) => {
                    if (error === null) {
                        console.log("write done.");
                    } else {
                        console.log("write failed.");
                    }
                    debugger
                    activity.close();
                });

                // activity.close();
                // history.back();

            }
        }
    );
});


// Fake DBus to pretend we are running in Sugar
// emulating its presence service and data store
function SugarizerDBusPlugin() {
    let proxy = null;
    let msgSerial = 0;
    return {
        getModuleName() { return "DBusPlugin (Sugarizer)"; },
        setInterpreter(p) { proxy = p; return true; },
        primitiveDBusRegisterName(argCount){
            // 1 Service has become the primary owner of the requested name
            // 2 Service could not become primary owner and has been placed in the queue
            // 3 Service is already in the queue
            // 4 Service is already the primary owner

            const status = 1; // primary owner
            console.log(`primitiveDBusRegisterName(${proxy.stackObjectValue(0).bytesAsString()}) ==> ${status}`);
            proxy.popthenPush(argCount+1, status)
            return true;
        },
        primitiveDBusConnectionDispatchStatus(argCount){
            // answer the process status of the receivers connection
        	// 0 data remains
	        // 1 complete
	        // 2 need memory
            const status = 1; // no data remains
            console.log(`primitiveDBusConnectionDispatchStatus() ==> ${status}`);
            proxy.popthenPush(argCount+1, status)
            return true;
        },
        primitiveDBusCreateMessageFrom(argCount){
            const msg = proxy.stackObjectValue(0);
            console.log(`primitiveDBusCreateMessageFrom(${msg.pointers})`);
            proxy.pop(argCount);
            return true;
        },
        primitiveDBusSendMessageTimeout(argCount){
            const timeout = proxy.stackIntegerValue(0);
            const serial = msgSerial++;
            console.log(`primitiveDBusSendMessageTimeout(${timeout}) ==> ${serial}`);
            proxy.popthenPush(argCount+1, serial);
            return true;
        },

    };
}