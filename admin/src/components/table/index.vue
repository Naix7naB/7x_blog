<script>
import BaseForm from '@/components/form'
import Popup from '@/components/popup'
import Operator from '@/components/operator'

import { cloneDeep, isArray, isEmpty, isEqual, toPairs } from 'lodash-es'

const OPT_EVENT_MAP = {
    add: 'optAdd',
    edit: 'optEdit',
    delete: 'optDelete',
    bulkDelete: 'optBulkDelete'
}

export default {
    name: 'BaseTable',
    components: { BaseForm, Popup, Operator },
    props: {
        requestApi: {
            type: Function,
            require: true
        },
        columns: {
            type: Array,
            required: true
        },
        containerStyle: {
            type: Object,
            default: () => {}
        },
        tableAlign: {
            type: String,
            default: 'center'
        },
        showTableBorder: {
            type: Boolean,
            default: true
        },
        showQuery: {
            type: Boolean,
            default: true
        },
        showOperator: {
            type: Boolean,
            default: true
        },
        showSelection: {
            type: Boolean,
            default: false
        },
        showIndex: {
            type: Boolean,
            default: false
        },
        showPagination: {
            type: Boolean,
            default: true
        },
        pagerPos: {
            type: String,
            default: 'center'
        },
        queryForm: {
            type: Object,
            default: () => null
        },
        popupConfig: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            datasource: [],
            query: {},
            selection: [],
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    computed: {
        tableCellStyle() {
            return {
                textAlign: this.tableAlign
            }
        }
    },
    methods: {
        cloneDeep,
        /* 判断数据是否为空 */
        isEmptyVal(val) {
            if (typeof val === 'number' || typeof val === 'boolean') return false
            return isEmpty(val)
        },
        /* 处理数据 */
        handleValue(row, item) {
            let value = item.prop.split('.').reduce((prev, curr) => {
                prev = prev?.[curr]
                return prev
            }, row)
            if (item.formatter && typeof item.formatter === 'function') {
                value = item.formatter(value)
            }
            return value
        },
        /* 获取数据源 */
        getDatasource() {
            this.$store.dispatch('setLoadingState', true)
            this.requestApi({
                page: this.currentPage,
                size: this.pageSize,
                query: this.query
            }).then(res => {
                const { list, total } = res.data
                this.datasource = list
                this.total = total
                this.$emit('refresh', list)
            }).catch(err => {
                this.message.error(err.errMsg || err)
            }).finally(() => {
                this.$store.dispatch('setLoadingState', false)
            })
        },
        /* 获取el-tag组件vnode */
        tagVnode(handler, item) {
            const { value, ...props } = handler(item)
            return <el-tag size="medium" props={{ ...props }}>{ value }</el-tag>
        },
        /* 渲染el-tag组件 */
        renderTag(handler, cellVal) {
            if (isArray(cellVal)) {
                return cellVal.map(item => this.tagVnode(handler, item))
            } else {
                return this.tagVnode(handler, cellVal)
            }
        },
        /* 修改复选框状态时 */
        onSelectionChange(selection) {
            this.selection = selection
        },
        /* 查找表格匹配项 */
        queryTable() {
            this.$refs.query.submitForm(data => {
                this.query = toPairs(data).reduce((prev, [key, val]) => {
                    if (key === 'dateRange') {
                        prev['created_at'] = {
                            $gte: val[0],
                            $lte: val[1]
                        }
                    } else {
                        prev[key] = val
                    }
                    return prev
                }, {})
                this.refreshData()
            })
        },
        /* 操作选项按钮的执行函数 */
        optHandler(type, data) {
            const regex = new RegExp('delete', 'gi')
            const eventType = OPT_EVENT_MAP[type]
            if (regex.test(eventType)) {
                this.$confirm('此操作无法撤销, 是否继续？', '提示', {
                    type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            this.$emit(eventType, data)
                        } else {
                            this.$message.info('取消删除')
                        }
                    }
                })
            } else {
                this.$emit(eventType, data)
            }
        },
        /* 更改页码时 */
        changePage(page) {
            this.currentPage = page
            this.getDatasource()
        },
        /* 打开弹窗 */
        openPopup() {
            this.$refs.popup.open()
        },
        /* 重置查询条件 */
        resetQuery() {
            this.query = {}
        },
        /* 重置查询表单的数据 */
        resetQueryForm() {
            const rawData = this.$refs.query.raw
            const queryData = this.$refs.query.showing
            const isQueried = !isEmpty(this.query)
            if (isEqual(queryData, rawData)) return false
            this.$refs.query.resetFormData()
            if (isQueried) {
                this.resetQuery()
                this.refreshData()
            }
        },
        /* 刷新数据 */
        refreshData() {
            this.getDatasource()
        }
    },
    created() {
        this.getDatasource()
    }
}
</script>

<template>
    <div :style="containerStyle">
        <div v-if="showQuery" class="table-query">
            <BaseForm ref="query" v-bind="cloneDeep(queryForm)" size="small" inline />
            <div class="table-query--opts">
                <Operator type="query" size="small" showIcon @click="queryTable" />
                <Operator type="reset" size="small" showIcon @click="resetQueryForm" />
            </div>
        </div>
        <div v-if="showOperator" class="table-operate">
            <Operator
                v-if="$slots.popup"
                type="add"
                size="small"
                showIcon
                @click="optHandler('add')"
            />
            <Operator
                v-if="showSelection"
                type="bulkDelete"
                size="small"
                showIcon
                :disabled="selection.length === 0"
                @click="optHandler('bulkDelete', selection)"
            />
        </div>
        <el-table
            v-loading="$store.state.loading"
            :data="datasource"
            :border="showTableBorder"
            :cell-style="tableCellStyle"
            :header-cell-style="tableCellStyle"
            @selection-change="onSelectionChange"
        >
            <!-- 选择列 -->
            <el-table-column v-if="showSelection" type="selection" width="55" />
            <!-- 序号列 -->
            <el-table-column v-if="showIndex" type="index" width="55" />
            <!-- 数据源 -->
            <template v-for="item in columns">
                <!-- 插槽列 -->
                <el-table-column v-if="item.type === 'slot'" v-bind="item" :key="item.label">
                    <template slot-scope="{ row }">
                        <slot :name="item.slotName" :val="handleValue(row, item)" />
                    </template>
                </el-table-column>
                <!-- 标签列 -->
                <el-table-column
                    v-else-if="item.type === 'tag'"
                    v-bind="item"
                    :key="item.label"
                    :formatter="(row, column, cellVal, idx) => renderTag(item.handler, cellVal)"
                />
                <!-- 图片列 -->
                <el-table-column v-else-if="item.type === 'image'" v-bind="item" :key="item.label">
                    <template slot-scope="{ row }">
                        <el-image
                            fit="cover"
                            :src="handleValue(row, item)"
                            :alt="item.label"
                            :title="item.label"
                        />
                    </template>
                </el-table-column>
                <!-- 操作列 -->
                <el-table-column
                    v-else-if="item.type === 'opt'"
                    v-bind="item"
                    :key="item.label"
                    :min-width="80 * item.optType.length"
                >
                    <template slot-scope="{ row }">
                        <Operator
                            v-for="opt in item.optType"
                            :key="opt"
                            :type="opt"
                            @click="optHandler(opt, row)"
                        />
                    </template>
                </el-table-column>
                <!-- 普通列 -->
                <el-table-column v-else v-bind="item" :key="item.label">
                    <template slot-scope="{ row }">
                        <span v-if="isEmptyVal(handleValue(row, item))">无</span>
                        <span v-else>{{ handleValue(row, item) }}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-pagination
            v-if="showPagination"
            layout="total, prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :background="true"
            :style="{ marginTop: '24px', textAlign: pagerPos }"
            @current-change="changePage"
        />
        <Popup
            ref="popup"
            v-if="$slots.popup"
            v-bind="popupConfig"
            @beforePopupCancel="$listeners.beforePopupCancel"
            @beforePopupConfirm="$listeners.beforePopupConfirm"
        >
            <slot name="popup"></slot>
        </Popup>
    </div>
</template>

<style lang="scss" scoped>
:deep(.el-table .el-image) {
    display: block;
    height: 50px;
}

:deep(.el-table .el-image__inner) {
    width: auto;
    margin: auto;
    border-radius: 4px;
}

:deep(.el-table .el-tag:not(:last-of-type)) {
    margin: 0 6px 6px 0;
}

.table-query {
    display: flex;
    flex-wrap: wrap;
}

.table-query--opts {
    flex-shrink: 0;
}

.table-query--opts > :deep(.el-button) {
    margin: 0 10px 18px 0;
}

.table-operate {
    margin-bottom: 6px;
    white-space: nowrap;
}
</style>
