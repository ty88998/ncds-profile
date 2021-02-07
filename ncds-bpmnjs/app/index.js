
import $ from 'jquery';
import Cookies from 'js-cookie'
import BpmnModeler from 'bpmn-js/lib/Modeler';
//import propertiesPanelModule from '../resources/properties-panel';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '../resources/properties-panel/provider/activiti';
import activitiModdleDescriptor from '../resources/activiti.json';
import customTranslate from '../resources/customTranslate/customTranslate';
import customControlsModule from '../resources/customControls';
import tools from '../resources/tools'
import diagramXML from '../resources/newDiagram.bpmn';
const proHost = window.location.protocol + "//" + window.location.host;
const href = window.location.href.split("bpmnjs")[0];
const key = href.split(window.location.host)[1];
const publicurl = proHost + key;
const token_ = Cookies.get('Admin-Token');
// 添加翻译组件
var customTranslateModule = {
    translate: ['value', customTranslate]
};
var container = $('#js-drop-zone');
var canvas = $('#js-canvas');
var bpmnModeler = new BpmnModeler({
    container: canvas,
    propertiesPanel: {
        parent: '#js-properties-panel'
    },
    additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        customControlsModule,
        customTranslateModule
    ],
    moddleExtensions: {
        activiti:activitiModdleDescriptor
    }
});
container.removeClass('with-diagram');
// 判断浏览器支持程度
if (!window.FileList || !window.FileReader) {
    window.alert('请使用谷歌、火狐、IE10+浏览器');
} else {
    tools.registerFileDrop(container, tools.createDiagram(diagramXML, bpmnModeler, container));
}


$(function () {
    // 创建bpmn
    var param = tools.getUrlParam(window.location.href)
        $('.item').show()
    if(param === undefined) return //如果没有传参，后面的js都不走了
    if (param.type === 'addBpmn') {
        tools.createDiagram(diagramXML, bpmnModeler, container);
    } else if (param.type === 'lookBpmn') { //编辑bpmn
        $('.item').hide()
        $('.download').show()
        const Id = param.deploymentFileUUID || '6d4af2dc-bab0-11ea-b584-3cf011eaafca'
        const Name=param.deploymentName || 'String.bpmn'
        const instanceId=param.instanceId
        var param={
            "deploymentId":Id,
            "resourceName":decodeURI(Name)
        }
        if(instanceId){
            var param1={
                instanceId
            }
            $.ajax({
                url: localStorage.getItem("VUE_APP_BASE_API")+'/ncdscenter/activitiHistory/gethighLine',
                // url: 'http://localhost:8080/activitiHistory/gethighLine',
                type: 'GET',
                data: param1,
                dataType:'json',
                headers: {Authorization: "Bearer " + token_},
                success: function (result) {
                  console.log(result)
                  var ColorJson=tools.getByColor(result.data)
                    $.ajax({
                        url: localStorage.getItem("VUE_APP_BASE_API")+'/ncdscenter/processDefinition/getDefinitionXML',
                        // url: 'http://localhost:8080/processDefinition/getDefinitionXML',
                        type: 'GET',
                        data: param,
                        dataType:'text',
                        headers: {Authorization: "Bearer " + token_},
                        success: function (result) {
                            var newXmlData = result
                            tools.createDiagram(newXmlData, bpmnModeler, container);
                            setTimeout(function () {
                                for (var i in ColorJson) {
                                    tools.setColor(ColorJson[i],bpmnModeler)
                                }
                            }, 200)
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }else{
            //加载后台方法获取xml
            $.ajax({
                url: localStorage.getItem("VUE_APP_BASE_API")+'/ncdscenter/processDefinition/getDefinitionXML',
              // url: 'http://localhost:8080/processDefinition/getDefinitionXML',
                type: 'GET',
                data: param,
                dataType:'text',
                headers: {Authorization: "Bearer " + token_},
                success: function (result) {
                    var newXmlData = result
                    tools.createDiagram(newXmlData, bpmnModeler, container);
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    } else if(param.type === "historyBpmn") { // bpmn历史
        $('.item').hide()
        $('.download').show()
    }
    // 点击新增
    $('#js-download-diagram').on("click", function () {
       tools.syopen('alert')
    })

    // 点击取消
    $('.cancel').on("click",function () {
        tools.syhide('alert')
    })
    // 点击确定
    $('#sure').on('click',function(){
       // const text=$("#deploymentName").val()
        tools.saveBpmn(bpmnModeler)
    })



    // 点击下载
    $("#downloadBpmn").on("click", function () {
        tools.downLoad(bpmnModeler)
    })
    // 点击上传
    $("#uploadFile").on("change", function () {
        tools.upload(bpmnModeler,container)
    })
});
