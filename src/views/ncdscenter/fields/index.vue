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
          v-hasPermi="['ncdscenter:fields:add']"
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
          v-hasPermi="['ncdscenter:fields:edit']"
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
          v-hasPermi="['ncdscenter:fields:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ncdscenter:fields:export']"
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
      :data="fieldsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="fieldsId" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="别名" align="center" prop="alias" />
      <el-table-column
        label="字段类型	"
        align="center"
        prop="fieldType"
        :formatter="fieldTypeFormat"
      />
      <el-table-column
        label="列表显示"
        align="center"
        prop="isShow"
        :formatter="isShowFormat"
      />
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
            v-hasPermi="['ncdscenter:fields:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ncdscenter:fields:remove']"
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

    <!-- 添加或修改字段信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item
          label="字段类型	int：整型  varchar：字符  text：长文本  decimal:浮点数   datetime:日期 "
          prop="fieldType"
        >
          <el-select v-model="form.fieldType" placeholder="请选择字段类型">
            <el-option
              v-for="dict in fieldTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="输入方式	0：普通 1：字典选择 2：生成序号"
          prop="inputType"
        >
          <el-select
            v-model="form.inputType"
            placeholder="请选择输入方式	0：普通 1：字典选择 2：生成序号"
          >
            <el-option label="普通" value="0" />
            <el-option label="字典选择" value="1" />
            <el-option label="生成序号" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="字典类型" prop="dicType">
          <el-select v-model="form.dicType" placeholder="请选择字典类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序规则" prop="orderRule">
          <el-select v-model="form.orderRule" placeholder="请选择排序规则">
            <el-option
              v-for="dict in orderRuleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度" prop="length">
          <el-input v-model="form.length" placeholder="请输入字段长度" />
        </el-form-item>
        <el-form-item label="小数位数" prop="digits">
          <el-input v-model="form.digits" placeholder="请输入小数位数" />
        </el-form-item>
        <el-form-item label="是否主键" prop="isKey">
          <el-select v-model="form.isKey" placeholder="请选择是否主键">
            <el-option
              v-for="dict in isKeyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为空" prop="isNull">
          <el-select v-model="form.isNull" placeholder="请选择是否为空">
            <el-option
              v-for="dict in isNullOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否检索" prop="isQuery">
          <el-select v-model="form.isQuery" placeholder="请选择是否检索">
            <el-option
              v-for="dict in isQueryOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表显示" prop="isShow">
          <el-select v-model="form.isShow" placeholder="请选择列表显示">
            <el-option
              v-for="dict in isShowOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统字段" prop="isSys">
          <el-select v-model="form.isSys" placeholder="请选择系统字段">
            <el-option
              v-for="dict in isSysOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否接收" prop="isReceive">
          <el-select v-model="form.isReceive" placeholder="请选择是否接收">
            <el-option
              v-for="dict in isReceiveOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否传输" prop="isTransmission">
          <el-select v-model="form.isTransmission" placeholder="请选择是否传输">
            <el-option
              v-for="dict in isTransmissionOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可编辑" prop="isEdit">
          <el-select v-model="form.isEdit" placeholder="请选择可编辑">
            <el-option
              v-for="dict in isEditOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="0:固定值；1：组成；2：分组递增" prop="defaultType">
          <el-select
            v-model="form.defaultType"
            placeholder="请选择0:固定值；1：组成；2：分组递增"
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="form.defaultValue" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="最小长度" prop="minLen">
          <el-input v-model="form.minLen" placeholder="请输入最小长度" />
        </el-form-item>
        <el-form-item label="最大长度" prop="maxLen">
          <el-input v-model="form.maxLen" placeholder="请输入最大长度" />
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
  listFields,
  getFields,
  delFields,
  addFields,
  updateFields,
} from "@/api/ncdscenter/fields";

export default {
  name: "Fields",
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
      // 字段信息表格数据
      fieldsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 字段类型	int：整型  varchar：字符  text：长文本  decimal:浮点数   datetime:日期 字典
      fieldTypeOptions: [],
      // 排序规则字典
      orderRuleOptions: [],
      // 是否主键字典
      isKeyOptions: [],
      // 是否为空字典
      isNullOptions: [],
      // 是否检索字典
      isQueryOptions: [],
      // 列表显示字典
      isShowOptions: [],
      // 系统字段字典
      isSysOptions: [],
      // 是否接收字典
      isReceiveOptions: [],
      // 是否传输字典
      isTransmissionOptions: [],
      // 可编辑字典
      isEditOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        alias: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        alias: [
          {
            required: true,
            message: "别名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("ar_field_type").then((response) => {
      this.fieldTypeOptions = response.data;
    });
    this.getDicts("order_rule").then((response) => {
      this.orderRuleOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isKeyOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isNullOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isQueryOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isShowOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isSysOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isReceiveOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isTransmissionOptions = response.data;
    });
    this.getDicts("sys_y_n").then((response) => {
      this.isEditOptions = response.data;
    });
  },
  methods: {
    /** 查询字段信息列表 */
    getList() {
      this.loading = true;
      listFields(this.queryParams).then((response) => {
        this.fieldsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 字段类型	int：整型  varchar：字符  text：长文本  decimal:浮点数   datetime:日期 字典翻译
    fieldTypeFormat(row, column) {
      return this.selectDictLabel(this.fieldTypeOptions, row.fieldType);
    },
    // 排序规则字典翻译
    orderRuleFormat(row, column) {
      return this.selectDictLabel(this.orderRuleOptions, row.orderRule);
    },
    // 是否主键字典翻译
    isKeyFormat(row, column) {
      return this.selectDictLabel(this.isKeyOptions, row.isKey);
    },
    // 是否为空字典翻译
    isNullFormat(row, column) {
      return this.selectDictLabel(this.isNullOptions, row.isNull);
    },
    // 是否检索字典翻译
    isQueryFormat(row, column) {
      return this.selectDictLabel(this.isQueryOptions, row.isQuery);
    },
    // 列表显示字典翻译
    isShowFormat(row, column) {
      return this.selectDictLabel(this.isShowOptions, row.isShow);
    },
    // 系统字段字典翻译
    isSysFormat(row, column) {
      return this.selectDictLabel(this.isSysOptions, row.isSys);
    },
    // 是否接收字典翻译
    isReceiveFormat(row, column) {
      return this.selectDictLabel(this.isReceiveOptions, row.isReceive);
    },
    // 是否传输字典翻译
    isTransmissionFormat(row, column) {
      return this.selectDictLabel(
        this.isTransmissionOptions,
        row.isTransmission
      );
    },
    // 可编辑字典翻译
    isEditFormat(row, column) {
      return this.selectDictLabel(this.isEditOptions, row.isEdit);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fieldsId: null,
        name: null,
        alias: null,
        fieldType: null,
        inputType: null,
        dicType: null,
        orderRule: null,
        length: null,
        digits: null,
        isKey: null,
        isNull: null,
        isQuery: null,
        isShow: null,
        isSys: null,
        isReceive: null,
        isTransmission: null,
        isEdit: null,
        defaultType: null,
        defaultValue: null,
        minLen: null,
        maxLen: null,
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
      this.ids = selection.map((item) => item.fieldsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字段信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fieldsId = row.fieldsId || this.ids;
      getFields(fieldsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字段信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.fieldsId != null) {
            updateFields(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFields(this.form).then((response) => {
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
      const fieldsIds = row.fieldsId || this.ids;
      this.$confirm(
        '是否确认删除字段信息编号为"' + fieldsIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delFields(fieldsIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "ncdscenter/fields/export",
        {
          ...this.queryParams,
        },
        `ncdscenter_fields.xlsx`
      );
    },
  },
};
</script>