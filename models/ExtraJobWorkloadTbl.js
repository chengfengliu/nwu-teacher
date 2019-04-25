module.exports.columns = [
    {
        title: '工号',
        dataIndex: 'teacher_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '职务名',
        dataIndex: 'job_name',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 1,
    },
    {
        title: '时间',
        dataIndex: 'time',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 2,
    },
    {
        title: '折合学时',
        dataIndex: 'converted_hours',
        editable: true,
        notNull: false,
        type: 'float',
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

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

