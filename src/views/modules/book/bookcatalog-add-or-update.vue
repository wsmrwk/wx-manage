<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="目录" prop="catalog">
      <el-input v-model="dataForm.catalog" placeholder="目录"></el-input>
    </el-form-item>
    <el-form-item label="书本code" prop="bookCode">
      <el-input v-model="dataForm.bookCode" placeholder="书本code"></el-input>
    </el-form-item>
    <el-form-item label="目录code" prop="catalogCode">
      <el-input v-model="dataForm.catalogCode" placeholder="目录code"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="orders">
      <el-input v-model="dataForm.orders" placeholder="排序"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          catalog: '',
          bookCode: '',
          catalogCode: '',
          orders: ''
        },
        dataRule: {
          catalog: [
            { required: true, message: '目录不能为空', trigger: 'blur' }
          ],
          bookCode: [
            { required: true, message: '书本code不能为空', trigger: 'blur' }
          ],
          catalogCode: [
            { required: true, message: '目录code不能为空', trigger: 'blur' }
          ],
          orders: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/book/bookcatalog/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.catalog = data.bookCatalog.catalog
                this.dataForm.bookCode = data.bookCatalog.bookCode
                this.dataForm.catalogCode = data.bookCatalog.catalogCode
                this.dataForm.orders = data.bookCatalog.orders
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/book/bookcatalog/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'catalog': this.dataForm.catalog,
                'bookCode': this.dataForm.bookCode,
                'catalogCode': this.dataForm.catalogCode,
                'orders': this.dataForm.orders
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
