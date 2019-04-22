module.exports.columns = [
  {
    title: '类别',
    dataIndex: 'major_type',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '专业',
    dataIndex: 'major_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '级别',
    dataIndex: 'major_level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 2,
  },
  {
    title: '负责人姓名',
    dataIndex: 'teacher_name',
    editable: false,
    notNull: false,
    type: 'char',
    templateIndex: 3,
    sourceTable: 'teacher_tbl',
    primaryKey: 'director_job_id',
    foreignKey: 'job_id',
  },
  {
    title: '负责人工号',
    dataIndex: 'director_job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 4,
  },
  {
    title: '时间',
    dataIndex: 'time',
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
  {
    title: '绩效计分',
    dataIndex: 'performance_scroe',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 7,
  },
  {
    title: '奖金',
    dataIndex: 'bonus',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 8,
  },
  {
    title: '工作量',
    dataIndex: 'workload',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 9,
  }, 
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

