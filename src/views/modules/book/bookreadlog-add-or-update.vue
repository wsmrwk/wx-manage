<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="书本code" prop="bookCode">
      <el-input v-model="dataForm.bookCode" placeholder="书本code"></el-input>
    </el-form-item>
    <el-form-item label="用户id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
    </el-form-item>
    <el-form-item label="阅读行数" prop="logNum">
      <el-input v-model="dataForm.logNum" placeholder="阅读行数"></el-input>
    </el-form-item>
    <el-form-item label="已经阅读了多少字" prop="readed">
      <el-input v-model="dataForm.readed" placeholder="已经阅读了多少字"></el-input>
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
          userId: '',
          logNum: '',
          readed: ''
        },
        dataRule: {
          bookCode: [
            { required: true, message: '书本code不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ],
          logNum: [
            { required: true, message: '阅读行数不能为空', trigger: 'blur' }
          ],
          readed: [
            { required: true, message: '已经阅读了多少字不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/book/bookreadlog/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bookCode = data.bookReadLog.bookCode
                this.dataForm.userId = data.bookReadLog.userId
                this.dataForm.logNum = data.bookReadLog.logNum
                this.dataForm.readed = data.bookReadLog.readed
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
              url: this.$http.adornUrl(`/book/bookreadlog/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'bookCode': this.dataForm.bookCode,
                'userId': this.dataForm.userId,
                'logNum': this.dataForm.logNum,
                'readed': this.dataForm.readed
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
