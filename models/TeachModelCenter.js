module.exports.columns = [
  {
    title: '中心名称',
    dataIndex: 'center_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '级别',
    dataIndex: 'center_level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '负责人姓名',
    dataIndex: 'teacher_name',
    editable: false,
    notNull: false,
    type: 'char',
    templateIndex: 2,
    sourceTable: 'teacher_tbl',
    primaryKey: 'job_id',
    foreignKey: 'job_id',
  },
  {
    title: '负责人工号',
    dataIndex: 'job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 3,
  },
  {
    title: '获批时间',
    dataIndex: 'win_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 4,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 5,
  }, 
]

module.exports.rules = {
  tableType: '教学中心',
  itemColumnName: 'center_name',
  ruleColumnName: 'center_level',
  columns: [
    {title: "级别", dataIndex: "center_level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ]
}