module.exports.columns = [
  {
    title: '姓名',
    dataIndex: 'teacher_name',
    editable: false,
    notNull: false,
    type: 'char',
    templateIndex: 0,
    sourceTable: 'teacher_tbl',
    primaryKey: 'job_id',
    foreignKey: 'job_id',
  },
  {
    title: '工号',
    dataIndex: 'job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 1,
  },
  {
    title: '级别',
    dataIndex: 'level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 2,
  },
  {
    title: '获批时间',
    dataIndex: 'win_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 3,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 4,
  },
]

module.exports.rules = {
  tableType: '名师',
  itemColumnName: '',
  ruleColumnName: 'level',
  columns: [
    {title: "级别", dataIndex: "level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ]
}