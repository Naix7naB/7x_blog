<script>
export default {
    name: 'Popup',
    props: {
        title: {
            type: String,
            default: '弹窗'
        },
        width: {
            type: String,
            default: '40%'
        },
        offset: {
            type: String,
            default: '20vh'
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '确认'
        }
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        open() {
            this.visible = true
        },
        close() {
            this.visible = false
        },
        cancel() {
            this.$emit('beforePopupCancel', this.close)
        },
        confirm() {
            this.$emit('beforePopupConfirm', this.close)
        }
    }
}
</script>

<template>
    <el-dialog
        :visible="visible"
        :title="title"
        :width="width"
        :top="offset"
        :fullscreen="fullscreen"
        :center="true"
        :append-to-body="true"
        @close="close"
    >
        <template #default>
            <slot></slot>
        </template>
        <template slot="footer">
            <el-button plain size="small" @click="cancel">{{ cancelText }}</el-button>
            <el-button type="primary" size="small" @click="confirm">{{ confirmText }}</el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
    min-width: 360px;
    max-width: 780px;
}

:deep(.el-dialog.is-fullscreen) {
    min-width: 100%;
    max-width: 100%;
}
</style>
