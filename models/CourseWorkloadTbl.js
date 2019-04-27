﻿module.exports.columns = [
    {
        title: '课程id',
        dataIndex: 'course_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '上课专业id',
        dataIndex: 'specialityId',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 1,
    },
    {
        title: '上课专业名称',
        dataIndex: 'specialityName',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 2,
    },
    {
        title: '工号',
        dataIndex: 'teacher_id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 3,
    },
    {
        title: '上课人数',
        dataIndex: 'student_num',
        editable: true,
        notNull: false,
        type: 'int',
        templateIndex: 4,
    },
    {
        title: '时间',
        dataIndex: 'time',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 5,
    },
    {
        title: '学分',
        dataIndex: 'credit',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 6,
    },
    {
        title: '基数',
        dataIndex: 'cardinal_num',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 7,
    },
    {
        title: '工作量',
        dataIndex: 'workload',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 8,
    },
    {
        title: '效益系数',
        dataIndex: 'benefit_coefficient',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 9,
    },
    {
        title: '计算依据',
        dataIndex: 'calculation_basis',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 10,
    },
    {
        title: '折合学时',
        dataIndex: 'converted_hours',
        editable: true,
        notNull: false,
        type: 'float',
        templateIndex: 11,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
        notNull: false,
        type: 'char',
        templateIndex: 12,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

