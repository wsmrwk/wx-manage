<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="书名" prop="bookName">
      <el-input v-model="dataForm.bookName" placeholder="书名"></el-input>
    </el-form-item>
    <el-form-item label="作者code" prop="authorCode">
      <el-select v-model="dataForm.authorCode" placeholder="请选择作者">
        <el-option
          v-for="item in authorlist"
          :key="item.authorCode"
          :label="item.authorName"
          :value="item.authorCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="comment">
      <el-input v-model="dataForm.comment" placeholder="描述"></el-input>
    </el-form-item>

    <el-form-item label="开始内容" prop="startContent">
      <el-input type="textarea" v-model="dataForm.startContent" placeholder="开始内容"></el-input>
    </el-form-item>
    <el-form-item label="结束内容" prop="endContent">
      <el-input type="textarea" v-model="dataForm.endContent" placeholder="结束内容"></el-input>
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
        authorlist: [],
        dataForm: {
          id: 0,
          bookName: '',
          bookCode: '',
          authorCode: '',
          comment: '',
          wordSize: '',
          startContent: '',
          endContent: ''
        },
        dataRule: {
          bookName: [
            { required: true, message: '书名不能为空', trigger: 'blur' }
          ],
          作者code: [
            { required: true, message: '作者code不可以为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/book/book/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bookName = data.book.bookName
                this.dataForm.bookCode = data.book.bookCode
                this.dataForm.authorCode = data.book.authorCode
                this.dataForm.comment = data.book.comment
                this.dataForm.wordSize = data.book.wordSize
                this.dataForm.startContent = data.book.startContent
                this.dataForm.endContent = data.book.endContent
              }
            })
            .then(
              this.$http({
                url: this.$http.adornUrl('/book/bookauthor/select'),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                this.authorlist = data && data.code === 0 ? data.list : []
              })
            )
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/book/book/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'bookName': this.dataForm.bookName,
                'bookCode': this.dataForm.bookCode,
                'authorCode': this.dataForm.authorCode,
                'comment': this.dataForm.comment,
                'wordSize': this.dataForm.wordSize,
                'endContent': this.dataForm.endContent,
                'startContent': this.dataForm.startContent
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
