<template>
  <div>
    <div>
    <h2>请假人：{{form.createName}}</h2>
    <el-form  label-width="80px">
      <el-form-item label="请假类型" >
       <el-input v-model="form.type"/>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="原因" >
        <el-input v-model="form.reason" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input v-model="form.leaveStartTime"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input v-model="form.leaveEndTime"/>
      </el-form-item>
    </el-form>
    </div>
    <div  v-for="(historyData, index) in fromData"
          :key="index" >
      <h2>{{historyData.taskNodeName}}</h2>
      <h3>审批人:{{historyData.createName}}</h3>
      <h3>审批时间:{{historyData.createdDate}}</h3>
      <el-form v-for="(fistoryFormData, indexH) in historyData.formHistoryDataDTO" :key="indexH" label-width="80px">
        <el-form-item :label=fistoryFormData.title >
          <el-input v-model="fistoryFormData.value"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { getLeave } from '@/api/workflow/leave'
  import { historyFromData } from '@/api/activiti/historyFormdata'
  export default {
    name: "leaveHistoryForm",
    props: {
      businessKey: {
        type: String
      }
    },
    data(){
      return{
        // 表单参数
        form: {},
        fromData:[],
      }
    },
    created() {
      this.getLeave()
      this.historyFromData()
    },
    methods:{
      getLeave() {
        getLeave(this.businessKey).then(response => {
          this.form = response.data
        })
      },
      historyFromData() {
        historyFromData(this.businessKey).then(response => {
          this.fromData = response.data
        })
      },
    }

  }
</script>

<style scoped>

</style>
