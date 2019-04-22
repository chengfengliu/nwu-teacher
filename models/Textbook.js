module.exports.columns = [
  {
    title: '教材类型',
    dataIndex: 'textbook_type',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '教材名称',
    dataIndex: 'textbook_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '出版社',
    dataIndex: 'textbook_publisher',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 2,
  },
  {
    title: '主编姓名',
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
    title: '主编工号',
    dataIndex: 'director_job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 4,
  },
  {
    title: '成员',
    dataIndex: 'member',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 5,
  },
  {
    title: '获得优秀教材（是/否）',
    dataIndex: 'is_excellent',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 7,
  },
  {
    title: '出版时间',
    dataIndex: 'publish_time',
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
    templateIndex: 8,
  },
  {
    title: '绩效计分',
    dataIndex: 'performance_scroe',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 9,
  },
  {
    title: '奖金',
    dataIndex: 'bonus',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 10,
  },
  {
    title: '工作量',
    dataIndex: 'workload',
    editable: true,
    notNull: false,
    type: 'float',
    templateIndex: 11,
  }, 
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);
