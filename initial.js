const mysql = require('mysql')
const md5 = require('md5')

const mysqlConfig = require('./mysqlConfig')
// 连接MySQL数据库
const connection = mysql.createConnection(mysqlConfig)
connection.connect(err => {
    if (err) throw err
    console.log('connected')
    // 创建老师表
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teacher_tbl";`, (err, result) => {
        if (err) {
            throw err
        }
        console.log('creating teacher_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teacher_tbl (
        job_id bigint NOT NULL PRIMARY KEY,
        teacher_name varchar(5) NOT NULL,
        title varchar(10) DEFAULT NULL,
        date_of_birth varchar(20) DEFAULT NULL,
        category varchar(20) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
            console.log('created teacher_tbl table')
        }
    })

    // 创建用户表
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="users";`, (err, result) => {
        if (err) throw err
        console.log('creating users', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE users (
        job_id bigint NOT NULL PRIMARY KEY,
        password varchar(40) NOT NULL, 
        level enum('visitor', 'assistant', 'admin') not null
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
            console.log('created users table')
        } else {
            connection.query(`select * from users`, (err2, result2) => {
                if (result2.length === 0) {
                    // 插入管理员信息 账号20190001 密码admin001
                    connection.query(`INSERT INTO users VALUES(20190001, '${md5('admin001')}', 'admin')`)
                    // 初始化用户表 初始密码是123456
                    connection.query(`SELECT job_id from teacher_tbl`, (err, result) => {
                        if (err) throw err
                        // console.log(result,result[0].job_id)
                        result.forEach(item => {
                            connection.query(`INSERT INTO users VALUES(${item.job_id}, '${md5('123456')}', 'visitor')`)
                        })
                    })
                    console.log('init users done and you need to import teacher_tbl')
                }
            })
        }
    })

    // 创建mooc表
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="mooc";`, (err, result) => {
        if (err) throw err
        console.log('creating mooc', result)
        if (result.length === 0) { // mooc表未存在
            connection.query(`CREATE TABLE mooc(
        id int auto_increment primary key, 
        course_name text not null, 
        course_level text not null, 
        director_job_id bigint not null, 
        member text,
        is_online enum('是','否') not null, 
        time varchar(20) not null,
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
            console.log('created mooc table')
        }
    })
    // 大创表
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="instruct_student_innovate";`, (err, result) => {
        if (err) throw err
        console.log('creating instruct_student_innovate', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE instruct_student_innovate(
        id int auto_increment primary key,
        project_name text not null,
        project_type text not null,
        approve_time varchar(20) not null,
        project_major text,
        participation_number int(5),
        project_status enum('在研','结题'),
        mid_check_result text,
        end_check_result text,
        appropriation_approve float,
        project_level text,
        director_id bigint,
        director_name varchar(5),
        director_major text,
        director_grade text,
        member1_id bigint,
        member1_name varchar(5),
        member1_major text,
        member1_grade text,
        member2_id bigint,
        member2_name varchar(5),
        member2_major text,
        member2_grade text,
        mentor_job_id bigint not null,
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created instruct_student_innovate table')
        }
    })
    // 教材表
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="textbook";`, (err, result) => {
        if (err) throw err
        console.log('creating textbook', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE textbook(
        id int auto_increment primary key,
        textbook_type text not null,
        textbook_name text not null,
        textbook_publisher text not null,
        director_job_id bigint not null,
        member text,
        publish_time varchar(20) not null,
        is_excellent enum('是','否') not null,
        remark text,
        performance_scroe float,
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created textbook table')
        }
    })
    // 教改项目
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teach_reformation";`, (err, result) => {
        if (err) throw err
        console.log('creating teach_reformation', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teach_reformation(
        id int auto_increment primary key,
        project_type text not null,
        project_name text not null,
        project_level text not null,
        project_importance text not null,
        director_job_id bigint not null,
        member text,
        approve_time varchar(20) not null,
        remark text,
        performance_scroe float,
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created teach_reformation table')
        }
    })
    // 教学获奖
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teach_award";`, (err, result) => {
        if (err) throw err
        console.log('creating teach_award', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teach_award(
        id int auto_increment primary key,
        award_type text not null,
        award_name text not null,
        award_level text not null,
        award_sublevel text not null,
        director_job_id bigint not null,
        member text,
        win_time varchar(20) not null,
        remark text,
        performance_scroe float,
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created teach_award table')
        }
    })
    // 教学论文
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teach_paper";`, (err, result) => {
        if (err) throw err
        console.log('creating teach_paper', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teach_paper(
        id int auto_increment primary key, 
        paper_name text not null, 
        publish_journal text not null, 
        chief_editor_id bigint not null, 
        sub_editor text, 
        publish_time varchar(20) not null, 
        issue text, 
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created teach_paper table')
        }
    })
    // 教学名师
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="top_teacher";`, (err, result) => {
        if (err) throw err
        console.log('creating top_teacher', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE top_teacher(
        id int auto_increment primary key, 
        teacher_job_id bigint not null, 
        level text not null, 
        win_time varchar(20) not null, 
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created top_teacher table')
        }
    })
    // 教学示范中心
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teach_model_center";`, (err, result) => {
        if (err) throw err
        console.log('creating teach_model_center', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teach_model_center(
        id int auto_increment primary key, 
        center_name text not null, 
        center_level text not null, 
        director_job_id bigint not null, 
        win_time varchar(20) not null, 
        remark text
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created teach_model_center table')
        }
    })
    // 教学团队
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="teach_team";`, (err, result) => {
        if (err) throw err
        console.log('creating teach_team', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE teach_team(
        id int auto_increment primary key, 
        team_type text not null, 
        team_name text not null, 
        team_level text not null, 
        director_job_id bigint not null, 
        member text,
        win_time varchar(20) not null, 
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created teach_team table')
        }
    })
    // 精品课程
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="excellent_course";`, (err, result) => {
        if (err) throw err
        console.log('creating excellent_course', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE excellent_course(
        id int auto_increment primary key, 
        course_type text not null, 
        course_name text not null, 
        course_level text not null, 
        director_job_id bigint not null, 
        win_time varchar(20) not null, 
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created excellent_course table')
        }
    })
    // 竞赛
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="match_total";`, (err, result) => {
        if (err) throw err
        console.log('creating match_total', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE match_total(
        id int auto_increment primary key,
        match_name text not null,
        match_level text not null,
        director_job_id bigint not null,
        remark text
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created match_total table')
        }
    })
    // 竞赛获奖
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="instruct_student_match";`, (err, result) => {
        if (err) throw err
        console.log('creating instruct_student_match', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE instruct_student_match(
        id int auto_increment primary key,
        match_name text not null,
        win_time varchar(20) not null,
        participation_number int(5),
        match_level text not null,
        participation_student text,
        director_id bigint,
        director_name varchar(5),
        director_major text,
        director_grade text,
        member1_id bigint,
        member1_name varchar(5),
        member1_major text,
        member1_grade text,
        member2_id bigint,
        member2_name varchar(5),
        member2_major text,
        member2_grade text,
        other_member text,
        mentor_job_id bigint,
        remark text,
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created instruct_student_match table')
        }
    })
    // 专业
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="major";`, (err, result) => {
        if (err) throw err
        console.log('creating major', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE major(
        id int auto_increment primary key, 
        major_type text not null,
        major_name text not null, 
        major_level text not null, 
        director_job_id bigint not null, 
        time varchar(20) not null,
        remark text, 
        performance_scroe float, 
        bonus float,
        workload float
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created major table')
        }
    })
    //班级
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="class_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating class_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE class_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        grade varchar(20) NOT NULL,
        college varchar(20) NOT NULL,
        major varchar(20) NOT NULL,
        class_num int(11) DEFAULT NULL,
        student_num int(11) DEFAULT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created class_tbl table')
        }
    })
    //企业导师
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="corporate_mentor_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating corporate_mentor_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE corporate_mentor_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(5) NOT NULL,
        title varchar(10) DEFAULT NULL,
        academic_degree varchar(10) DEFAULT NULL,
        date_of_birth datetime DEFAULT NULL,
        focus_field varchar(20) DEFAULT NULL,
        work_unit varchar(20) DEFAULT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created corporate_mentor_tbl table')
        }
    })
    //课程
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="course_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating course_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE course_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        course_name varchar(20) NOT NULL,
        course_type varchar(20) NOT NULL,
        course_nature varchar(20) NOT NULL,
        speciality int(11) DEFAULT NULL,
        plan_hours float DEFAULT NULL,
        credit float DEFAULT NULL,
        cardinal_num float DEFAULT NULL,
        workload float DEFAULT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created course_tbl table')
        }
    })
    //课程工作量
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="course_workload_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating course_workload_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE course_workload_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        course_id int(11) DEFAULT NULL,
        class_id int(11) DEFAULT NULL,
        job_id bigint(20) NOT NULL,
        student_num int(11) DEFAULT NULL,
        time datetime DEFAULT NULL,
        benefit_coefficient float DEFAULT NULL,
        calculation_basis text CHARACTER SET utf8 COLLATE utf8_general_ci,
        converted_hours float DEFAULT NULL,
        remark text,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created course_workload_tbl table')
        }
    })
    //职务工作量
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="extra_job_workload_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating extra_job_workload_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE extra_job_workload_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        job_id bigint(255) NOT NULL,
        job_name varchar(20) NOT NULL,
        time text,
        converted_hours float DEFAULT NULL,
        remark text,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created extra_job_workload_tbl table')
        }
    })
    //毕业设计
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="gradproject_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating gradproject_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE gradproject_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        gradproject_name varchar(20) NOT NULL,
        gradproject_type varchar(20) NOT NULL,
        gradproject_time text,
        credit float DEFAULT NULL,
        cardinal_num float DEFAULT NULL,
        student_id int(11) DEFAULT NULL,
        student_name varchar(20) DEFAULT NULL,
        student_major varchar(20) DEFAULT NULL,
        student_grade varchar(20) DEFAULT NULL,
        job_id bigint(20) DEFAULT NULL,
        corporate_mentor_id int(11) DEFAULT NULL,
        remark text,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created gradproject_tbl table')
        }
    })
    //实习基地
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="internship_base_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating internship_base_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE internship_base_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        internship_base_name varchar(20) DEFAULT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created internship_base_tbl table')
        }
    })
    //实习
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="internship_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating internship_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE internship_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        internship_name varchar(20) NOT NULL,
        internship_type varchar(20) NOT NULL,
        internship_nature varchar(20) NOT NULL,
        internship_position varchar(20) NOT NULL,
        internship_base int(11) DEFAULT NULL,
        internship_target text,
        plan_hours float DEFAULT NULL,
        credit float DEFAULT NULL,
        cardinal_num float DEFAULT NULL,
        workload float DEFAULT NULL,
        job_id bigint(20) DEFAULT NULL,
        remark text,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created internship_tbl table')
        }
    })
    //实习工作量
    connection.query(`select t.table_name from information_schema.TABLES t where t.TABLE_SCHEMA = "${mysqlConfig.database}" and t.TABLE_NAME ="internship_workload_tbl";`, (err, result) => {
        if (err) throw err
        console.log('creating internship_workload_tbl', result)
        if (result.length === 0) {
            connection.query(`CREATE TABLE internship_workload_tbl (
        id int(11) NOT NULL AUTO_INCREMENT,
        internship_name varchar(20) NOT NULL,
        job_id bigint(20) DEFAULT NULL,
        teacher_name varchar(20) DEFAULT NULL,
        class_id int(11) DEFAULT NULL,
        time text,
        length int(11) DEFAULT NULL,
        student_num int(11) DEFAULT NULL,
        benefit_coefficient float DEFAULT NULL,
        calculation_basis text,
        converted_hours float DEFAULT NULL,
        remark text,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
            console.log('created internship_workload_tbl table')
        }
    })
})