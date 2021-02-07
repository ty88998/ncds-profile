<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="请假类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择请假类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="开始时间" prop="leaveStartTime">-->
      <!--        <el-date-picker clearable size="small" style="width: 200px"-->
      <!--                        v-model="queryParams.leaveStartTime"-->
      <!--                        type="date"-->
      <!--                        value-format="yyyy-MM-dd"-->
      <!--                        placeholder="选择开始时间">-->
      <!--        </el-date-picker>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="结束时间" prop="leaveEndTime">-->
      <!--        <el-date-picker clearable size="small" style="width: 200px"-->
      <!--                        v-model="queryParams.leaveEndTime"-->
      <!--                        type="date"-->
      <!--                        value-format="yyyy-MM-dd"-->
      <!--                        placeholder="选择结束时间">-->
      <!--        </el-date-picker>-->
      <!--      </el-form-item>-->

      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in stateOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="创建者" prop="createBy">-->
      <!--        <el-select v-model="queryParams.createBy" placeholder="请选择创建者" clearable size="small">-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['workflow:leave:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键ID" align="center" prop="id" />-->
      <el-table-column label="请假类型" align="center" prop="type" :formatter="typeFormat"/>
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="原因" align="center" prop="reason"/>
      <el-table-column label="开始时间" align="center" prop="leaveStartTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.leaveStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="leaveEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.leaveEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createName"/>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="historyFory(scope.row)"
            v-hasPermi="['workflow:leave:edit']"
          >审批详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看详细信息话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
      <leaveHistoryForm :businessKey="businessKey"  v-if="open2"/>
      <div slot="footer" class="dialog-footer">
      <el-button @click="open2=!open2">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { listLeaveAll, exportLeave } from '@/api/workflow/leave'
  import leaveHistoryForm from "./leaveHistoryForm";
  export default {
    name: 'Leave',
    components:{leaveHistoryForm},
    data() {
      return {
        businessKey:'',
        //用户信息
        user: {},
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 请假表格数据
        leaveList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        open2:false,
        // 请假类型字典
        typeOptions: [],
        // 状态字典
        stateOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: null,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          instanceId: null,
          state: null,
          createBy: null
        },

      }
    },
    created() {
      this.getList()
      this.getDicts('activiti_leave_type').then(response => {
        this.typeOptions = response.data
      })
      this.getDicts('activiti_flow_type').then(response => {
        this.stateOptions = response.data
      })
    },
    methods: {

      /** 查询请假列表 */
      getList() {
        this.loading = true
        listLeaveAll(this.queryParams).then(response => {
          this.leaveList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 请假类型字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.type)
      },
      // 状态字典翻译
      stateFormat(row, column) {
        return this.selectDictLabel(this.stateOptions, row.state)
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },

      /** 审批详情 */
      historyFory(row) {

        this.businessKey = row.id
          this.open2 = true
          this.title = '审批详情'

      },

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有请假数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportLeave(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      },

    }

  }
</script>
