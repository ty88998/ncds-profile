<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
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
          v-hasPermi="['ncdscenter:sort:add']"
          >新增
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="sortList"
      row-key="sortId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" align="center" prop="name" />
      <el-table-column
        label="是否为底层分类"
        align="center"
        prop="isBottom"
        :formatter="isBottomFormat"
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
            v-hasPermi="['ncdscenter:sort:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ncdscenter:sort:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改分类信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="主表编号" prop="mainTable">
          <el-input v-model="form.mainTable" placeholder="请输入主表编号" />
        </el-form-item>
        <el-form-item label="展示表" prop="viewTable">
          <el-input v-model="form.viewTable" placeholder="请输入展示表" />
        </el-form-item>
        <el-form-item label="父分类编号" prop="parentNo">
          <treeselect
            v-model="form.parentNo"
            :options="sortOptions"
            :normalizer="normalizer"
            placeholder="请选择父分类编号"
          />
        </el-form-item>
        <el-form-item label="是否为底层分类" prop="isBottom">
          <el-select v-model="form.isBottom" placeholder="请选择是否为底层分类">
            <el-option
              v-for="dict in isBottomOptions"
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
  listSort,
  getSort,
  delSort,
  addSort,
  updateSort,
  exportSort,
} from "@/api/ncdscenter/sort";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Sort",
  components: {
    Treeselect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 分类信息表格数据
      sortList: [],
      // 分类信息树选项
      sortOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false, // 是否为底层分类	0 否1是字典
      isBottomOptions: [], // 查询参数
      queryParams: {
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_y_n").then((response) => {
      this.isBottomOptions = response.data;
    });
  },
  methods: {
    /** 查询分类信息列表 */
    getList() {
      this.loading = true;
      listSort(this.queryParams).then((response) => {
        this.sortList = this.handleTree(response.data, "sortId", "parentNo");
        this.loading = false;
      });
    },
    /** 转换分类信息数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.sortId,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listSort().then((response) => {
        this.sortOptions = [];
        const data = { sortId: 0, name: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "sortId", "parentNo");
        this.sortOptions.push(data);
      });
    },
    // 是否为底层分类	0 否1是字典翻译
    isBottomFormat(row, column) {
      return this.selectDictLabel(this.isBottomOptions, row.isBottom);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        sortId: null,
        name: null,
        mainTable: null,
        viewTable: null,
        parentNo: null,
        isBottom: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加分类信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentNo = row.sortId;
      }
      getSort(row.sortId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改分类信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.sortId != null) {
            updateSort(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSort(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除分类信息编号为"' + row.sortId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSort(row.sortId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
