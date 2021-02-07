<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类编号" prop="sortNo">
        <el-input
          v-model="queryParams.sortNo"
          placeholder="请输入分类编号"
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
          v-hasPermi="['ncdscenter:savepolicy:add']"
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
          v-hasPermi="['ncdscenter:savepolicy:edit']"
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
          v-hasPermi="['ncdscenter:savepolicy:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ncdscenter:savepolicy:export']"
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
      :data="savepolicyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="savepolicyId" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="路径" align="center" prop="savePath" />
      <el-table-column label="存储策略" align="center" prop="savePolicy" />
      <el-table-column label="文件组成格式" align="center" prop="fileFsmt" />
      <el-table-column
        label="档案编号规则"
        align="center"
        prop="archiveRules"
      />
      <el-table-column label="是否启用	0否 1是" align="center" prop="isUse" />
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
            v-hasPermi="['ncdscenter:savepolicy:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ncdscenter:savepolicy:remove']"
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

    <!-- 添加或修改存储策略信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="路径" prop="savePath">
          <el-input v-model="form.savePath" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="存储策略" prop="savePolicy">
          <el-input
            v-model="form.savePolicy"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="文件组成格式" prop="fileFsmt">
          <el-input
            v-model="form.fileFsmt"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="档案编号规则" prop="archiveRules">
          <el-input
            v-model="form.archiveRules"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="分类编号" prop="sortNo">
          <el-input v-model="form.sortNo" placeholder="请输入分类编号" />
        </el-form-item>
        <el-form-item label="是否启用	0否 1是" prop="isUse">
          <el-input v-model="form.isUse" placeholder="请输入是否启用	0否 1是" />
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
  listSavepolicy,
  getSavepolicy,
  delSavepolicy,
  addSavepolicy,
  updateSavepolicy,
} from "@/api/ncdscenter/savepolicy";

export default {
  name: "Savepolicy",
  components: {},
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
      // 存储策略信息表格数据
      savepolicyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sortNo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询存储策略信息列表 */
    getList() {
      this.loading = true;
      listSavepolicy(this.queryParams).then((response) => {
        this.savepolicyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        savepolicyId: null,
        name: null,
        savePath: null,
        savePolicy: null,
        fileFsmt: null,
        archiveRules: null,
        sortNo: null,
        isUse: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
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
      this.ids = selection.map((item) => item.savepolicyId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加存储策略信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const savepolicyId = row.savepolicyId || this.ids;
      getSavepolicy(savepolicyId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改存储策略信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.savepolicyId != null) {
            updateSavepolicy(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSavepolicy(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const savepolicyIds = row.savepolicyId || this.ids;
      this.$confirm(
        '是否确认删除存储策略信息编号为"' + savepolicyIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSavepolicy(savepolicyIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "ncdscenter/savepolicy/export",
        {
          ...this.queryParams,
        },
        `ncdscenter_savepolicy.xlsx`
      );
    },
  },
};
</script>