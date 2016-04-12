// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
   if(AdMob) AdMob.createBanner( {
      adId: 'ca-app-pub-2448092600279815/3093672681', 
      position: AdMob.AD_POSITION.BOTTOM_CENTER, 
      autoShow: true 
    } );
  });
})

.controller('addEng', [
    '$scope', 
    'ponchDB',
    '$ionicPopup', 
    function($scope, ponchDB, $ionicPopup) {
    
      // Defind
      $scope.saveAdd = {};
       
      ponchDB.getData($scope);
    
      $scope.add = function() {
           $ionicPopup.show({
               template: 'Word: <input type="text" ng-model="saveAdd.word"><br/>Translate: <input type="text" ng-model="saveAdd.translate">',
               title: 'เพิ่มคำใหม่',
               subTitle: 'ใส่ช่องว่างให้ครบทุกช่อง',
               scope: $scope,
               buttons: [
                   { text: 'Cancle' },
                   {
                       text: '<b>Save</b>',
                       type: 'button-positive',
                       onTap: function(e){
                           ponchDB.addData($scope, $scope.saveAdd.word, $scope.saveAdd.translate);
                       }
                   }
               ]
           }); 
           ponchDB.getData($scope);
           $scope.saveAdd = {};
      };
      
      $scope.show = function(id) {
          ponchDB.showData(id, $scope);
      }
      
      $scope.delete = function(id) {
          ponchDB.deleteData(id, $scope);
      };    
}])

.factory('ponchDB', ['$cordovaDialogs', function($cordovaDialogs) {
    
    var db = new PouchDB('english');
    
    function allDatas($scope) {
        db.allDocs({
            include_docs: true
        }).then(function(data) {
            console.log(JSON.stringify(data.rows));
            $scope.datas = data;
            $scope.$apply();
      });
    }
    
    return {
        getData: function($scope) {
             allDatas($scope);
        },
        addData: function($scope, word, translate) {
            
            var i = 0;
            
            // Loop Check length for id
            db.allDocs({
                include_docs: true
            }).then(function(data) {
                i = "doc" + data.rows.length;
                
                // Add to Data
                db.put({
                    _id: i,
                    word: word,
                    translate: translate,
                }).then(function(data) {
                    allDatas($scope);
                });
                
                
            });
        },
        showData: function(id, $scope) {
            
           db.get(id).then(function(data) {  
              navigator.notification.alert(data.translate, '', data.word + ' แปลว่า', 'เรียบร้อย');
           });  
        },
        deleteData: function(id, $scope) {
            db.get(id).then(function(data) {
                return db.remove(data);
            }).then(function() {
                allDatas($scope);  
                console.log("Delete Success");
            });
        }
    }
}])