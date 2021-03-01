<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="书本code" prop="bookCode">
      <el-input v-model="dataForm.bookCode" placeholder="书本code"></el-input>
    </el-form-item>

    <el-form-item label="目录code" prop="catalogCode">
      <el-input v-model="dataForm.catalogCode" placeholder="目录code"></el-input>
    </el-form-item>

    <el-form-item label="内容" prop="content">
      <el-input v-model="dataForm.content" placeholder="内容"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="rankNum">
      <el-input v-model="dataForm.rankNum" placeholder="排序"></el-input>
    </el-form-item>
    <el-form-item label="本内容的总字数" prop="wordSize">
      <el-input v-model="dataForm.wordSize" placeholder="本内容的总字数"></el-input>
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
          bookCode: '',
          catalogCode: '',
          content: '',
          rankNum: '',
          wordSize: ''
        },
        dataRule: {
          bookCode: [
            { required: true, message: '书本code不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          rankNum: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          wordSize: [
            { required: true, message: '本内容的总字数不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/book/bookcontent/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bookCode = data.bookContent.bookCode
                this.dataForm.catalogCode = data.bookContent.catalogCode
                this.dataForm.content = data.bookContent.content
                this.dataForm.rankNum = data.bookContent.rankNum
                this.dataForm.wordSize = data.bookContent.wordSize
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
              url: this.$http.adornUrl(`/book/bookcontent/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'bookCode': this.dataForm.bookCode,
                'catalogCode': this.dataForm.catalogCode,
                'content': this.dataForm.content,
                'rankNum': this.dataForm.rankNum,
                'wordSize': this.dataForm.wordSize
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
