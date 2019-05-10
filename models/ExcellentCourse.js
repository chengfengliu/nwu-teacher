module.exports.columns = [
  {
    title: '课程类型',
    dataIndex: 'course_type',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '课程名称',
    dataIndex: 'course_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '课程等级',
    dataIndex: 'course_level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 2,
  },
  {
    title: '主持人姓名',
    dataIndex: 'teacher_name',
    editable: false,
    notNull: false,
    type: 'char',
    templateIndex: 3,
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
    templateIndex: 4,
  },
  {
    title: '获批时间',
    dataIndex: 'win_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 5,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 6,
  },
]

module.exports.rules = {
  tableType: '精品课程',
  itemColumnName: 'course_name',
  ruleColumnName: 'course_level',
  columns: [
    {title: "课程等级", dataIndex: "course_level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ]
}
// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

