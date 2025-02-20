// Etoys activity for Sugarizer
// using SqueakJS https://squeak.js.org

requirejs(["domReady!", "squeak"], () => {
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
			onQuit: () => history.back(),
		}
	);
});
