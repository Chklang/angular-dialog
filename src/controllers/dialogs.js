/**
 * @ngdoc service
 * @name rest.user
 * @description # user Service in the spacesimperiumApp.
 */
angular.module('DialogsModule').controller('DialogCtrl', [ '$scope', function User($scope) {
	
	$scope.close = function () {
		$scope.modal.dismiss();
	};

	$scope.__proto__.api = $scope;
} ]);
