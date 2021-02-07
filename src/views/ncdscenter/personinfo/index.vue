<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择性别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证件-号码" prop="cardCode">
        <el-input
          v-model="queryParams.cardCode"
          placeholder="请输入身份证件号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医疗费用支付方式" prop="providerPayments">
        <el-input
          v-model="queryParams.providerPayments"
          placeholder="请输入医疗费用支付方式"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ncdscenter:personinfo:export']"
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
      :data="personinfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column
        label="性别"
        align="center"
        prop="sex"
        :formatter="sexFormat"
      />
      <el-table-column label="身份证件-号码" align="center" prop="cardCode" />
      <el-table-column label="出生日期" align="center" prop="birthday" />
      <el-table-column label="文化程度" align="center" prop="education" />
      <el-table-column label="现住址" align="center" prop="address" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column
        label="医疗费用支付方式"
        align="center"
        prop="providerPayments"
      />
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
            v-hasPermi="['ncdscenter:personinfo:edit']"
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

    <!-- 添加或修改患者基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="健康档案标识符" prop="archivesId">
          <el-input
            v-model="form.archivesId"
            placeholder="请输入健康档案标识符"
          />
        </el-form-item>
        <el-form-item label="病案号" prop="patientId">
          <el-input v-model="form.patientId" placeholder="请输入病案号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sexOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证件-号码" prop="cardCode">
          <el-input v-model="form.cardCode" placeholder="请输入身份证件-号码" />
        </el-form-item>
        <el-form-item label="地址-省" prop="districtProvince">
          <el-input
            v-model="form.districtProvince"
            placeholder="请输入地址-省"
          />
        </el-form-item>
        <el-form-item label="地址-市" prop="districtCity">
          <el-input v-model="form.districtCity" placeholder="请输入地址-市" />
        </el-form-item>
        <el-form-item label="地址-县" prop="dictrictCountry">
          <el-input
            v-model="form.dictrictCountry"
            placeholder="请输入地址-县"
          />
        </el-form-item>
        <el-form-item label="地址-乡" prop="dictrictCountryside">
          <el-input
            v-model="form.dictrictCountryside"
            placeholder="请输入地址-乡"
          />
        </el-form-item>
        <el-form-item label="地址-村" prop="dictrictVillage">
          <el-input
            v-model="form.dictrictVillage"
            placeholder="请输入地址-村"
          />
        </el-form-item>
        <el-form-item label="门牌号码" prop="dictrictHouseNumber">
          <el-input
            v-model="form.dictrictHouseNumber"
            placeholder="请输入门牌号码"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-input v-model="form.birthday" placeholder="请输入出生日期" />
        </el-form-item>
        <el-form-item label="文化程度" prop="education">
          <el-input v-model="form.education" placeholder="请输入文化程度" />
        </el-form-item>
        <el-form-item label="现住址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="医疗费用支付方式" prop="providerPayments">
          <el-input
            v-model="form.providerPayments"
            placeholder="请输入医疗费用支付方式"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPersoninfo,
  getPersoninfo,
  delPersoninfo,
  addPersoninfo,
  updatePersoninfo,
} from "@/api/ncdscenter/personinfo";

export default {
  name: "Personinfo",
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
      // 患者基本信息表格数据
      personinfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sex: null,
        cardCode: null,
        birthday: null,
        education: null,
        address: null,
        telephone: null,
        providerPayments: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    /** 查询患者基本信息列表 */
    getList() {
      this.loading = true;
      listPersoninfo(this.queryParams).then((response) => {
        this.personinfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
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
        archivesId: null,
        patientId: null,
        name: null,
        sex: null,
        cardCode: null,
        districtProvince: null,
        districtCity: null,
        dictrictCountry: null,
        dictrictCountryside: null,
        dictrictVillage: null,
        dictrictHouseNumber: null,
        birthday: null,
        education: null,
        address: null,
        telephone: null,
        providerPayments: null,
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPersoninfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改患者基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updatePersoninfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPersoninfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "ncdscenter/personinfo/export",
        {
          ...this.queryParams,
        },
        `ncdscenter_personinfo.xlsx`
      );
    },
  },
};
</script>