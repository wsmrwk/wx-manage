<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="作者名称" prop="authorName">
      <el-input v-model="dataForm.authorName" placeholder="作者名称"></el-input>
    </el-form-item>
    <el-form-item label="作者英文名称" prop="authorNameEnglish">
      <el-input v-model="dataForm.authorNameEnglish" placeholder="作者英文名称"></el-input>
    </el-form-item>
    <!-- <el-form-item label="作者code" prop="authorCode">
      <el-input v-model="dataForm.authorCode" placeholder="作者code"></el-input>
    </el-form-item> -->
    <el-form-item label="描述" prop="comment">
      <el-input v-model="dataForm.comment" placeholder="描述"></el-input>
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
          authorName: '',
          authorNameEnglish: '',
          authorCode: '',
          comment: ''
        },
        dataRule: {
          authorName: [
            { required: true, message: '作者名称不能为空', trigger: 'blur' }
          ]
          // ,
          // authorNameEnglish: [
          //   { required: true, message: '作者英文名不能为空', trigger: 'blur' }
          // ],
          // authorCode: [
          //   { required: true, message: '作者code不能为空', trigger: 'blur' }
          // ],
          // comment: [
          //   { required: true, message: '描述不能为空', trigger: 'blur' }
          // ]
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
              url: this.$http.adornUrl(`/book/bookauthor/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.authorName = data.bookAuthor.authorName
                this.dataForm.authorNameEnglish = data.bookAuthor.authorNameEnglish
                this.dataForm.authorCode = data.bookAuthor.authorCode
                this.dataForm.comment = data.bookAuthor.comment
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
              url: this.$http.adornUrl(`/book/bookauthor/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'authorName': this.dataForm.authorName,
                'authorNameEnglish': this.dataForm.authorNameEnglish,
                'authorCode': this.dataForm.authorCode,
                'comment': this.dataForm.comment
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
