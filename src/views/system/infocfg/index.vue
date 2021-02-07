<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="系统名称" prop="sysName">
        <el-input
          v-model="queryParams.sysName"
          placeholder="请输入系统名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全宗号" prop="funds">
        <el-input
          v-model="queryParams.funds"
          placeholder="请输入全宗号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统码" prop="sysCode">
        <el-input
          v-model="queryParams.sysCode"
          placeholder="请输入系统码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:infocfg:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:infocfg:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:infocfg:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:infocfg:export']"
          >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="infocfgList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="configId" />
      <el-table-column label="系统名称" align="center" prop="sysName" />
      <el-table-column label="单位名称" align="center" prop="deptName" />
      <el-table-column label="全宗号" align="center" prop="funds" />
      <el-table-column label="系统码" align="center" prop="sysCode" />
      <el-table-column label="版权信息" align="center" prop="copyRight" />
      <el-table-column
        label="著录流程"
        align="center"
        prop="recordFlow"
        :formatter="recordFlowFormat"
      />
      <el-table-column
        label="权限流程"
        align="center"
        prop="powerFlow"
        :formatter="powerFlowFormat"
      />
      <el-table-column
        label="归档流程"
        align="center"
        prop="archiveFlow"
        :formatter="archiveFlowFormat"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:infocfg:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:infocfg:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改系统配置信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="系统名称" prop="sysName">
          <el-input v-model="form.sysName" placeholder="请输入系统名称" />
        </el-form-item>
        <el-form-item label="单位名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="全宗号" prop="funds">
          <el-input v-model="form.funds" placeholder="请输入全宗号" />
        </el-form-item>
        <el-form-item label="系统码" prop="sysCode">
          <el-input v-model="form.sysCode" placeholder="请输入系统码" />
        </el-form-item>
        <el-form-item label="版权信息" prop="copyRight">
          <el-input
            v-model="form.copyRight"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="著录流程" prop="recordFlow">
          <el-select v-model="form.recordFlow" placeholder="请选择著录流程">
            <el-option
              v-for="dict in recordFlowOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限流程" prop="powerFlow">
          <el-select v-model="form.powerFlow" placeholder="请选择权限流程">
            <el-option
              v-for="dict in powerFlowOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归档流程" prop="archiveFlow">
          <el-select v-model="form.archiveFlow" placeholder="请选择归档流程">
            <el-option
              v-for="dict in archiveFlowOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        listInfocfg,
        getInfocfg,
        delInfocfg,
        addInfocfg,
        updateInfocfg } from "@/api/system/infocfg";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    export default {
        name: "Infocfg",
        components: {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                },
        data() {
            return {
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
                // 系统配置信息表格数据
                    infocfgList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            // 著录流程字典
                            recordFlowOptions: [],
                                                                                                                        // 权限流程字典
                            powerFlowOptions: [],
                                                                                                                        // 归档流程字典
                            archiveFlowOptions: [],
                                                                                                                                                                                                                                                                                                                                                                                                                                                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                                                                            sysName: null,
                                                                deptName: null,
                                                                funds: null,
                                                                sysCode: null,
                                                                copyRight: null,
                                                                                                                                                                                                                                                                    },
            // 表单参数
            form: {
            }
        ,
            // 表单校验
            rules: {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }
        }
            ;
        },
        created() {
            this.getList();
                   this.getDicts("sys_use_type").then(response => {
                        this.recordFlowOptions = response.data;
                })
                    ;
                        this.getDicts("sys_use_type").then(response => {
                        this.powerFlowOptions = response.data;
                })
                    ;
                        this.getDicts("sys_use_type").then(response => {
                        this.archiveFlowOptions = response.data;
                })
                    ;
                                                                                                                                                                                },
        methods: {
            /** 查询系统配置信息列表 */
            getList() {
                this.loading = true;
                listInfocfg(this.queryParams).then(response => {
                    this.infocfgList = response.rows;
                this.total = response.total;
                this.loading = false;
            })
                ;
            },
                                                                                                                                                                                                                                                                // 著录流程字典翻译
                        recordFlowFormat(row, column) {
                        return this.selectDictLabel(this.recordFlowOptions, row.recordFlow);
                    },
                                                                                                        // 权限流程字典翻译
                        powerFlowFormat(row, column) {
                        return this.selectDictLabel(this.powerFlowOptions, row.powerFlow);
                    },
                                                                                                        // 归档流程字典翻译
                        archiveFlowFormat(row, column) {
                        return this.selectDictLabel(this.archiveFlowOptions, row.archiveFlow);
                    },
                                                                                                                                                                                    // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                                                            configId: null,
                                                                                sysName: null,
                                                                                deptName: null,
                                                                                funds: null,
                                                                                sysCode: null,
                                                                                copyRight: null,
                                                                                recordFlow: null,
                                                                                powerFlow: null,
                                                                                archiveFlow: null,
                                                                                createBy: null,
                                                                                createTime: null,
                                                                                updateBy: null,
                                                                                updateTime: null,
                                                                                remark: null
                                                }
                ;
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.configId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加系统配置信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const configId =
                row.configId || this.ids
                getInfocfg(configId).then(response => {
                    this.form = response.data;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        this.open = true;
                this.title = "修改系统配置信息";
            })
                ;
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if(valid) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (this.form.configId != null) {
                            updateInfocfg(this.form).then(response => {
                                this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        })
                            ;
                        } else {
                            addInfocfg(this.form).then(response => {
                                this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        })
                            ;
                        }
                    }
                }
            )
                ;
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const configIds = row.configId || this.ids;
                this.$confirm('是否确认删除系统配置信息编号为"' + configIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return delInfocfg(configIds);
                }).then(() => {
                    this.getList();
                this.msgSuccess("删除成功");
            })
            },
            /** 导出按钮操作 */
            handleExport() {
                this.download('system/infocfg/export', {
                    ...this.queryParams
                }, `system_infocfg.xlsx`)
            }
        }
    };
</script>