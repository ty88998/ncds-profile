<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="患者名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入患者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="随访医生" prop="doctor">
        <el-input
          v-model="queryParams.doctor"
          placeholder="请输入随访医生"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="随访医院" prop="hospital">
        <el-input
          v-model="queryParams.hospital"
          placeholder="请输入随访医院"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="随访时间" prop="accessTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.accessTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择随访时间"
        >
        </el-date-picker>
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ncdscenter:access:export']"
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
      :data="accessList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="患者名称" align="center" prop="name" />
      <el-table-column label="随访医生" align="center" prop="doctor" />
      <el-table-column label="随访医院" align="center" prop="hospital" />
      <el-table-column label="所在场所" align="center" prop="place" />
      <el-table-column
        label="随访时间"
        align="center"
        prop="accessTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.accessTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ncdscenter:access:edit']"
            >查看
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

    <!-- 添加或修改随访信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="患者编号" prop="personinfoId">
          <el-input v-model="form.personinfoId" placeholder="请输入患者编号" />
        </el-form-item>
        <el-form-item label="患者名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入患者名称" />
        </el-form-item>
        <el-form-item label="随访医生" prop="doctor">
          <el-input v-model="form.doctor" placeholder="请输入随访医生" />
        </el-form-item>
        <el-form-item label="随访医院" prop="hospital">
          <el-input v-model="form.hospital" placeholder="请输入随访医院" />
        </el-form-item>
        <el-form-item label="所在场所" prop="place">
          <el-input v-model="form.place" placeholder="请输入所在场所" />
        </el-form-item>
        <el-form-item label="随访内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="随访时间" prop="accessTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.accessTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择随访时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAccess,
  getAccess,
  delAccess,
  addAccess,
  updateAccess,
} from "@/api/ncdscenter/access";
import Editor from "@/components/Editor";

export default {
  name: "Access",
  components: {
    Editor,
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
      // 随访信息表格数据
      accessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personinfoId: null,
        name: null,
        doctor: null,
        hospital: null,
        accessTime: null,
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
    /** 查询随访信息列表 */
    getList() {
      this.loading = true;
      listAccess(this.queryParams).then((response) => {
        this.accessList = response.rows;
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
        id: null,
        personinfoId: null,
        name: null,
        doctor: null,
        hospital: null,
        place: null,
        content: null,
        accessTime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加随访信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAccess(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改随访信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateAccess(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccess(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除随访信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAccess(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "ncdscenter/access/export",
        {
          ...this.queryParams,
        },
        `ncdscenter_access.xlsx`
      );
    },
  },
};
</script>