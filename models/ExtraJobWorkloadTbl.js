module.exports.columns = [
    {
        title: '工号',
        dataIndex: 'job_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '姓名',
        dataIndex: 'teacher_name',
        editable: false,
        notNull: true,
        type: 'char',
        templateIndex: 1,
        sourceTable: 'teacher_tbl',
        primaryKey: 'job_id',
        foreignKey: 'job_id',
    },
    {
        title: '职务名',
        dataIndex: 'job_name',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 2,
    },
    {
        title: '时间',
        dataIndex: 'time',
        editable: true,
        notNull: false,
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
    tableType: '职务补助',
    itemColumnName: '',
    ruleColumnName: 'job_name',
    columns: [
        {title: "职务名", dataIndex: "job_name", editable: true},
        {title: "工作量", dataIndex: "workload", editable: true},
        {title: "绩效", dataIndex: "performance_score", editable: true},
        {title: "奖金", dataIndex: "bonus", editable: true},
    ]
}
// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

