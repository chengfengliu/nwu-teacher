module.exports.columns = [
  {
    title: '名称',
    dataIndex: 'match_name',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 0,
  },
  {
    title: '获奖时间',
    dataIndex: 'win_time',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 1,
  },
  {
    title: '参与学生人数',
    dataIndex: 'participation_number',
    editable: true,
    notNull: false,
    type: 'int',
    templateIndex: 2,
  },
  {
    title: '竞赛级别',
    dataIndex: 'match_level',
    editable: true,
    notNull: true,
    type: 'char',
    templateIndex: 3,
  },
  {
    title: '参与学生',
    dataIndex: 'participation_student',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 4,
  },
  {
    title: '负责人学号',
    dataIndex: 'director_id',
    editable: true,
    notNull: false,
    type: 'int',
    templateIndex: 5,
  }, 
  {
    title: '负责人姓名',
    dataIndex: 'director_name',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 6,
  },
  {
    title: '负责人专业',
    dataIndex: 'director_major',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 7,
  },
  {
    title: '负责人年级',
    dataIndex: 'director_grade',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 8,
  }, 
  {
    title: '成员1学号',
    dataIndex: 'member1_id',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 9,
  },
  {
    title: '成员1姓名',
    dataIndex: 'member1_name',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 10,
  },
  {
    title: '成员1专业',
    dataIndex: 'member1_major',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 11,
  }, 
  {
    title: '成员1年级',
    dataIndex: 'member1_grade',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 12,
  },
  {
    title: '成员2学号',
    dataIndex: 'member2_id',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 13,
  },
  {
    title: '成员2姓名',
    dataIndex: 'member2_name',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 14,
  }, 
  {
    title: '成员2专业',
    dataIndex: 'member2_major',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 15,
  },
  {
    title: '成员2年级',
    dataIndex: 'member2_grade',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 16,
  }, 
  {
    title: '其他成员',
    dataIndex: 'other_member',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 17,
  }, 
  // {
  //   title: '指导教师姓名',
  //   dataIndex: 'teacher_name',
  //   editable: true,
  //   notNull: false,
  //   type: 'char',
  //   templateIndex: 18,
  //   sourceTable: 'teacher_tbl',
  //   primaryKey: 'job_id',
  //   foreignKey: 'job_id',
  // },
  {
    title: '指导教师工号',
    dataIndex: 'job_id',
    editable: true,
    notNull: false,
    type: 'int',
    templateIndex: 19,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    notNull: false,
    type: 'char',
    templateIndex: 20,
  },
]

module.exports.rules = {
  tableType: '竞赛',
  itemColumnName: 'match_name',
  ruleColumnName: 'match_level',
  columns: [
    {title: "竞赛级别", dataIndex: "match_level", editable: true},
    {title: "工作量", dataIndex: "workload", editable: true},
    {title: "绩效", dataIndex: "performance_score", editable: true},
    {title: "奖金", dataIndex: "bonus", editable: true},
  ],
  Chinese2English: {
    '备注': 'remark',
  }
}