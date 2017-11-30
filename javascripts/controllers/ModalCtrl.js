"use strict"; 

app.controller("ModalCtrl", ['$rootScope', '$scope', '$uibModal', '$log',

    function ($rootScope, $scope, $uibModal, $log, EditCtrl) {

        $scope.launchModal = (template, controller) => {

            dismissOpenModals(); 
            var modalInstance = $uibModal.open({
                templateUrl: template, 
                controller: controller, 
                scope: $scope,
            });

            modalInstance.result.then(function () {
            }, function () {
                $scope.$emit('updateContacts');
            });
        };

        const dismissOpenModals = () => {
            $('.modal-content > .ng-scope').each(function()
                {
                    try
                    {
                        $(this).scope().$dismiss();
                    }
                    catch(_) {}
                });
        };
    }
]);


