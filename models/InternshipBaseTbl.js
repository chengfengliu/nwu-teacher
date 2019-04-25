module.exports.columns = [
    {
        title: '实习基地id',
        dataIndex: 'id',
        editable: true,
        notNull: true,
        type: 'int',
        templateIndex: 0,
    },
    {
        title: '实习基地名称',
        dataIndex: 'internship_base_name',
        editable: true,
        notNull: true,
        type: 'char',
        templateIndex: 1,
    },
]

// mock语句
// insert into textbook(textbook_type,textbook_name,textbook_publisher,director_job_id,member,publish_time,is_excellent,remark,performance_scroe,bonus,workload) values('国家级','数据结构','西北大学出版社',20130069,'cf','2019/01/01','是','无备注',1,1,1);

