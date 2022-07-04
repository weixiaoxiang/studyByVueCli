/**
 *  exceljs 封装
 *  author：yf
 *  time:20220323
 *  博客：https://www.jianshu.com/p/27e8a5cfc420
 * */
/*eslint-disable*/
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'

function isNullFn(val) {
  return val === null || val === void 0 || val === '' || val.toString() === 'NaN'
}

/**
 *  将chart与index计算，原理是使用ascii计算
 *  @chart：参与计算的字母，这里代表excel的列A ->Z
 *
 * */
function chartCalFn(chart, index) {
  return String.fromCharCode(chart.charCodeAt() + index)
}

// 获取换算后行的位置。 如 2、25等
function getRowFn(tableRef, index) {
  let startRow = parseInt(tableRef.replace(/[A-Z]/g, '')) // 表格开始的行位置
  return startRow + parseInt(index)
}

// 获取换算后列的位置, 如：B、BC等
function getColumnFn(tableRef, index) {
  // tableRef可能为 AA等
  let startCol = tableRef.replace(/[0-9]/g, '') // 表格开始的列位置

  let before = startCol.substr(0, startCol.length - 1) // 前面的字母
  let after = startCol.substr(startCol.length - 1, 1) // 最后一位字母

  return before + '' + chartCalFn(after, index)
}

/**
 *  获取换算后的单元格位置
 *  @tableRef: 表格左上角位置
 *  @coords: 需要平移的坐标，格式：[需要横向平移的个数，需要纵向平移的个数]
 *  return String 返回平移行列后的单元格位置
 * */
function getCellFn(tableRef, coords) {
  if (!coords || coords.length !== 2) {
    console.error('坐标错误')
    return tableRef
  }
  return getColumnFn(tableRef, coords[0]) + '' + getRowFn(tableRef, coords[1])
}

/**
 *  excel 导出表格
 *  @tableConfigArr: 同exceljs  sheet.addTable参数 参考 https://github.com/exceljs/exceljs/blob/master/README_zh.md#%E8%A1%A8%E6%A0%BC
 *      注意：1.columns中的_width属性是为了这里便于封装使用的，用于设置表格列宽，exceljs 官网没有此属性，别混淆
 *            2._tableBorder?: boolean 可选封装参数，true 则导出的表格有边框 false 则看表格的theme
 *            3._mergeCells?: [Array<string>] 可选封装参数，需要合并的单元格. eg: [['C3:C5']]
 *            4._cellStyle?: [{   // 单元格样式设置
 *              coords:[0,2], // 如表格ref为C3,则这里表示的是C5 [横坐标，纵坐标],可以理解为以表格左上角为原点
 *              style:{} // 同exceljs 单元格样式 参考https://github.com/exceljs/exceljs/blob/master/README_zh.md#%E6%A0%B7%E5%BC%8F
 *             }]
 *            5._sheetRefName?: string 注意：当customConfig.sheetName 设置为数组的时候，也就是有多个选项卡的时候，不写此参数则，默认加入第一张sheet
 *
 *  @customConfig: {
 *     sheetName: string || Array 表格选项卡名称
 *               当为数组sheetName时，sheetName 单项可为string代表名称，可为对象，结构如下：
 *                                    {"name": "sheet1",
 *                                    "option": { // option同exceljs 工作表 参考：https://github.com/exceljs/exceljs/blob/master/README_zh.md#%E5%B7%A5%E4%BD%9C%E8%A1%A8%E5%B1%9E%E6%80%A7
 *                                      "properties": {"tabColor": {"argb": "FFC0000"}}}
 *                                    }
 *     fileName: string 导出的excel文件名，如：test
 *  }
 * */
// 参数如下：
// 参数说明：为了更友好的参考官网，这里封装的结构基本和exceljs官网一致，但某些为了方便调用的配置的参数,都以 "_"开头，如：_width,_cellStyle,_mergeCells,_tableBorder
// tableConfigArr 结构如下：
// [
//   {
//     "name": "MyTestTable",
//     "ref": "C3",
//     "headerRow": false,
//     "totalsRow": false,
//     "style": {"theme": "TableStyleLight1"},
//     "columns": [
//       {"name": "日期", "_width": 30},
//       {"name": "姓名", "_width": 30},
//       {"name": "省份", "_width": 30},
//     ],
//     "rows": [
//       ["2016-05-02", "王小虎", "上海"],
//       ["2016-05-03", "王小虎", "上海"],
//     ],
//     "_tableBorder": true,
//     "_mergeCells": [
//       ["C3:C5"],
//       ["D3:H3"],
//     ],
//     "_cellStyle": [ // 单元格样式设置,代表表格左上角平移1列2行后的单元格，如表格ref为C3,则这里表示的是D5 [横坐标，纵坐标],可以理解为以表格左上角为原点，
//       {
//         "coords": [0, 2],
//         "style": {"alignment": {"vertical": "middle", "horizontal": "left"}}
//       },
//     ],
//     "_sheetRefName": "sheet2"
//   }
// ],
// customConfig 结构如下：
// {
//     "sheetName": [
//       {"name": "sheet1", "option": {"properties": {"tabColor": {"argb": "FFC0000"}}}},
//       "sheet2"
//     ],
//     "fileName": "合并表头的表格导出"
// }
export function $export(tableConfigArr, customConfig) {
  let { sheetName, fileName } = customConfig
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'admin'
  workbook.lastModifiedBy = 'admin'
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.lastPrinted = new Date()

  // 创建带有红色标签颜色的工作表
  // const sheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});

  // 生成 sheet start ----------
  let sheetname = null
  if (Array.isArray(sheetName)) {
    // 多个工作表
    sheetname = sheetName[0].name ? sheetName[0].name : sheetName[0]
    sheetName.map(item => {
      workbook.addWorksheet(item.name ? item.name : item, item.option || {})
    })
  } else {
    // 只有一个工作表
    if (typeof sheetName === 'string') {
      sheetname = sheetName
      workbook.addWorksheet(sheetName)
    } else {
      sheetname = sheetName.name
      workbook.addWorksheet(sheetname, sheetName.option || {})
    }
  }
  // 生成 sheet end ----------

  let sheet = null
  tableConfigArr.map(tableConfig => {
    let { ref: tableRef, _sheetRefName } = tableConfig // 因为tableRef可能为 AE:2 这种组合

    if (_sheetRefName) {
      // 指定了插入哪个sheet
      // 按 name 提取工作表
      sheet = workbook.getWorksheet(_sheetRefName)
    } else {
      sheet = workbook.getWorksheet(sheetname)
    }

    // table-列宽设置 start -------
    let { columns } = tableConfig
    columns.map((item, index) => {
      if (isNullFn(item._width)) return // 没有设置宽度使用exceljs默认宽
      let currentChart = sheet.getColumn(getColumnFn(tableRef, index))
      currentChart.width = item._width // 设置列宽度
    })
    // table-列宽设置 end -------

    // 单元格合并 start --------
    let { _mergeCells } = tableConfig
    _mergeCells &&
      _mergeCells.length &&
      _mergeCells.map(item => {
        sheet.mergeCells(item)
      })
    // 单元格合并 end --------

    // 单元格样式设置 start ------
    let { _cellStyle } = tableConfig
    _cellStyle &&
      _cellStyle.length &&
      _cellStyle.map(item => {
        let cell = sheet.getCell(getCellFn(tableRef, item.coords))
        item.style &&
          Object.keys(item.style).map(sub => {
            // 设置单元格样式
            cell[sub] = item.style[sub]
          })
      })
    // 单元格样式设置 end ------

    // 表格设置边框 start -------
    let { _tableBorder } = tableConfig
    if (_tableBorder) {
      let { columns, rows, headerRow, totalsRow } = tableConfig
      let rowMaxIndex = rows.length
      headerRow && rowMaxIndex++ // 有标题行则+1
      totalsRow && rowMaxIndex++ // 有合计行则+1
      let colMaxIndex = columns.length

      for (let rowIndex = 0; rowIndex < rowMaxIndex; rowIndex++) {
        for (let colIndex = 0; colIndex < colMaxIndex; colIndex++) {
          let cell = sheet.getCell(getCellFn(tableRef, [colIndex, rowIndex]))
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      }
    }
    // 表格设置边框 end -------

    sheet.addTable(tableConfig)
  })

  // workbook.xlsx.writeFile('test.xlsx') // node端才能使用
  workbook.xlsx.writeBuffer().then(buffer => {
    FileSaver.saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `${fileName || 'excel'}.xlsx`
    )
  })
}
