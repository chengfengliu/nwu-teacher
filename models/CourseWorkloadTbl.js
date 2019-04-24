﻿module.exports.columns = [
    {
        title: '课程编号',
        dataIndex: 'course_id',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '上课班级',
        dataIndex: 'class_id',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 1,
    },
    {
        title: '工号',
        dataIndex: 'job_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 2,
    },
    {
        title: '上课人数',
        dataIndex: 'student_num',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 3,
    },
    {
        title: '时间',
        dataIndex: 'time',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 4,
    },
    {
        title: '效益系数',
        dataIndex: 'benefit_coefficient',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 5,
    },
    {
        title: '计算依据',
        dataIndex: 'calculation_basis',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 6,
    },
    {
        title: '折合学时',
        dataIndex: 'converted_hours',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 7,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 8,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

