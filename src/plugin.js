(function ($global) {

	var GA_PROP_DISABLE_PREFIX = 'ga-disable-';

	function getTrackingIds() {
		var trackingIds = [];

		if (!$global.ga) {
			return trackingIds;
		}
		var trackers = $global.ga.getAll();
		if (!Array.isArray(trackers)) {
			return trackingIds;
		}

		trackers.forEach(function ($tracker) {
			if ($tracker && $tracker.get) {
				var trackingId = $tracker.get('trackingId');
				if (typeof trackingId === 'string' && trackingId.length > 0) {
					trackingIds.push(trackingId);
				}
			}
		});
		return trackingIds;
	}

	$global.ConsentCookie.on('connection', function ($payload) {
		if ($payload.id === 'ga' && $payload.state === 'disabled') {

			// Disabled all active analytic trackers
			getTrackingIds()
				.forEach(function ($trackingId) {
					$global[GA_PROP_DISABLE_PREFIX + $trackingId] = true;
				});
		} else if ($payload.id === 'ga' && $payload.state === 'enabled') {

			// Remove the disabled property for all analytic trackers
			getTrackingIds()
				.forEach(function ($trackingId) {
					delete $global[GA_PROP_DISABLE_PREFIX + $trackingId];
				});
		}
	});

})(window);
