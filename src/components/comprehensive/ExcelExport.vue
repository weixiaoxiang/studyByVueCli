<!--
 *                   江城子 . 程序员之歌
 * 
 *               十年生死两茫茫，写程序，到天亮。
 *                   千行代码，Bug何处藏。
 *               纵使上线又怎样，朝令改，夕断肠。
 * 
 *               领导每天新想法，天天改，日日忙。
 *                   相顾无言，惟有泪千行。
 *               每晚灯火阑珊处，夜难寐，加班狂。
 * 
 * 
 * @Descripttion: 描述-
 * @version: v1.0
 * @Author: yichonglou
 * @Date: 2022-04-08 09:09:32
 * @FilePath: \study\src\components\comprehensive\ExcelExport.vue
 * @LastEditors: yichonglou
 * @LastEditTime: 2022-04-08 09:18:14
 -->

<!-- 纯前端导出excel案例 -->
<template>
  <!-- eslint-disable -->
  <div class="wrap">
    <h1>普通表格</h1>
    <p>
      <el-button type="primary" @click="exportXlsx('导出excel-设置指定单元格样式')"
        >导出excel-设置指定单元格样式</el-button
      >
    </p>
    <p>
      <el-button type="primary" @click="exportXlsx2('导出excel-表格设置边框')"
        >导出excel-表格设置边框</el-button
      >
    </p>
    <p>
      <el-button type="primary" @click="exportXlsx3('导出excel-表格设置边框且不显示表头')"
        >导出excel-表格设置边框且不显示表头</el-button
      >
    </p>
    <div style="width: 500px; margin: 20px auto">
      <el-table border :data="tableData" style="width: 100%">
        <template v-for="(item, index) in tableHeader">
          <el-table-column :key="index" v-bind="item"> </el-table-column>
        </template>
      </el-table>
    </div>

    <h1>复杂表格</h1>
    <p>
      <el-button type="primary" @click="exportXlsx4('导出excel-表头合并')"
        >导出excel-表头合并</el-button
      >
    </p>
    <p>
      <el-button type="primary" @click="exportXlsx5('导出excel-同时导出两个表')"
        >导出excel-同时导出两个表</el-button
      >
    </p>
    <p>
      <el-button type="primary" @click="exportXlsx6('导出excel-同时导出两个sheet')"
        >导出excel-同时导出两个sheet</el-button
      >
    </p>

    <div style="width: 1000px; margin: 20px auto">
      <el-table :data="tableData2" style="width: 100%">
        <el-table-column prop="date" label="日期" width="150"> </el-table-column>
        <el-table-column label="配送信息">
          <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
          <el-table-column label="地址">
            <el-table-column prop="province" label="省份" width="120"> </el-table-column>
            <el-table-column prop="city" label="市区" width="120"> </el-table-column>
            <el-table-column prop="address" label="地址" width="300"> </el-table-column>
            <el-table-column prop="zip" label="邮编" min-width="120"> </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
/* eslint-disable*/
import * as exportExcel from '@utils/exportExcel.js'
export default {
  name: 'exceljs-demo',
  data() {
    return {
      tableHeader: [
        {
          prop: 'date',
          label: '日期'
        },
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'address',
          label: '地址'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],

      tableData2: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ]
    }
  },
  methods: {
    // 是否为空
    $isNull(val) {
      return val === null || val === void 0 || val === '' || val.toString() === 'NaN'
    },
    exportXlsx(filename) {
      // 生成columns
      let columns = []
      this.tableHeader.map(item => {
        columns.push({
          name: item.label,
          _width: 30 // 注意：这里是封装后才能这样写，exceljs table columns 没有width
        })
      })

      // 生成rows
      let rows = []
      this.tableData.map(item => {
        let arr = []
        this.tableHeader.map(sub => {
          arr.push(!this.$isNull(item[sub.prop]) ? item[sub.prop] : '')
        })
        rows.push(arr)
      })

      // 表头样式设置 - 生成_cellStyle
      let _cellStyle = []
      this.tableHeader.map((item, index) => {
        _cellStyle.push({
          coords: [index, 0], // 代表表格第一行第一列 [横坐标，纵坐标]
          style: {
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            },
            alignment: { vertical: 'middle', horizontal: 'center' }
          }
        })
      })

      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            // exceljs无此参数：参数-针对表格中某个单元格设置样式
            _cellStyle: [
              ..._cellStyle,
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                  },
                  alignment: { vertical: 'middle', horizontal: 'center' },
                  fill: {
                    type: 'pattern',
                    pattern: 'darkVertical',
                    fgColor: { argb: 'FFFF0000' }
                  }
                }
              }
            ]
          }
        ],
        {
          sheetName: 'My Sheet',
          fileName: filename
        }
      )
    },

    exportXlsx2(filename) {
      // 生成columns
      let columns = []
      this.tableHeader.map(item => {
        columns.push({
          name: item.label,
          _width: 30 // 注意：这里是封装后才能这样写，exceljs table columns 没有width
        })
      })

      // 生成rows
      let rows = []
      this.tableData.map(item => {
        let arr = []
        this.tableHeader.map(sub => {
          arr.push(!this.$isNull(item[sub.prop]) ? item[sub.prop] : '')
        })
        rows.push(arr)
      })

      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true // 表格设置边框
          }
        ],
        {
          sheetName: 'My Sheet',
          fileName: filename
        }
      )
    },

    exportXlsx3(filename) {
      // 生成columns
      let columns = []
      this.tableHeader.map(item => {
        columns.push({
          name: item.label,
          _width: 30 // 注意：这里是封装后才能这样写，exceljs table columns 没有width
        })
      })

      // 生成rows
      let rows = []
      this.tableData.map(item => {
        let arr = []
        this.tableHeader.map(sub => {
          arr.push(!this.$isNull(item[sub.prop]) ? item[sub.prop] : '')
        })
        rows.push(arr)
      })

      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: false,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true // 表格设置边框
          }
        ],
        {
          sheetName: 'My Sheet',
          fileName: filename
        }
      )
    },

    // 底部表格
    getTableExportData2() {
      // 表头数据，这里拆成三行，方便演示这里没有放级联数组里，直接写死的
      let header1 = ['', '', '', '', '', '配送信息'] // 注意：因为要合并，文本要放最后一个待合并单元格，不然合并后显示后为空
      let header2 = ['', '', '', '', '', '地址']
      let header3 = [
        {
          prop: 'date',
          label: '日期'
        },
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'province',
          label: '省份'
        },
        {
          prop: 'city',
          label: '市区'
        },
        {
          prop: 'address',
          label: '地址'
        },
        {
          prop: 'zip',
          label: '邮编'
        }
      ]

      // 生成columns - 因为列必须有列名，这里使用的header3,其他的也行，反正后面不会显示，后面会隐藏表头
      let columns = []
      header3.map(item => {
        columns.push({
          name: item.label,
          _width: 30 // 注意：这里是封装后才能这样写，exceljs table columns 没有width
        })
      })

      // 生成rows
      let rows = []
      rows.push(header1) // 前面是表头1
      rows.push(header2) // 前面是表头2
      rows.push(header3.map(item => item.label)) // 前面是表头3
      this.tableData2.map(item => {
        // 这里才是表格的数据
        let arr = []
        header3.map(sub => {
          arr.push(!this.$isNull(item[sub.prop]) ? item[sub.prop] : '')
        })
        rows.push(arr)
      })

      return {
        columns,
        rows
      }
    },

    exportXlsx4(filename) {
      let { rows, columns } = this.getTableExportData2()
      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: false, // 【注意：这里headerRow是false】
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true, // 表格设置边框
            _mergeCells: [
              // 这里是需要合并的表头 - 可以等表格导出后再一个一个看哪些需要合并，这种配置是目前想到的最简单的方式了
              ['C3:C5'],
              ['D3:H3'],
              ['D4:D5'],
              ['E4:H4']
            ],
            // 表头部分单元格居中
            _cellStyle: [
              {
                coords: [0, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              },
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              }
            ]
          }
        ],
        {
          sheetName: 'My Sheet',
          fileName: filename
        }
      )
    },

    exportXlsx5(filename) {
      let { rows, columns } = this.getTableExportData2()
      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: false, // 【注意：这里headerRow是false】
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true, // 表格设置边框
            _mergeCells: [
              // 这里是需要合并的表头 - 可以等表格导出后再一个一个看哪些需要合并，这种配置是目前想到的最简单的方式了
              ['C3:C5'],
              ['D3:H3'],
              ['D4:D5'],
              ['E4:H4']
            ],
            // 表头部分单元格居中
            _cellStyle: [
              {
                coords: [0, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              },
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              }
            ]
          },
          {
            name: 'MyTestTable',
            ref: 'C18',
            headerRow: false, // 【注意：这里headerRow是false】
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true, // 表格设置边框
            _mergeCells: [
              // 这里是需要合并的表头 - 可以等表格导出后再一个一个看哪些需要合并，这种配置是目前想到的最简单的方式了
              ['C18:C20'],
              ['D18:H18'],
              ['D19:D20'],
              ['E19:H19']
            ],
            // 表头部分单元格居中
            _cellStyle: [
              {
                coords: [0, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              },
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              }
            ]
          }
        ],
        {
          sheetName: 'My Sheet',
          fileName: filename
        }
      )
    },

    exportXlsx6(filename) {
      let { rows, columns } = this.getTableExportData2()
      exportExcel.$export(
        [
          {
            name: 'MyTestTable',
            ref: 'C3',
            headerRow: false, // 【注意：这里headerRow是false】
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true, // 表格设置边框
            _mergeCells: [
              // 这里是需要合并的表头 - 可以等表格导出后再一个一个看哪些需要合并，这种配置是目前想到的最简单的方式了
              ['C3:C5'],
              ['D3:H3'],
              ['D4:D5'],
              ['E4:H4']
            ],
            // 表头部分单元格居中
            _cellStyle: [
              {
                coords: [0, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              },
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              }
            ],

            _sheetRefName: 'sheet2' // 需要插入的工作表名称 - 多个工作表的时候不填此参数默认将当前表格放入第一个sheet
          },
          {
            name: 'MyTestTable',
            ref: 'C18',
            headerRow: false, // 【注意：这里headerRow是false】
            totalsRow: false,
            style: {
              theme: 'TableStyleLight1'
              //            showRowStripes: true,
            },
            columns: columns,
            rows: rows,

            _tableBorder: true, // 表格设置边框
            _mergeCells: [
              // 这里是需要合并的表头 - 可以等表格导出后再一个一个看哪些需要合并，这种配置是目前想到的最简单的方式了
              ['C18:C20'],
              ['D18:H18'],
              ['D19:D20'],
              ['E19:H19']
            ],
            // 表头部分单元格居中
            _cellStyle: [
              {
                coords: [0, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              },
              {
                coords: [1, 2], // 代表表格第一行第一列 [横坐标，纵坐标]
                style: {
                  alignment: { vertical: 'middle', horizontal: 'left' }
                }
              }
            ]
            //            _sheetRefName:'sheet1' // 需要插入的工作表名称 - 多个工作表的时候不填此参数默认将当前表格放入第一个sheet
          }
        ],
        {
          sheetName: [
            {
              name: 'sheet1',
              option: {
                // 同 exceljs
                properties: { tabColor: { argb: 'FFC0000' } }
              }
            },
            'sheet2'
          ],
          fileName: filename
        }
      )
    }
  }
}
</script>
<style scoped>
.wrap p {
  margin-top: 10px;
}
</style>
