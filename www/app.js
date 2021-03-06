/**
 * Created by Administrator on 2015/12/1.
 */
angular.module('MyApp', ['ionic', 'angular-md5'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })

    .controller('mainCtrl', ['$scope', '$http', '$ionicSideMenuDelegate', '$timeout', '$ionicModal', 'md5','$ionicActionSheet',
        function ($scope, $http, $ionicSideMenuDelegate, $timeout, $ionicModal, md5,$ionicActionSheet) {

            var token = "25f9e794323b453885f5181f1b624d0b";
            
            $scope.judge = {
                listMenuShow: false,
                addFriFocusShow: true,
                searchMess: false
            };
            $scope.data = {
                showDelete: false,
                canSwipe: true
            };
            $scope.user = {
                friendName: "",
                password: ""
            }
            $scope.persons = [];
            var flag = true;
            $scope.showListMenu = function () {
                if (flag) {
                    $scope.judge.listMenuShow = true;
                    flag = false;
                } else {
                    $scope.judge.listMenuShow = false;
                    flag = true;
                }
            };

            $scope.hideListMenu = function () {
                $scope.judge.listMenuShow = false;
            };
            //按钮展开左侧菜单
            $scope.toggleLeft = function () {
                $ionicSideMenuDelegate.toggleLeft();
                console.log("toggle");
            };
            //if (window.localStorage['notFirstIn']!="undefined"&&window.localStorage['persons']!="undefined") {
            //    $scope.persons = JSON.parse(window.localStorage['persons']);
            //    console.log("haha")
            //}
            $http.get("./message.JSON")
                .success(function (data) {
                    //if(window.localStorage['notFirstIn']=="undefined"||window.localStorage['persons']=="undefined"){
                    window.localStorage['persons'] = JSON.stringify(data.persons);
                    $scope.persons = JSON.parse(window.localStorage['persons']);
                    //}
                })
                .error(function () {
                    console.log("error");
                });
            $scope.doRefresh = function () {
                //if (window.localStorage['persons']!="undefined") {
                $scope.persons = JSON.parse(window.localStorage['persons']);
                $scope.$broadcast('scroll.refreshComplete');
                //}
                $timeout(function () {
                    console.log("加载完毕");
                }, 1000);
            };

            $scope.changeTab = function (index) {
                switch (index) {
                    case 1:
                        $scope.firstActive = true;
                        $scope.secondActive = false;
                        $scope.thirdActive = false;
                        break;
                    case 2:
                        $scope.firstActive = false;
                        $scope.secondActive = true;
                        $scope.thirdActive = false;
                        break;
                    case 3:
                        $scope.firstActive = false;
                        $scope.secondActive = false;
                        $scope.thirdActive = true;
                        break;
                    default:
                        $scope.firstActive = true;
                        $scope.secondActive = false;
                        $scope.thirdActive = false;
                        break;
                }
            };


            $scope.onMyModal = {
                openMyModal: function (myModal) {
                    myModal.show();
                },
                closeMyModal: function (myModal) {
                    myModal.hide();
                },
                clearMyModal: function (myModal) {
                    $scope.$on('$destroy', function () {
                        myModal.remove();
                    });
                },
                hideMyModal: function () {
                    $scope.$on('modal.hide', function () {
                        console.log("hide");
                    });
                }
            };

            //    加好友模块
            $ionicModal.fromTemplateUrl("addFriend.html", {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (Modal) {
                $scope.modal = Modal;
            });

            $scope.openModal = function () {
                $scope.onMyModal.openMyModal($scope.modal);
                $scope.judge.listMenuShow = false;

            };

            $scope.closeModal = function () {
                if ($scope.judge.addFriFocusShow) {
                    $scope.onMyModal.closeMyModal($scope.modal);
                } else {
                    $scope.judge.addFriFocusShow = true;
                }
            };

            $scope.onMyModal.clearMyModal($scope.modal);
            $scope.onMyModal.hideMyModal();

            //$scope.singleModal = {}

            //登陆模块
            $ionicModal.fromTemplateUrl("./modal/signin.html", {
                scope: $scope,
                animation: "slide-in-up"
            }).then(function (Modal) {
                $scope.signinModal = Modal;
                console.log($scope.signinModal);
                if (true) {
                    $scope.openSignInModal($scope.signinModal);
                    window.localStorage['password'] = JSON.stringify(md5.createHash($scope.user.password));
                }
                $scope.showTopMenu= function () {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            { text: '切换账号' },
                            { text: '注册' },
                            { text: '微信安全中心' },
                        ],
                        destructiveText: 'Delete',
                        titleText: '微信',
                        cancelText: '退出',
                        cancel: function() {
                            // add cancel code..
                        },
                        buttonClicked: function(index) {
                            return true;
                        }
                    });

                    $timeout(function() {
                        hideSheet();
                    }, 5000);
                }
                $scope.signIn = function () {
                    if (md5.createHash($scope.user.password) == token) {
                        $scope.onMyModal.closeMyModal($scope.signinModal);
                    } else {
                        alert("密码错误");
                    }
                };
            });

            $scope.openSignInModal = function () {
                $scope.onMyModal.openMyModal($scope.signinModal);
            };

            $scope.closeSignInModal = function () {
                $scope.onMyModal.closeMyModal($scope.signinModal);
            };

            $scope.onMyModal.clearMyModal($scope.signinModal);
            $scope.onMyModal.hideMyModal();

            $scope.addFriFocus = function () {
                $scope.judge.addFriFocusShow = false;
                var topInput = document.getElementById("topInput");
                topInput.focus();
            };

            //    删除和置顶按钮
            $scope.deteFri = function (index) {
                $scope.persons.splice(index, 1);
                window.localStorage['persons'] = JSON.stringify($scope.persons);
                $scope.data.showDelete = false;
                $scope.data.showReorder = false;
                //console.log(angular.element(document).find("button"));
            };

            $scope.topFri = function (index) {
                var item = $scope.persons[index];
                $scope.persons.splice(index, 1);
                $scope.persons.unshift(item);
                window.localStorage['persons'] = JSON.stringify($scope.persons);
                $scope.data.showDelete = false;
                $scope.data.showReorder = false;
            };

            $scope.onTab = function () {
                $scope.showDelete = false;
            };

            $scope.addFriendOut = function () {

            };

            $scope.addFriendIn = function () {
                $scope.$watch('user.friendName', function (newVal, oldVal) {
                    if (newVal != "") {
                        $scope.judge.searchMess = true;
                    } else {
                        $scope.judge.searchMess = false;
                    }
                })
            };

            //    搜索联系人
            $scope.search = function () {
                var flag = false;
                $http.get("searchList.JSON")
                    .success(function (data) {
                        $scope.user.searchName = data.persons;
                        for (var i = 0; i < $scope.user.searchName.length; i++) {
                            if ($scope.user.searchName[i].name == $scope.user.friendName) {
                                flag = true;
                                var item = $scope.user.searchName[i];
                            }
                        }
                        if (flag) {
                            $scope.persons.unshift(item);
                            window.localStorage['persons'] = JSON.stringify($scope.persons);
                            $scope.judge.searchMess = false;
                            $scope.user.friendName = "";
                            alert("添加成功");
                        } else {
                            $scope.judge.searchMess = false;
                            $scope.user.friendName = "";
                            alert("没有搜索到此联系人");
                        }
                    })
                    .error(function () {
                        console.log('error');
                    })
            };
        }])

    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('wechat', {
                url: '/wechat',
                //cache: false,
                templateUrl: 'template/WeChat.html'
            })
            .state('addressBook', {
                url: '/addressBook',
                //cache: false,
                templateUrl: 'template/address-book.html'
            })
            .state('find', {
                url: '/find',
                //cache: false,
                templateUrl: 'template/find.html'
            })
        $urlRouterProvider.otherwise('/wechat');

    }])
