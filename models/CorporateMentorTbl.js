module.exports.columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 0,
    },
    {
        title: '职称',
        dataIndex: 'title',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 1,
    },
    {
        title: '学位',
        dataIndex: 'academic_degree',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 2,
    },
    {
        title: '出生年月',
        dataIndex: 'date_of_birth',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 3,
    },
    {
        title: '擅长领域',
        dataIndex: 'focus_field',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 4,
    },
    {
        title: '工作单位',
        dataIndex: 'work_unit',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 5,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

