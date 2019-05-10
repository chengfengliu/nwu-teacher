module.exports.columns = [
  {
    title: '获奖类型',
    dataIndex: 'award_type',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '获奖名称',
    dataIndex: 'award_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '获奖级别',
    dataIndex: 'award_level',
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
    title: '参加人',
    dataIndex: 'member',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 5,
  },
  {
    title: '获奖时间',
    dataIndex: 'win_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 6,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 7,
  },
]

module.exports.rules = {
  tableType: '教学获奖',
  itemColumnName: 'award_name',
  ruleColumnName: 'award_level',
  columns: [
    {title: "获奖级别", dataIndex: "award_level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ]
}
// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

