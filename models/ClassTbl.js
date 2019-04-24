module.exports.columns = [
    {
        title: '年级',
        dataIndex: 'grade',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 0,
    },
    {
        title: '学院',
        dataIndex: 'college',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 1,
    },
    {
        title: '专业',
        dataIndex: 'major',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 2,
    },
    {
        title: '班级',
        dataIndex: 'class_num',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 3,
    },
    {
        title: '人数',
        dataIndex: 'student_num',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 4,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

