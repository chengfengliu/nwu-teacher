module.exports.columns = [
  {
    title: '教改类型',
    dataIndex: 'project_type',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '教改名称',
    dataIndex: 'project_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '教改级别',
    dataIndex: 'project_level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 2,
  },
  {
    title: '教改类别',
    dataIndex: 'project_importance',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 3,
  },
  {
    title: '主持人姓名',
    dataIndex: 'teacher_name',
    editable: false,
    notNull: false,
    type: 'char',
    templateIndex: 4,
    sourceTable: 'teacher_tbl',
    primaryKey: 'job_id',
    foreignKey: 'job_id',
  },
  {
    title: '主持人工号',
    dataIndex: 'job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 5,
  },
  {
    title: '参加人',
    dataIndex: 'member',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 6,
  },
  {
    title: '获批时间',
    dataIndex: 'approve_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 7,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 8,
  },
]

module.exports.rules = {
  tableType: '教改',
  itemColumnName: 'project_name',
  ruleColumnName: 'project_level',
  columns: [
    {title: "教改级别", dataIndex: "project_level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ]
}
// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

