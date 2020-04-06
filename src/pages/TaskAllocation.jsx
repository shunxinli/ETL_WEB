import React, { Component } from 'react';
import { Tree ,Row,Col,Table,Icon,Modal,Form,Input,Radio,Spin,Button,message,TreeSelect,Menu,Dropdown,Steps,Select,Popover,Result} from 'antd';
import {changeStr} from '@/utils/utils' //公用组件
import { connect } from 'dva';
let sHeight = document.body.offsetHeight - 100;

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

class TaskAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showModal: false,
            TreeModal: false,
            title:'',
            Treetitle:'',
            systemMask:false,
            showTask:"stateLess",
            taskUplod:"",
            selectedKeys: [],
            selectedInfo:{},
            current:0,
            DRCData:{},
            RSCData:{},
            WSCData:{},
            theDisabled: false,
            theRSCDisabled: false,
            theDiled: false,
            cPdataRef:{},
            ReadType:"",
            WriteType:"",
            theDismask:false,
            cParamVisible:false,

         }
    }
    
    onSelect=(selectedKeys,Info)=>{
        console.log(selectedKeys,Info);
        if(selectedKeys[0]){
        console.log(Info.node.props.dataRef, '当前节111111111点内容')
          this.setState({
            selectedKeys,
            selectedInfo:Info
          },()=>{
            if(this.state.selectedInfo.node.props.dataRef.nLevel==''||this.state.selectedInfo.node.props.dataRef.nLevel==null){
              if(this.state.showTask==="start"){
                message.warning("当前正在查看/增加一个任务！",4)
                return
              }
              this.showUpdateModal()
            }else{
             this.closeTheCreat()
            }
          })
        }
    }
    componentDidMount(){
        let {dispatch} =this.props
        let datas={}
        dispatch(
          {
            type:'TaskAllocationModel/getTreeData',
            payload: {datas}
         }
        )
        dispatch(
          {
            type:'TaskAllocationModel/getOnlyBusinessTree',
            payload: {datas}
         }
        )
       
    }
    closeTheCreat=()=>{
      this.setState({
        taskUplod:"",
        DRCData:{},
        RSCData:{},
        WSCData:{},
        showTask:"stateLess",
        theDiled:false,
        theDismask:false,
        theRSCDisabled:false,
        current:0
      })
    }
    showModal=()=>{
        this.setState({
            showModal:true,
            title:'新建'
        },()=>{
        })
      }
    showExport=()=>{
        this.setState({
            showModal:true,
            title:'编辑'
        },()=>{
            console.log(111)
        })
      }
    onCancel=()=>{
        const form = this.form;
        form.resetFields();
        this.setState({
            showModal:false,
            title:''
        });
      }
    onCreate=()=>{
        const form = this.form;
        form.validateFields((err, values) => {
          console.log(err,values)
          if (err) {
            return;
          }
        })
      }
    saveFormRef = (form) => {
        this.form = form;
      }
    showAddModal=(show)=>{
        let {selectedInfo} = this.state
        if (show) {
          this.setState({
            TreeModal:true,
            systemMask:true,
            Treetitle:'新增系统',
          })
          return
        }
        if (!selectedInfo.selected) {
          message.warning("请选择一个所属系统或库",4)
          return
        }
        if(selectedInfo.node.props.dataRef.nLevel==''||selectedInfo.node.props.dataRef.nLevel==null){
          message.warning("选择了一个任务不能进行新建模块",4)
          return
        }
        this.setState({
          TreeModal:true,
          Treetitle:'新增',
          cPdataRef:{
            nLevel:selectedInfo.node.props.dataRef.nLevel,
          }
        },()=>{
          const form = this.form1;
          form.setFieldsValue({
            cPid:selectedInfo.node.props.dataRef.cId,
         })
        })
      }
    showUpdateModal=()=>{
        let {selectedInfo} = this.state
        if (!selectedInfo.selected) {
          message.warning("请选择一个所属系统或库",4)
          return
        }
        console.log(selectedInfo.node.props.dataRef.nLevel)
        if (selectedInfo.node.props.dataRef.nLevel==1) {
          this.setState({
            TreeModal:true,
            systemMask:true,
            Treetitle:'编辑',
          })
          const form = this.form1;
          form.setFieldsValue({
            cName:selectedInfo.node.props.title,
         })
        }else if(selectedInfo.node.props.dataRef.nLevel==''||selectedInfo.node.props.dataRef.nLevel==null){
            let {dispatch} = this.props
            let {selectedInfo} = this.state
            if (!selectedInfo.selected) {
              message.warning("请选择一个所属系统或库",4)
              return
            }
            const datas = {
              // cBusinessId: selectedInfo.node.props.dataRef.cId
            }
            const callback =()=>{}
             //查询前置任务列表
            dispatch({type: 'TaskAllocationModel/getQueryTreeList', payload: { datas,callback}});
            //查询一次性写入大小
            dispatch({type: 'TaskAllocationModel/getDataxBatchSize', payload: { datas,callback}});
            //获取一次性写入速率
            dispatch({type: 'TaskAllocationModel/getDataxByte', payload: { datas,callback}});
            //获取线程数
            dispatch({type: 'TaskAllocationModel/getDataxChannel', payload: { datas,callback}});
            //获取读取行数
            dispatch({type: 'TaskAllocationModel/getDataxRecord', payload: { datas,callback}});
            //获取文件类型
            dispatch({type: 'TaskAllocationModel/getHdfsReadFileType', payload: { datas,callback}});
            //获取编码
            dispatch({type: 'TaskAllocationModel/getHdfsEncoding', payload: { datas,callback}});
            //获取数据源
            dispatch({type: 'TaskAllocationModel/getTDatasourceNoPageList', payload: { datas,callback}});
            //获取文件类型
            dispatch({type: 'TaskAllocationModel/getHafsWriteFieType', payload: { datas,callback}});
            
            const taskData = {
              taskId:selectedInfo.node.props.dataRef.cId
            }
          
             const taskcallback =()=>{
              this.setState({
                taskUplod:"编辑",
                showTask:"start"
              },()=>{
                let {SingleJson} = this.props
                const DRCform = this.DRCform;
                DRCform.setFieldsValue({
                  cBusinessName: SingleJson.tTaskConfig.cBusinessName,
                  preTaskIds:SingleJson.tTaskConfig.preTaskIds?SingleJson.tTaskConfig.preTaskIds.split(","):null,
                  cName:SingleJson.tTaskConfig.cName,
                  nIfActivate: SingleJson.tTaskConfig.nIfActivate,
                  nIfInvalid: SingleJson.tTaskConfig.nIfInvalid,
                  nLogRetainTime: SingleJson.tTaskConfig.nLogRetainTime,
                  nBatchSize:  SingleJson.tExtractionRuleConfig.nBatchSize,
                  nChannel:  SingleJson.tExtractionRuleConfig.nChannel,
                  nByte:  SingleJson.tExtractionRuleConfig.nByte,
                  nRecord:  SingleJson.tExtractionRuleConfig.nRecord,
                  nIfSchedule: SingleJson.tExtractionRuleConfig.nIfSchedule,
                })
                if(SingleJson.tExtractionRuleConfig.nIfSchedule==1){
                  this.setState({
                    theDisabled:true
                  },()=>{
                    DRCform.setFieldsValue({
                      cCron: SingleJson.tExtractionRuleConfig.cCron
                    })
                  })
                }
              })
            }
            //查询数据信息
            dispatch({type: 'TaskAllocationModel/querySingleJson', payload:{taskData,taskcallback}})
        }else {
          this.setState({
            TreeModal:true,
            Treetitle:'编辑',
            cPdataRef:{
              nLevel:selectedInfo.node.props.dataRef.nLevel,
            }
          })
          const form = this.form1;
          form.setFieldsValue({
            cName:selectedInfo.node.props.title,
            cPid:selectedInfo.node.props.dataRef.cPid,
         })
        }
      }
    onDeleteTree=()=>{
        let {selectedInfo} = this.state  
        let {dispatch} = this.props
        if (!selectedInfo.selected) {
          message.warning("请选择一个删除对象！",4)
          return
        }
        if (selectedInfo.node.props.dataRef.nLevel==''||selectedInfo.node.props.dataRef.nLevel==null) {
          null
        }else{
          if (!selectedInfo.node.props.dataRef.childrenList.length==0) {
            message.warning("此删除对象包含模块或任务，不可直接删除！",4)
            return
          }
        }
       
      
        Modal.confirm({
          title: "操作",
          content: "确定删除吗？",
          okText:"确认",
          cancelText:"取消",
          onOk: () => {
            const datas = {
              cIdList: selectedInfo.node.props.dataRef.cId
            }
            const callback =()=>{
              this.setState({
                showTask:"stateLess",
                DRCData:{},
                RSCData:{},
                WSCData:{},
                taskUplod:"",
                theDiled:false,
                theRSCDisabled:false,
                current:0
              })
              dispatch(
                {
                  type:'TaskAllocationModel/getTreeData',
                  payload: {datas}
               }
              )
              dispatch(
                {
                  type:'TaskAllocationModel/getOnlyBusinessTree',
                  payload: {datas}
               }
              )
            }
            if (selectedInfo.node.props.dataRef.nLevel==''||selectedInfo.node.props.dataRef.nLevel==null) {
              dispatch({type: 'TaskAllocationModel/deleteTask', payload: { datas,callback}});
            } else {
              dispatch({type: 'TaskAllocationModel/deleteTree', payload: { datas,callback}});
            }
          }
        });
       
      }
    onTreeCancel=()=>{
        const form = this.form1;
        form.resetFields();
        this.setState({
          TreeModal:false,
          Treetitle:'',
          systemMask:false,
        });
      }
    onTreeCreate=()=>{
        let {systemMask,Treetitle,selectedInfo,cPdataRef} = this.state
        let {dispatch} = this.props
        const form = this.form1;
        form.validateFields((err, values) => {
          console.log(err,values,systemMask,Treetitle,selectedInfo,cPdataRef)
          if (err) {
            return;
          }
          const callback =()=>{
            this.setState({
              TreeModal:false,
              Treetitle:'',
              systemMask:false,
              cPdataRef:{}
            });
            const form = this.form1;
            form.resetFields();
            const datas = {}
            dispatch(
              {
                type:'TaskAllocationModel/getTreeData',
                payload: {datas}
             }
            )
            dispatch(
              {
                type:'TaskAllocationModel/getOnlyBusinessTree',
                payload: {datas}
             }
            )
          }
          let valuedata=changeStr(values)
          if (Treetitle=="编辑") {
           
                if(systemMask){
                  const datas = {
                    ...valuedata,
                    cId: selectedInfo.node.props.dataRef.cId
                }
                  console.log(datas)
                  dispatch({type: 'TaskAllocationModel/updateTree', payload: { datas,callback}});
                }else{
                  const datas = {
                    ...valuedata,
                    nLevel:cPdataRef.nLevel?cPdataRef.nLevel:selectedInfo.node.props.dataRef.nLevel,
                    cId: selectedInfo.node.props.dataRef.cId
                  }
                  dispatch({type: 'TaskAllocationModel/updateTree', payload: { datas,callback}});
                }
          }else {
                    if(systemMask){
                      const datas = {
                        ...valuedata
                      }
                      dispatch({type: 'TaskAllocationModel/createTree', payload: { datas,callback}});
                    }else{
                      const datas = {
                        ...valuedata,
                        nLevel:cPdataRef.nLevel?cPdataRef.nLevel:selectedInfo.node.props.dataRef.nLevel,
                      }
                      dispatch({type: 'TaskAllocationModel/createTree', payload: { datas,callback}});
                    }
          }
        })
        
    }
    oncParamshowModel=()=>{
      this.setState({
        cParamVisible:true,
      })
    }
    oncParamCancel=()=>{
      const form = this.cParamform;
      form.resetFields();
      this.setState({
        cParamVisible:false,
      });
    }
    oncParamCreate=()=>{
      const form = this.cParamform;

    }
    saveTreeFormRef = (form) => {
        this.form1 = form;
    }
    saveDRCFormRef= (form) => {
      this.DRCform = form;
    }
    saveRSCFormRef= (form) => {
        this.RSCform = form;
    }
    saveWSCFormRef= (form) => {
      this.WSCform = form;
    }
    savecParamFormRef= (form) => {
      this.cParamform = form;
    }
    next=()=> {
        let {current,taskUplod} = this.state
        let {SingleJson} = this.props
        
        console.log(
          current
        )
        if (current==0) {
          const DRCform = this.DRCform;
          DRCform.validateFields((err, values) => {
            console.log(err,values)
            if (err) {
              return;
            }
            let valuedata=changeStr(values)
            console.log(valuedata)

            this.setState({ current:1 ,DRCData:valuedata,theDisabled:false},()=>{
              this.setState({
                theDismask:this.state.DRCData.nIfSchedule==1?true:false
              })
              if (taskUplod=='编辑') {
                const RSCform = this.RSCform;
                let newvalue= SingleJson.tReadConfig.dbReadType
                if (newvalue==6) {
                  this.setState({ theRSCDisabled:true },()=>{
                    RSCform.setFieldsValue({
                      cDatasourceId: SingleJson.tReadConfig.cDatasourceId,
                      cReadSqlMain: SingleJson.tReadConfig.cReadSqlMain,
                      cParam:SingleJson.tReadConfig.cParam,
                      cFilePath:SingleJson.tReadConfig.cFilePath,
                      cFileType: SingleJson.tReadConfig.cFileType,
                      cFieldDelimiter: SingleJson.tReadConfig.cFieldDelimiter,
                      cEncoding: SingleJson.tReadConfig.cEncoding,
                    })
                  });
                }else{
                  this.setState({ theRSCDisabled:false },()=>{
                    RSCform.setFieldsValue({
                      cDatasourceId: SingleJson.tReadConfig.cDatasourceId,
                      cReadSqlMain: SingleJson.tReadConfig.cReadSqlMain,
                      cParam:SingleJson.tReadConfig.cParam,
                    })
                  });
                } 
              
              }
            });
          })
          
        } else if (current==1) {
          const RSCform = this.RSCform;
          RSCform.validateFields((err, values) => {
            console.log(err,values)
            if (err) {
              return;
            }
            let valuedata=changeStr(values)
            let datas={
              sql:valuedata.cReadSqlMain
            }
            console.log(valuedata,datas)
            const callback=()=>{
              this.setState({ current:2 ,RSCData:valuedata,},()=>{
                if (taskUplod=='编辑') {
                  const WSCform = this.WSCform;
                  let newvalue= SingleJson.tWriteConfig.dbWriteType
                  if (newvalue==6) {
                    this.setState({ theDiled:true },()=>{
                      WSCform.setFieldsValue({
                        cDatasourceId: SingleJson.tWriteConfig.cDatasourceId,
                        cTabName:  SingleJson.tWriteConfig.cTabName,
                        cPreSql: SingleJson.tWriteConfig.cPreSql,
                        cPostSql:  SingleJson.tWriteConfig.cPostSql,
                        cFieldOrder: SingleJson.tWriteConfig.cFieldOrder,
                        cFileType:  SingleJson.tWriteConfig.cFileType,
                        cFilePath:  SingleJson.tWriteConfig.cFilePath,
                        cFieldDelimiter:  SingleJson.tWriteConfig.cFieldDelimiter,
                        cWriteMode: SingleJson.tWriteConfig.cWriteMode,
                        cCompress:  SingleJson.tWriteConfig.cCompress,

                      })
                    });
                  }else{
                    this.setState({ theDiled:false },()=>{
                      WSCform.setFieldsValue({
                        cDatasourceId: SingleJson.tWriteConfig.cDatasourceId,
                        cTabName:  SingleJson.tWriteConfig.cTabName,
                        cPreSql: SingleJson.tWriteConfig.cPreSql,
                        cPostSql:  SingleJson.tWriteConfig.cPostSql,
                        cFieldOrder: SingleJson.tWriteConfig.cFieldOrder,
                        // cFileType:  SingleJson.tWriteConfig.cFileType,
                        // cFilePath:  SingleJson.tWriteConfig.cFilePath,
                        // cFieldDelimiter:  SingleJson.tWriteConfig.cFieldDelimiter,
                        cWriteMode: SingleJson.tWriteConfig.cWriteMode,
                        cCompress:  SingleJson.tWriteConfig.cCompress,
                      })
                    });
                  } 
                  
                }
              })
            }
            this.props.dispatch({type:'TaskAllocationModel/getSplitSqlCol', payload: { datas,callback}});
          })
          
        }
      }
    
    prev=()=> {
       let {current,DRCData,RSCData} = this.state
        console.log(
          current
        )
        if (current==1) {
          this.setState({ current:0 },()=>{
            const DRCform = this.DRCform;
            DRCform.setFieldsValue({
              cBusinessName: DRCData.cBusinessName,
              preTaskIds:DRCData.preTaskIds,
              cName:DRCData.cName,
              nIfActivate: DRCData.nIfActivate,
              nIfInvalid: DRCData.nIfInvalid,
              nIfSchedule:  DRCData.nIfSchedule,
              nBatchSize:  DRCData.nBatchSize,
              nChannel:  DRCData.nChannel,
              nByte:  DRCData.nByte,
              nRecord:  DRCData.nRecord,
              nLogRetainTime: DRCData.nLogRetainTime,
            })
            if(DRCData.nIfSchedule==1){
              this.setState({
                theDisabled:true
              },()=>{
                DRCform.setFieldsValue({
                  radioCycle: DRCData.radioCycle,
                  radioGroup: DRCData.radioGroup,
                  month: DRCData.month,
                  day: DRCData.day,
                  hour:DRCData.hour,
                  minute: DRCData.minute,
                  cCron: DRCData.cCron
                })
              })
              
             
            }
          })
        } else if (current==2) {
          this.setState({ current:1},()=>{
            const RSCform = this.RSCform;
            console.log(RSCData)
            let newvalue=this.state.theRSCDisabled?"6":"0"
            if (newvalue=='6') {
              this.setState({ theRSCDisabled:true },()=>{
                RSCform.setFieldsValue({
                  cDatasourceId: RSCData.cDatasourceId,
                  cReadSqlMain: RSCData.cReadSqlMain,
                  cParam:RSCData.cParam,
                  cFilePath:RSCData.cFilePath,
                  cFileType: RSCData.cFileType,
                  cFieldDelimiter: RSCData.cFieldDelimiter,
                  cEncoding: RSCData.cEncoding,
                })
              });
            }else{
              this.setState({ theRSCDisabled:false },()=>{
                RSCform.setFieldsValue({
                  cDatasourceId: RSCData.cDatasourceId,
                  cReadSqlMain: RSCData.cReadSqlMain,
                  cParam:RSCData.cParam,
                  // cFilePath:RSCData.cFilePath,
                  // cFileType: RSCData.cFileType,
                  // cFieldDelimiter: RSCData.cFieldDelimiter,
                  // cEncoding: RSCData.cEncoding,
                })
              });
            } 
            
          });

        }
      }
    showTaskModal=()=>{
        let {dispatch} = this.props
        let {selectedInfo} = this.state
        if (!selectedInfo.selected) {
          message.warning("请选择一个所属系统或库",4)
          return
        }
        if(selectedInfo.node.props.dataRef.nLevel==''||selectedInfo.node.props.dataRef.nLevel==null){
          message.warning("选择了一个任务不能进行新建任务",4)
          return
        }
        const datas = {
          // cBusinessId: selectedInfo.node.props.dataRef.cId
        }
        const callback =()=>{}
        console.log(datas)
        //查询前置任务列表
        dispatch({type: 'TaskAllocationModel/getQueryTreeList', payload: { datas,callback}});
        //查询一次性写入大小
        dispatch({type: 'TaskAllocationModel/getDataxBatchSize', payload: { datas,callback}});
        //获取一次性写入速率
        dispatch({type: 'TaskAllocationModel/getDataxByte', payload: { datas,callback}});
        //获取线程数
        dispatch({type: 'TaskAllocationModel/getDataxChannel', payload: { datas,callback}});
        //获取读取行数
        dispatch({type: 'TaskAllocationModel/getDataxRecord', payload: { datas,callback}});
        //获取文件类型
        dispatch({type: 'TaskAllocationModel/getHdfsReadFileType', payload: { datas,callback}});
         //获取编码
        dispatch({type: 'TaskAllocationModel/getHdfsEncoding', payload: { datas,callback}});
        //获取数据源
        dispatch({type: 'TaskAllocationModel/getTDatasourceNoPageList', payload: { datas,callback}});
        //获取文件类型
        dispatch({type: 'TaskAllocationModel/getHafsWriteFieType', payload: { datas,callback}});
        
        this.setState({
          showTask:"start"
        },()=>{
          const DRCform = this.DRCform;
          DRCform.setFieldsValue({
            cBusinessName:selectedInfo.node.props.dataRef.cName
          })
        })
      }  
    submitFrom=()=>{
      let {dispatch,SingleJson} = this.props
      let {selectedInfo,DRCData,RSCData,taskUplod} = this.state
      this.setState({
        showTask:"load"
      })
      const WSCform = this.WSCform;
      WSCform.validateFields((err, values) => {
        console.log(err,values)
        if (err) {
          return;
        }
        let valuedata=changeStr(values)
        console.log(valuedata,DRCData,RSCData,'所有数据')
        this.setState({WSCData:valuedata});
        const callback =(mark)=>{
          if(mark==="SUC"){
            console.log('成功')
            this.setState({
              showTask:"suc",
              DRCData:{},
              RSCData:{},
              WSCData:{},
              taskUplod:"",
              theDiled:false,
              theRSCDisabled:false,
              theDismask:false,
              current:0
            })
            let datas={}
            dispatch(
              {
                type:'TaskAllocationModel/getTreeData',
                payload: {datas}
             }
            )
            dispatch(
              {
                type:'TaskAllocationModel/getOnlyBusinessTree',
                payload: {datas}
             }
            )
          }else if(mark==="ERR"){
            console.log('失败')
            this.setState({
              showTask:"start",
              current:2
            },()=>{
              let {WSCData}= this.state
              const WSCform = this.WSCform;
              WSCform.setFieldsValue({
                cDatasourceId: WSCData.cDatasourceId,
                cTabName:  WSCData.cTabName,
                cPreSql: WSCData.cPreSql,
                cPostSql:  WSCData.cPostSql,
                cFieldOrder: WSCData.cFieldOrder,
                cFileType:  WSCData.cFileType,
                cFilePath:  WSCData.cFilePath,
                cFieldDelimiter:  WSCData.cFieldDelimiter,
                cWriteMode: WSCData.cWriteMode,
                cCompress:  WSCData.cCompress,
              })
            })
          }
        }
     
        if (taskUplod=='编辑') {
          console.log('dbReadType',this.state.ReadType,SingleJson.tReadConfig.ReadType)
          console.log('dbWriteType',this.state.WriteType,SingleJson.tWriteConfig.WriteType)
          const Thedatas = {
            tTaskConfig:{
              cId:SingleJson.tTaskConfig.cId,
              cPid:SingleJson.tTaskConfig.cPid,
              cBusinessId: SingleJson.tTaskConfig.cBusinessId,//"选择的模块或系统的cId",
              cName: DRCData.cName?DRCData.cName:SingleJson.tTaskConfig.cName,
              nIfActivate: DRCData.nIfActivate==1?DRCData.nIfActivate:0, //是否激活 1是0不是
              nIfInvalid: DRCData.nIfInvalid==1?DRCData.nIfInvalid:0,//是否有效 1 是0不是
              nLogRetainTime: DRCData.nLogRetainTime?DRCData.nLogRetainTime:SingleJson.tTaskConfig.nLogRetainTime,// 日志保留时长
              preTaskIds: DRCData.preTaskIds?DRCData.preTaskIds.join(","):SingleJson.tTaskConfig.preTaskIds//选择的前置任务的cid 多个逗号分开传string
            },
           tExtractionRuleConfig:{
            cId:SingleJson.tExtractionRuleConfig.cId,
            cTaskConfigId:SingleJson.tExtractionRuleConfig.cTaskConfigId,
            nIfSchedule: DRCData.nIfSchedule==1?DRCData.nIfSchedule:0,   //是否定时 1是0不是
            cCron:DRCData.cCron?DRCData.cCron:SingleJson.tExtractionRuleConfig.cCron,  //cron表达式
            nBatchSize: DRCData.nBatchSize?DRCData.nBatchSize:SingleJson.tExtractionRuleConfig.nBatchSize, //-次性写入大小
            nChannel: DRCData.nChannel?DRCData.nChannel:SingleJson.tExtractionRuleConfig.nChannel,      //线程 数
            nByte: DRCData.nByte?DRCData.nByte:SingleJson.tExtractionRuleConfig.nByte,  //读取速率
            nRecord: DRCData.nRecord?DRCData.nRecord:SingleJson.tExtractionRuleConfig.nRecord,  //读取大小
           },   
           tReadConfig:{
            cId:SingleJson.tReadConfig.cId,
            cTaskConfigId:SingleJson.tReadConfig.cTaskConfigId,
            cDatasourceId:RSCData.cDatasourceId?RSCData.cDatasourceId:SingleJson.tReadConfig.cDatasourceId,//"选择的数据源的id",
            cReadSqlMain:RSCData.cReadSqlMain?RSCData.cReadSqlMain:SingleJson.tReadConfig.cReadSqlMain , //写入端的sq1语句
            cParam: RSCData.cParam?RSCData.cParam:SingleJson.tReadConfig.cParam,          //预留参数，先 暂时不传。
            cFilePath: RSCData.cFilePath?RSCData.cFilePath:SingleJson.tReadConfig.cFilePath,        //文件路径
            cFileType: RSCData.cFileType?RSCData.cFileType:SingleJson.tReadConfig.cFileType,      //文件类型
            cFieldDelimiter: RSCData.cFieldDelimiter?RSCData.cFieldDelimiter:SingleJson.tReadConfig.cFieldDelimiter,  //文件分割符
            cEncoding: RSCData.cEncoding?RSCData.cEncoding:SingleJson.tReadConfig.cEncoding,      //编码
            dbReadType: this.state.ReadType!=""?this.state.ReadType:SingleJson.tReadConfig.dbReadType
           },
            tWriteConfig:{
              cId:SingleJson.tWriteConfig.cId,
              cTaskConfigId:SingleJson.tWriteConfig.cTaskConfigId,
              cDbName:SingleJson.tWriteConfig.cDbName,
              cDatasourceId: valuedata.cDatasourceId? valuedata.cDatasourceId:SingleJson.tWriteConfig.cDatasourceId,//"选择的数据源的id",
              cTabName:valuedata.cTabName? valuedata.cTabName:SingleJson.tWriteConfig.cTabName,//"表名",
              cPreSql: valuedata.cPreSql? valuedata.cPreSql:SingleJson.tWriteConfig.cPreSql,   //写入前sq1
              cPostSql:  valuedata.cPostSql? valuedata.cPostSql:SingleJson.tWriteConfig.cPostSql,  //写入后sq1
              cFieldOrder: valuedata.cFieldOrder? valuedata.cFieldOrder:SingleJson.tWriteConfig.cFieldOrder,//字段映射，hdfs的不一样，细节再说
              cWriteMode: valuedata.cWriteMode? valuedata.cWriteMode:SingleJson.tWriteConfig.cWriteMode,//写入方式
              cFilePath:  valuedata.cFilePath? valuedata.cFilePath:SingleJson.tWriteConfig.cFilePath, //文件路径
              cFileType: valuedata.cFileType? valuedata.cFileType:SingleJson.tWriteConfig.cFileType,  //文件类型
              cFieldDelimiter:valuedata.cFieldDelimiter? valuedata.cFieldDelimiter:SingleJson.tWriteConfig.cFieldDelimiter, //文件分割符
              cCompress: valuedata.cCompress? valuedata.cCompress:SingleJson.tWriteConfig.cCompress,     //压缩方式
              dbWriteType: this.state.WriteType!=""?this.state.WriteType:SingleJson.tWriteConfig.dbWriteType
            }
          }
  
          let datas={
            json:JSON.stringify(Thedatas)
          }
          //编辑完成后提交
          dispatch({type: 'TaskAllocationModel/uploadTaskConfig', payload: { datas,callback}});
        }else{
          const Thedatas = {
            tTaskConfig:{
              cBusinessId: selectedInfo.node.props.dataRef.cId,//"选择的模块或系统的cId",
              cName: DRCData.cName?DRCData.cName:null,
              nIfActivate: DRCData.nIfActivate==1?DRCData.nIfActivate:0, //是否激活 1是0不是
              nIfInvalid: DRCData.nIfInvalid==1?DRCData.nIfInvalid:0,//是否有效 1 是0不是
              nLogRetainTime: DRCData.nLogRetainTime?DRCData.nLogRetainTime:"7",// 日志保留时长
              preTaskIds: DRCData.preTaskIds?DRCData.preTaskIds.join(","):null//选择的前置任务的cid 多个逗号分开传string
            },
            tExtractionRuleConfig:{
              nIfSchedule:DRCData.nIfSchedule==1?DRCData.nIfSchedule:0,   //是否定时 1是0不是
              cCron:DRCData.cCron?DRCData.cCron:null,  //cron表达式
              nBatchSize: DRCData.nBatchSize?DRCData.nBatchSize:null, //-次性写入大小
              nChannel: DRCData.nChannel?DRCData.nChannel:"3",      //线程 数
              nByte: DRCData.nByte?DRCData.nByte:"1048576",  //读取速率
              nRecord: DRCData.nRecord?DRCData.nRecord:"10000",  //读取大小
            },
           tReadConfig:{
            cDatasourceId:RSCData.cDatasourceId?RSCData.cDatasourceId:null,//"选择的数据源的id",
            cReadSqlMain:RSCData.cReadSqlMain?RSCData.cReadSqlMain:null , //写入端的sq1语句
            cParam: RSCData.cParam?RSCData.cParam:null,          //预留参数，先 暂时不传。
            cFilePath: RSCData.cFilePath?RSCData.cFilePath:null,        //文件路径
            cFileType: RSCData.cFileType?RSCData.cFileType:"text",      //文件类型
            cFieldDelimiter: RSCData.cFieldDelimiter?RSCData.cFieldDelimiter:null,  //文件分割符
            cEncoding: RSCData.cEncoding?RSCData.cEncoding:"utf-8",      //编码
            dbReadType: this.state.ReadType!=""?this.state.ReadType:1
            },
            tWriteConfig:{
              cDatasourceId: valuedata.cDatasourceId,//"选择的数据源的id",
              cTabName:valuedata.cTabName ,//"表名",
              cPreSql: valuedata.cPreSql ,   //写入前sq1
              cPostSql:  valuedata.cPostSql,  //写入后sq1
              cFieldOrder: valuedata.cFieldOrder,//字段映射，hdfs的不一样，细节再说
              cWriteMode: valuedata.cWriteMode, //写入方式
              cFilePath:  valuedata.cFilePath,  //文件路径
              cFileType: valuedata.cFileType?valuedata.cFileType:"text",  //文件类型
              cFieldDelimiter:valuedata.cFieldDelimiter, //文件分割符
              cCompress: valuedata.cCompress,     //压缩方式
              dbWriteType: this.state.WriteType!=""?this.state.WriteType:1
            }
          }
  
          let datas={
            json:JSON.stringify(Thedatas)
          }
          //完成后提交
          dispatch({type: 'TaskAllocationModel/createTaskConfig', payload: { datas,callback}});
        }
      })
    }    
    closeCreat=()=>{
      this.setState({
        taskUplod:"",
        showTask:"stateLess"
      })
    }
    goCreat=()=>{
      let {selectedInfo} = this.state
      if (!selectedInfo.selected) {
          message.warning("请选择一个所属系统或库",4)
          return
        }
      this.setState({
        showTask:"start"
      },()=>{
        const DRCform = this.DRCform;
        DRCform.setFieldsValue({
          cBusinessName:selectedInfo.node.props.dataRef.cName
        })
      })
    }
    
    render() {
      const { current,showTask,cParamVisible} = this.state;
      const { treeFlag,treeData,QueryTreeList,BatchSize,Byte,Channel,Record,TasKData,HdfsEncod,HdfsFileTypeData,TDatasourceNoPageList,QueryTableList
        ,HafsWriteFieType,QueryWriteCompress,QueryWriteMode,
        cParamData,
        BusinessTreeData
      } = this.props;
      
        const loop = data =>
        data.map(item => {
          if (item.childrenList && item.childrenList.length) {
            return (
              <TreeNode key={item.cId} title={item.cName} dataRef={item}>
                {loop(item.childrenList)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.cId} title={item.cName} dataRef={item}/>;
        });
        const menu = (
          <Menu>
            <Menu.Item>
              <a onClick={()=>{this.showAddModal(false)}}>
                模块
              </a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={()=>{this.showTaskModal()}}>
                任务
              </a>
            </Menu.Item>
          </Menu>
        );
        const steps = [
          {
            title: '依赖及规则配置',
            content:<div style={{height:sHeight-100,overflowY:"auto",padding:10}}>
              第一步内容
              <DRCModel
              selectedInfo={this.state.selectedInfo}
              QueryTreeList={QueryTreeList}
              BatchSize={BatchSize}
              Byte={Byte}
              Channel={Channel}
              Record={Record}
              TasKData={TasKData}
              dispatch={this.props.dispatch}
              ref={this.saveDRCFormRef}
              thisObj={this}
              theDisabled={this.state.theDisabled}
              />
            </div>,
          },
          {
            title: '读取端配置',
            content: <div style={{height:sHeight-100,overflowY:"auto",padding:10}}>
            第二步内容
            <RSCModel
              ref={this.saveRSCFormRef}
              HdfsEncod={HdfsEncod}
              HdfsFileTypeData={HdfsFileTypeData}
              thisObj={this}
              theRSCDisabled={this.state.theRSCDisabled}
              theDismask={this.state.theDismask}
              TDatasourceNoPageList={TDatasourceNoPageList}
            />

          </div>,
          },
          {
            title: '写入端配置',
            content: <div style={{height:sHeight-100,overflowY:"auto",padding:10}}>
            第三步内容
            <WSCModel
              ref={this.saveWSCFormRef}
              TDatasourceNoPageList={TDatasourceNoPageList}
              dispatch={this.props.dispatch}
              QueryTableList={QueryTableList}
              HafsWriteFieType={HafsWriteFieType}
              QueryWriteCompress={QueryWriteCompress}
              QueryWriteMode={QueryWriteMode}
              thisObj={this}
              theDiled={this.state.theDiled}
              oncParamshowModel={this.oncParamshowModel}
              />
          </div>,
          },
        ];
     
        return ( 
            <div style={{paddingLeft:30,paddingRight:30}}>
                <Row>
                    <Col span={5} style={{float:"left",height:sHeight,background:'#fff'}}>
                          <div style={{float:'right',marginTop:8}}>
                                <Dropdown overlay={menu} placement="bottomLeft">
                                  <Button size="small">新增</Button>
                                </Dropdown>
                                <span><Button onClick={this.showUpdateModal} size="small" >编辑</Button></span>
                                <span><Button onClick={this.onDeleteTree} size="small" >删除</Button></span>
                          </div>
                          {treeFlag?
                              <div style={{ marginTop: 32 ,height:sHeight-60,overflowY:"auto", }}>
                                    <Tree className="draggable-tree"
                                    onSelect={this.onSelect}
                                    treeDefaultExpandAll
                                    >
                                        {loop(treeData)}
                                    </Tree>      
                              </div>
                            :<div style={{textAlign:'center',height:sHeight-60}}>
                            <Spin />
                             
                          </div> }
                         <div style={{textAlign:'center'}}>
                                <a className='addBtn' type="primary" onClick={()=>{this.showAddModal(true)}}><Icon type="plus" />新建系统</a>
                        </div> 
                    </Col>
                  
                    <Col span={18} style={{float:"right",height:sHeight,background:'#fff'}}>
                        {/* <div style={{height:38,width:'100%'}}>
                            <div style={{float:'right'}}>
                                <div style={{marginRight:20,display:'inline-block'}}>
                                    <a className='addBtn' type="primary" onClick={this.showModal}><Icon type="plus" />新建</a>
                                </div>
                                <div style={{marginRight:20,display:'inline-block'}}>
                                    <a className='updateBtn' type="primary" onClick={this.showExport}><Icon type="edit" />编辑</a>
                                </div>
                                <div style={{marginRight:20,display:'inline-block'}}>
                                    <a className='deleBtn' type="primary" onClick={this.delet}><Icon type="delete" />删除</a>
                                </div>
                            </div>
                        </div> */}
                        {showTask=="start"?
                           <div style={{margin:20}}>
                              <Steps current={current}>
                                {steps.map(item => (
                                  <Step key={item.title} title={item.title} />
                                ))}
                              </Steps>
                              <div className="steps-content">{steps[current].content}</div>
                              <div className="steps-action">
                                {current < steps.length - 1 && (
                                  <Button type="primary" onClick={this.next}>
                                    下一步
                                  </Button>
                                )}
                                  {current ==0 && (
                                  <Button onClick={this.closeTheCreat}>
                                    取消
                                  </Button>
                                )}
                                {current === steps.length - 1 && (
                                  <Button type="primary" onClick={this.submitFrom}>
                                    完成
                                  </Button>
                                )}
                                {current > 0 && (
                                  <Button  onClick={this.prev}>
                                    上一步
                                  </Button>
                                )}
                              </div>
                         </div>
                       : showTask=="suc"?
                       <div style={{margin:20}}>
                          <Result
                            status="success"
                            title="成功!"
                            // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                            extra={[
                              <Button type="primary" key="console" onClick={this.closeCreat}>
                                关闭
                              </Button>,
                              <Button key="buy" onClick={this.goCreat}>继续新增</Button>,
                            ]}
                          />
                       </div>
                       
                        :showTask=="load"?<div style={{margin:20,textAlign:'center'}}>
                            <Spin />
                          </div>
                        :<div style={{margin:20}}></div>
                       }
                        <TreeModel
                            visible={this.state.TreeModal}
                            title={this.state.Treetitle}
                            onCancel={this.onTreeCancel}
                            onCreate={this.onTreeCreate}
                            ref={this.saveTreeFormRef}
                            systemMask={this.state.systemMask}
                            treeData={treeData}
                            BusinessTreeData={BusinessTreeData}
                            thisObj={this}
                        />
                        <CParamModel
                            title="字段映射"
                            visible={cParamVisible}
                            onCancel={this.oncParamCancel}
                            onCreate={this.oncParamCreate}
                            ref={this.savecParamFormRef}
                            cParamData={cParamData}
                            thisObj={this}
                        />
                    </Col>
                </Row>
            </div> 
        );
    }
}
//字段映射的model

class CParamModel extends React.Component {
  state = {
    value: undefined,
  }
  render(){
    const { visible, onCancel, onCreate, form, title, systemMask, treeData, } = this.props;
    return(
      <Modal
       visible={visible}
       width={500}
       title={title}
       okText="确认"
       onCancel={onCancel}
       onOk={onCreate}
       className="ant-advanced-search-form"
       maskClosable={false}
     >
      <div style={{height:200,overflow:"auto"}}>
      <Form
         className="ant-advanced-search-form"
       >
       </Form>
      </div>
    </Modal>
    )
  }  

}
CParamModel = Form.create()(CParamModel)
 
//树的model
class TreeModel extends React.Component {
  state = {
    value: undefined,
  }
  onSelect=(selectedKeys,Info)=>{
    let {thisObj}=this.props
    console.log(selectedKeys,Info);
    console.log(Info.props.dataRef, '当前节点内容')
    thisObj.setState({
      cPdataRef:Info.props.dataRef
    })
}
  render(){
  const { visible, onCancel, onCreate, form, title, systemMask, treeData,BusinessTreeData } = this.props;
   const { getFieldDecorator } = form;
   const formItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 16 },
   };

   const loop = data =>
   data.map(item => {
     if (item.childrenList && item.childrenList.length) {
       return (
         <TreeNode key={item.cId} title={item.cName} dataRef={item} value={item.cId}>
           {loop(item.childrenList)}
         </TreeNode>
       );
     }
     return <TreeNode key={item.cId} title={item.cName} dataRef={item} value={item.cId} />;
   });
   return (
     <Modal
       visible={visible}
       width={500}
       title={title}
       okText="确认"
       onCancel={onCancel}
       onOk={onCreate}
       className="ant-advanced-search-form"
       maskClosable={false}
     >
      <div style={{height:200,overflow:"auto"}}>
       <Form
         className="ant-advanced-search-form"
       >
       {systemMask?
            <FormItem label="系统名称:" {...formItemLayout}>
            {getFieldDecorator('cName', {
              rules: [{ required: true, message: '请填写系统名称!' }, { message: '请不要输入空白字符！', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
        :
        <div>
            <FormItem label="名称:" {...formItemLayout}>
                    {getFieldDecorator('cName', {
                      rules: [{ required: true, message: '请填写名称!' }, { message: '请不要输入空白字符！', whitespace: true }],
                    })(
                      <Input />
                    )}
             </FormItem>
        
            <FormItem {...formItemLayout} label="上级目录:">
                {getFieldDecorator('cPid', {
                rules: [{ required: true, message: '请选择上级目录！' }, { message: '请不要输入空白字符！', whitespace: true }]
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择上级目录！"
                    allowClear
                    treeDefaultExpandAll
                    onSelect={this.onSelect}
                  >
                     {loop(BusinessTreeData)}
                   </TreeSelect>
                )}
            </FormItem>
        </div>}
       </Form>
       </div>
     </Modal>
   );
 }
}
TreeModel = Form.create()(TreeModel)
//DRCModel第一步
class DRCModel extends React.Component {
  state = {
    value: [],
    cyclevalue:'',
    cyclevalueDisabled:false,
    json:[{rate:'minute',cycle:''},{rate:'hour',cycle:''},{rate:'day',cycle:''},{rate:'month',cycle:''}]
  };

  onChange = value => {
    let {thisObj}=this.props
    console.log(value);
    this.setState({value},()=>{
      if (this.state.value.length==0) {
        thisObj.setState({
          theDisabled:true
      })
      } else {
        thisObj.setState({
          theDisabled:false
      })
      }
    });
  };
  onChangeDisabled=(e)=>{
    let {thisObj}=this.props
    thisObj.setState({
        theDisabled:e.target.value==0?false:true
    })
    if (e.target.value==0) {
      this.props.form.setFieldsValue({
        cCron:''
      })
    } 
}

onChangecycle=(e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      cyclevalue: e.target.value,
    })
}
onChangegroup=(e)=>{
    console.log('radio checked',  e.target.value);
    const Carn ={
        // a:'0 0 0 1 1 ?',
        b:'0 0 0 1 1/1 ?',
        c:'0 0 0 ? * 1',
        d:'0 0 0 1/1 * ?',
        e:'0 0 0/1 * * ?'
    }
    this.setState({
      radiogroupValue: e.target.value
     });
    this.props.form.setFieldsValue({
      cCron: Carn[e.target.value]
    })
}
replacepos=(text,start,stop,replacetext)=>{
     let mystr = text.substring(0,stop-1)+replacetext+text.substring(stop+1);
      return mystr;
}
onChangeTheCustom=(value,type)=>{
    console.log(value,type)
    let {json} = this.state
    if(!value) return
    let newJson = json.map((item,index)=>{
        if(item.rate===type){
          item.cycle=value.toString()
        }
        return item
      })
    this.setState({
      json:newJson
    },()=>{
    })
}
generateCron=()=>{
  console.log()
  let {dispatch} = this.props
  let {cyclevalue} = this.state
  let datas={
    cron: cyclevalue
  }
  console.log(datas)
  let callback =(start)=>{
      this.setState({
        cyclevalue: '',
      })
      if (start==0) {
        this.props.form.setFieldsValue({
          cCron:''
        })
      } 
  }
 
  dispatch({
      type: 'TaskAllocationModel/getvalidCron',
      payload: { datas,callback},
    })
}
  render(){
    let {cyclevalueDisabled}=this.state
    const { selectedInfo, QueryTreeList, BatchSize,Byte,Channel, form, Record, TasKData, theDisabled, } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout2 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const loop = data =>
        data.map(item => {
          if (item.childList && item.childList.length) {
            return (
              <TreeNode key={item.cId} value={item.cId} title={item.cName} >
                {loop(item.childList)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.cId} value={item.cId} title={item.cName}/>;
        });
   return (
   
       <Form
         className="ant-advanced-search-form"
       >
          <FormItem label="所属系统/模块:" {...formItemLayout}>
           {getFieldDecorator('cBusinessName', {
           })(
            <Input disabled/>
           )}
          </FormItem>
          <FormItem {...formItemLayout} label="前置任务:">
              {getFieldDecorator('preTaskIds',{
              // rules: [{ required: true, message: '请选择前置任务' }]
              })(
                <TreeSelect
                    showSearch 
                    style={{ width: "100%" }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择前置任务！"
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    onChange={this.onChange}
                  >
                    {loop(QueryTreeList)}
                  </TreeSelect>
               
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="任务名称:">
              {getFieldDecorator('cName',{
              rules: [{ required: true, message: '请填写名称！' }]
              })(
                <Input/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否激活:">
              {getFieldDecorator('nIfActivate', {
                   initialValue:1,
                   rules: [{ required: true, message: '请选择是否激活!'},]
              })(
                  <Radio.Group name="radiogroup">
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                  </Radio.Group>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="是否生效:">
              {getFieldDecorator('nIfInvalid', {
                initialValue:1,
                  rules: [{ required: true, message: '请选择是否生效!'},]
              })(
                  <Radio.Group name="radiogroup" >
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                  </Radio.Group>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否定时触发" >
                {getFieldDecorator('nIfSchedule',{
                 initialValue:theDisabled?1:0,
                 rules: [{ required: true, message: '请选择是否定时触发!'},]
                })(
                    <Radio.Group  onChange={this.onChangeDisabled} disabled={this.state.value.length==0?false:true}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                   </Radio.Group>
                )}
           </FormItem>
          <FormItem {...formItemLayout} label="cron表达式:">
                        {getFieldDecorator('cCron', {
                        rules: [{ required:theDisabled?true:false, message: '请选择定时触发周期！' }]
                        })(
                          <Input disabled={!theDisabled} onChange={this.onChangecycle} onBlur={this.generateCron}/>   
                        )}
          </FormItem>
          <FormItem {...formItemLayout} label="一次性写入大小:">
              {getFieldDecorator('nBatchSize', {
              rules: [{ required: true, message: '请选择一次性写入大小' }]
              })(
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="请选择一次性写入大小"
                  optionFilterProp="children"
                >
                {BatchSize.map((item,index)=>{
                  return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                })}
                
              </Select>
               
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="线程数:">
              {getFieldDecorator('nChannel', {
              rules: [{ required: true, message: '请选择线程数!' },]
              })(
                <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="请选择线程数"
                optionFilterProp="children"
               
              >
              {Channel.map((item,index)=>{
                  return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                })}
                
              </Select>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="读取速度:">
              {getFieldDecorator('nByte', {
              rules: [{ required: true, message: '请选择读取速度!' },]
              })(
                <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="请选择读取速度"
                optionFilterProp="children"
              >
                {Byte.map((item,index)=>{
                  return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                })}
                
              </Select>
               
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="读取行数:">
              {getFieldDecorator('nRecord', {
              rules: [{ required: true, message: '请选择读取行数!'},]
              })(
                <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="请选择读取行数"
                optionFilterProp="children"
              >
              {Record.map((item,index)=>{
                  return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                })}
              </Select>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="日志保留时长:">
              {getFieldDecorator('nLogRetainTime', {
              rules: [{ required: true, message: '请选择日志保留时长!'},]
              })(
                <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="请选择日志保留时长"
                optionFilterProp="children"
              >
                {TasKData.map((item,index)=>{
                      return <Option key={item+index} value={item}>{item}天</Option>
                    })}
              </Select>
               
              )}
          </FormItem>
          
          
       </Form>
   );
 }
}
DRCModel = Form.create()(DRCModel)

//RSCModel第二步
class RSCModel  extends React.Component {
  state = {
    value: undefined,
  };

  onRSCChange = (value,option) => {
    let newvalue = option.ref.nDbType
    let {thisObj}=this.props
    if (newvalue==6) {
      thisObj.setState({ theRSCDisabled:true,
        ReadType:option.ref.nDbType
       });
    }else{
      thisObj.setState({ theRSCDisabled:false,
        ReadType:option.ref.nDbType
      });
    } 
  }
  render(){
  const { HdfsEncod,HdfsFileTypeData,TDatasourceNoPageList, form, theDismask, theRSCDisabled, thisObj, dispatch,cyclevalueDisabled } = this.props;
   const { getFieldDecorator } = form;
   const formItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 16 },
   };
   const infoText = (
    <ul style={{width: 400, height: 140, overflow: "auto"}}>
      <li><p>  1.如果使用预留参数功能，请在读取SQL中填写占位符，格式：#`{`参数名`}`，   例如：select  id，#`{`name`}` from test where a>1 and b> #`{`b`}`.
      </p></li>
      <li><p> 2.如果已完成了读取SQL的占位符编写，请在预留参数框内填写上参数名，对应SQL中占位符，使用逗号分隔，例如：   name,length.
      </p></li>
      </ul>
  );
   return (
   
       <Form
         className="ant-advanced-search-form"
       >
          <FormItem label="选择数据源:" {...formItemLayout}>
           {getFieldDecorator('cDatasourceId', {
              rules: [{ required: true, message: '请选择数据源！' }]
           })(
            <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="请选择数据源"
            optionFilterProp="children"
            onChange={this.onRSCChange}
          >
              {TDatasourceNoPageList.map((item,index)=>{
                  return <Option key={item.key} ref={item} value={item.cId}>{item.cDatasourceName}</Option>
                })}
          </Select>
           )}
          </FormItem>
          <FormItem {...formItemLayout} label="读取端SQL:">
              {getFieldDecorator('cReadSqlMain',{
              rules: [{ required: true, message: '请填写读取端SQL！' }]
              })(
                <Input.TextArea autoSize />
              )}
          </FormItem>
          
          <FormItem {...formItemLayout} label="预留参数:">
              {getFieldDecorator('cParam',{
              // rules: [{ required: true, message: '请填写预留参数！' }]
              })(
                <Input disabled={theDismask} style={{width:"70%",marginRight:10}}/>   
              )}
              <Popover title="预留参数说明" placement="bottomRight" trigger="hover" content={infoText}>
                <Icon type="question-circle-o" style={{ fontSize: 20, color: "#ddd", cursor: "pointer",}} />
              </Popover>
          </FormItem>
          {theRSCDisabled?
                <>
                  <FormItem {...formItemLayout} label="文件路径:">
                  {getFieldDecorator('cFilePath',{
                      rules: [{ required: true, message: '请填写文件路径！' }]
                      })(
                        <Input/>
                      )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="文件类型:">
                      {getFieldDecorator('cFileType', {
                      rules: [{ required: true, message: '请选择文件类型！' }]
                      })(
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="请选择文件类型！"
                          optionFilterProp="children"
                        >
                          {HdfsFileTypeData.map((item,index)=>{
                          return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                        })}
                        </Select>
                      )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="字段分隔符:" >
                        {getFieldDecorator('cFieldDelimiter',{ 
                          rules: [{ required: true, message: '请填写字段分隔符！' }]
                        })(
                            <Input/>
                        )}
                  </FormItem>
                  
                  <FormItem {...formItemLayout} label="编码:">
                      {getFieldDecorator('cEncoding', {
                      rules: [{ required: true, message: '请选择编码' }, ]
                      })(
                        <Select
                          showSearch
                        style={{ width: "100%" }}
                          placeholder="编码"
                          optionFilterProp="children"
                        >
                        {HdfsEncod.map((item,index)=>{
                          return <Option key={item.cTypeId+item.cCode} value={item.cCode}>{item.cCodeName}</Option>
                        })}
                        </Select>
                      )}
                  </FormItem>
             
              </>:
              null}
              
       </Form>
   );
 }
}
RSCModel = Form.create()(RSCModel)
//WSCModel第三步
class WSCModel  extends React.Component {
  state = {
    value: undefined,
    theDiled:false,
  };

  onChange = (value,option) => {
    let newvalue=option.ref.nDbType
    let {dispatch,thisObj} = this.props
    console.log(option)
    let datas={
      dbId:option.ref.cId
    }
    let theDatas ={
      dbWriteType:newvalue
    }
    let callback=()=>{

    }
    let Tcallback=()=>{
      if (newvalue==6) {
        thisObj.setState({ theDiled:true ,
          WriteType:option.ref.nDbType
        });
      }else{
        thisObj.setState({ theDiled:false ,
          WriteType:option.ref.nDbType
        });
      } 
    }
    this.props.form.setFieldsValue({
      cTabName:'',
      cWriteMode:'',
    })
    //获取数据表
    dispatch({type: 'TaskAllocationModel/getQueryTable', payload: { datas,callback}});
    dispatch({
      type: 'TaskAllocationModel/getQueryWriteMode',
      payload: { theDatas,Tcallback},
    })
  
  }
  getWritedata=(value)=>{
    let {dispatch} = this.props
    let datas={
      fileType:value
    }
    this.props.form.setFieldsValue({
      cCompress:''
    })
    let callback =()=>{
    }
    dispatch({
        type: 'TaskAllocationModel/getQueryWriteCompress',
        payload: { datas,callback},
      })
    
  }
 
  render(){
  const { visible, onCancel, oncParamshowModel, form, theDiled, HafsWriteFieType,QueryWriteCompress,QueryWriteMode, TDatasourceNoPageList, dispatch,QueryTableList } = this.props;
   const { getFieldDecorator } = form;
   const formItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 16 },
   };
   return (
       <Form
         className="ant-advanced-search-form"
       >
          <FormItem label="选择数据源:" {...formItemLayout}>
           {getFieldDecorator('cDatasourceId', {
              rules: [{ required: true, message: '请选择数据源！' }]
           })(
            <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="选择数据源"
            optionFilterProp="children"
            onChange={this.onChange}
          >

             {TDatasourceNoPageList.map((item,index)=>{
                  return <Option key={item.key+index} value={item.cId} ref={item} >{item.cDatasourceName}</Option>
                })}
          </Select>
           )}
          </FormItem>
        
            {QueryTableList==null?
               <FormItem {...formItemLayout} label="填写数据表名:">
                      {getFieldDecorator('cTabName',{
                        rules: [{ required: true, message: '填写数据表名！' }]
                        })(
                            <Input/>
                          
                        )}
                </FormItem>
                 :
                 <FormItem {...formItemLayout} label="选择数据表:">
                  {getFieldDecorator('cTabName',{
                    rules: [{ required: true, message: '请选择数据表！' }]
                    })(
                      <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="选择数据表"
                          optionFilterProp="children"
                        >
                        {/* <Option key={"11111"} value="11111">默认数据表</Option> */}
                        {QueryTableList.map((item,index)=>{
                                          return <Option key={item.key+index} value={item.tableName}>{item.tableName}</Option>
                                        })}:
                        </Select>
                    )}
              </FormItem>
            }
                  
          
          <FormItem {...formItemLayout} label="写入前执行SQL:">
              {getFieldDecorator('cPreSql',{ 
              // rules: [{ required: true, message: '请填写写入前执行SQL！' }]
              })(
                <Input.TextArea autoSize/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="写入后后执行SQL:">
           {getFieldDecorator('cPostSql',{
              // rules: [{ required: true, message: '请填写写入后后执行SQL！' }]
              })(
                <Input.TextArea autoSize />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="字段映射:">
              {getFieldDecorator('cFieldOrder', {
                 rules: [{ required: true, message: '请填写字段映射！' }]
              })(
                // <Input style={{width:"60%",marginRight:10}}/>
                <Input />
              )}
             {/* <Button type="primary" onClick={oncParamshowModel}>填写字段映射</Button> */}
          </FormItem>
          {QueryWriteMode==null||QueryWriteMode.length==0?
               <FormItem {...formItemLayout} label="写入方式:">
                      {getFieldDecorator('cWriteMode',{
                        })(
                            <Input/>
                        )}
                </FormItem>
                 :
                 <FormItem {...formItemLayout} label="写入方式" >
                 {getFieldDecorator('cWriteMode',{
                    
                 })(
                      <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="选择写入方式"
                      optionFilterProp="children"
                    >
                    {/* <Option key={"11111"} value="默认写入方式">默认写入方式</Option> */}
                       {QueryWriteMode.map((item,index)=>{
                         return <Option key={item.cTypeId+index} value={item.cCode}>{item.cCodeName}</Option>
                       })}
                    </Select>
                    )}
               </FormItem>
            }
        
          {theDiled?
                <>
                 <FormItem {...formItemLayout} label="文件类型" >
                          {getFieldDecorator('cFileType',
                            {rules: [{ required: true, message: '请选择文件类型！' }]})(
                              <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="请选择文件类型"
                              optionFilterProp="children"
                              onChange={this.getWritedata}
                            >
                            {HafsWriteFieType.map((item,index)=>{
                                return <Option key={item.cTypeId+index} value={item.cCode}>{item.cCodeName}</Option>
                            })}
                            </Select>
                            )}
                  </FormItem>
                <FormItem {...formItemLayout} label="文件路径:">
                  {getFieldDecorator('cFilePath', {
                    rules: [{ required: true, message: '请填写文件路径！' }]
                  })(
                    <Input/>
                  )}
                </FormItem>
         
                <FormItem {...formItemLayout} label="字段分隔符:">
                  {getFieldDecorator('cFieldDelimiter', {
                    rules: [{ required: true, message: '请填写字段分隔符！' }]
                  })(
                    <Input/>
                  )}
                </FormItem>
                {QueryWriteCompress.length==0?
                  <FormItem {...formItemLayout} label="压缩方式" >
                        {getFieldDecorator('cCompress',
                         )(
                            <Input/>
                          )}
                </FormItem>
                  :
                  <FormItem {...formItemLayout} label="压缩方式" >
                          {getFieldDecorator('cCompress',
                            )(
                              <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="请先选择文件类型再选择压缩方式"
                              optionFilterProp="children"
                            >
                            {QueryWriteCompress.map((item,index)=>{
                                return <Option key={item.cTypeId+index} value={item.cCode}>{item.cCodeName}</Option>
                              })}
                            </Select>
                            )}
                  </FormItem>
                  }
               
              </>
           :null}
          
        
        </Form>
   );
 }
}
WSCModel = Form.create()(WSCModel)



export default connect((state)=>{
  console.log(state)
  return{
    treeFlag:state.TaskAllocationModel.treeFlag,
    treeData:state.TaskAllocationModel.treeData,
    BusinessTreeData:state.TaskAllocationModel.BusinessTreeData,
    QueryTreeList:state.TaskAllocationModel.QueryTreeList,
    BatchSize:state.TaskAllocationModel.BatchSize,
    Byte:state.TaskAllocationModel.Byte,
    Channel:state.TaskAllocationModel.Channel,
    Record:state.TaskAllocationModel.Record,
    TasKData:state.TaskAllocationModel.TasKData,
    HdfsFileTypeData:state.TaskAllocationModel.HdfsFileTypeData,
    HdfsEncod:state.TaskAllocationModel.HdfsEncod,
    TDatasourceNoPageList:state.TaskAllocationModel.TDatasourceNoPageList,
    QueryTableList:state.TaskAllocationModel.QueryTableList,
    HafsWriteFieType:state.TaskAllocationModel.HafsWriteFieType,
    QueryWriteCompress:state.TaskAllocationModel.QueryWriteCompress,
    QueryWriteMode:state.TaskAllocationModel.QueryWriteMode,
    SingleJson:state.TaskAllocationModel.SingleJson,

  }
})(TaskAllocation)