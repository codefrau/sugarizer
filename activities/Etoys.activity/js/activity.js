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

	env.getEnvironment((err, environment) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log("env", environment);

		if (!environment.objectId) {
			console.log("New instance");
		} else {
			activity.getDatastoreObject().loadAsText((error, metadata, data) => {
				if (error === null) {
					console.log("read done.");
					console.log("metadata", metadata);
					console.log("data", data);
				} else {
					console.log("read failed.");
				}
			});
		}
	});

	SqueakJS.runSqueak(
		'resources/etoys.image',
		sqCanvas,
		{
			appName: "Etoys Activity",
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
