module.exports.columns = [
  {
    title: '论文名称',
    dataIndex: 'paper_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '发表期刊',
    dataIndex: 'publish_journal',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '第一作者姓名',
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
    title: '第一作者工号',
    dataIndex: 'job_id',
    editable: true,
    notNull: true,
    type: 'int',
    templateIndex: 3,

  },
  {
    title: '参与作者',
    dataIndex: 'sub_editor',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 4,
  },
  {
    title: '发表时间',
    dataIndex: 'publish_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 5,
  },
  {
    title: '卷期号',
    dataIndex: 'issue',
    editable: true,
    notNull: false,
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

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

