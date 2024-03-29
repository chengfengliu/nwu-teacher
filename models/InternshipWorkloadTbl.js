﻿module.exports.columns = [
    {
        title: '实习id',
        dataIndex: 'internship_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '工号',
        dataIndex: 'job_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 1,
    },
    {
        title: '姓名',
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
        title: '起始时间',
        dataIndex: 'time',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 3,
    },
    {
        title: '实习天数',
        dataIndex: 'length',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 4,
    },
    {
        title: '人数',
        dataIndex: 'student_num',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 5,
    },
    {
        title: '效益系数',
        dataIndex: 'benefit_coefficient',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 6,
    },
    {
        title: '计算依据',
        dataIndex: 'calculation_basis',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 7,
    },
    {
        title: '折合学时',
        dataIndex: 'converted_hours',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 8,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 9,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

