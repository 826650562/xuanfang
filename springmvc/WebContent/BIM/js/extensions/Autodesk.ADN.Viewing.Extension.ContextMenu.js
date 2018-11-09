///////////////////////////////////////////////////////////////////////////////
// ContextMenu viewer extension
// by Philippe Leefsma, October 2014
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");


Autodesk.ADN.Viewing.Extension.ContextMenu = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    var _viewer = viewer;

    var _selectedId = null;


    _self.load = function () {
        var openInfor = false;
        Autodesk.ADN.Viewing.Extension.AdnContextMenu = function (viewer) {
            Autodesk.Viewing.Extensions.ViewerObjectContextMenu.call(this, viewer);
        };

        Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype =
          Object.create(Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype);

        Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.constructor =
          Autodesk.ADN.Viewing.Extension.AdnContextMenu;

        Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.buildMenu =

          function (event, status) {
              var menu =  Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype.buildMenu.call(
                this, event, status);

              if(_selectedId) {
                  menu.push({
                      title: "选中的 [dbId: " + _selectedId + "]",
                      target: function () {
                          alert('Awesome node [' + _selectedId + '] was selected!');
                      }
                  });
              }

              if(options.hasInfoWindow){

                  if(openInfor){
                      menu.push({
                          title: "关闭查看属性",
                          target: function () {
                              openInfor = false;
                              $("#info_label").hide(300);
                              window.obj.bol = openInfor;
                          }
                      })
                  }else{
                      menu.push({
                          title: "开启查看属性",
                          target: function () {
                              openInfor = true;
                              window.obj.bol = openInfor;
                          }
                      })
                   }

              }

              return menu;
          };

        _viewer.setContextMenu(
          new Autodesk.ADN.Viewing.Extension.AdnContextMenu(_viewer));

        _viewer.addEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          _self.onItemSelected);

        console.log('Autodesk.ADN.Viewing.Extension.ContextMenu loaded');

        return true;
    };

    _self.unload = function () {

        _viewer.setContextMenu(
          new Autodesk.Viewing.Extensions.ViewerObjectContextMenu(viewer)
        );

        _viewer.removeEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          _self.onItemSelected);

        console.log('Autodesk.ADN.Viewing.Extension.ContextMenu unloaded');

        return true;
    };

    ///////////////////////////////////////////////////////////////////////////
    // item selected callback
    //
    ///////////////////////////////////////////////////////////////////////////
    _self.onItemSelected = function (event) {

        //var dbId = event.dbIdArray[0];
        if(event.selections.length>0){
            var dbId = event.selections[0].dbIdArray[0];
            _selectedId = dbId;
        }else{
            _selectedId = null;
        }


        /*if (typeof dbId !== 'undefined') {

            _selectedId = dbId;
        }
        else  _selectedId = null;*/
    }
};

Autodesk.ADN.Viewing.Extension.ContextMenu.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.ContextMenu.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.ContextMenu;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.ContextMenu',
  Autodesk.ADN.Viewing.Extension.ContextMenu);