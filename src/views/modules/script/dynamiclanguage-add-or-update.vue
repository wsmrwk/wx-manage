<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="语言类型" prop="type">
      <el-select v-model="dataForm.type" placeholder="请选择语言类型">
        <el-option
          v-for="item in typeList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>

    </el-form-item>
    <el-form-item label="唯一code" prop="uuCode">
      <el-input v-model="dataForm.uuCode" placeholder="唯一code"></el-input>
    </el-form-item>

    <el-form-item label="示例" prop="mock">
      <el-input type="textarea" v-model="dataForm.mock" placeholder="mock示例"></el-input>
    </el-form-item>

    <el-form-item label="代码" prop="code">
      <el-input type="textarea" v-model="dataForm.code" placeholder="代码"></el-input>
    </el-form-item>
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
        typeList: ['MYSQL', 'JS', 'PYTHON', 'SHELL'],
        dataForm: {
          id: 0,
          type: '',
          uuCode: '',
          mock: '',
          code: '',
          comment: ''
        },
        dataRule: {
          type: [
            { required: true, message: '语言类型不能为空', trigger: 'blur' }
          ],
          uuCode: [
            { required: true, message: '唯一code不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '代码不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/script/dynamiclanguage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.dynamicLanguage.type
                this.dataForm.uuCode = data.dynamicLanguage.uuCode
                this.dataForm.mock = data.dynamicLanguage.mock
                this.dataForm.code = data.dynamicLanguage.code
                this.dataForm.comment = data.dynamicLanguage.comment
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
              url: this.$http.adornUrl(`/script/dynamiclanguage/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'uuCode': this.dataForm.uuCode,
                'mock': this.dataForm.mock,
                'code': this.dataForm.code,
                'comment': this.dataForm.comment
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
