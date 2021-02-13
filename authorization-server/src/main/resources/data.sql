INSERT IGNORE INTO oauth_client_details (client_id, client_secret, web_server_redirect_uri, scope, access_token_validity, refresh_token_validity, resource_ids, authorized_grant_types, additional_information)
VALUES ('mobile', '{bcrypt}$2a$10$gPhlXZfms0EpNHX0.HHptOhoFD1AoxSr/yUIdTqA8vtjeP4zi0DDu', 'http://localhost:8080/code', 'READ,WRITE', '3600', '10000', 'inventory,payment', 'authorization_code,password,refresh_token,implicit', '{}');

 INSERT IGNORE INTO permission (name) VALUES
-- course permissions
 ('create_courses'),/* 1 */
 ('read_courses'),/* 2 */
 ('update_courses'),/* 3 */
 ('delete_courses'),/* 4 */
-- module permissions
 ('create_modules'),/* 5 */
 ('read_modules'),/* 6 */
 ('update_modules'),/* 7 */
 ('delete_modules'),/* 8 */
-- assesment permissions
  ('create_assessments'),/* 9 */
  ('read_assessments'),/* 10 */
  ('update_assessments'),/* 11 */
  ('delete_assessments'),/* 12 */

-- attendance permissions
    ('create_attendance'),/* 13 */
    ('read_attendance'),/* 14 */
    ('update_attendance'),/* 15 */
    ('delete_attendance'),/* 16 */

-- schedules permissions
     ('create_schedules'),/* 17 */
     ('read_schedules'),/* 18 */
     ('update_schedules'),/* 19 */
     ('delete_schedules'),/* 20 */

-- submission permissions
       ('create_submission'),/* 21 */
       ('read_submission'),/* 22 */
       ('update_submission'),/* 23 */
       ('delete_submission'),/* 24 */

-- subscription permissions
          ('create_subscription'),/* 25 */
          ('read_subscription'),/* 26 */
          ('update_subscription'),/* 27 */
          ('delete_subscription'),/* 28 */
-- registration permissions
        ('create_profile'),/* 29 */
        ('read_profile'),/* 30 */
        ('update_profile'),/* 31 */
        ('delete_profile');/* 32 */


 INSERT IGNORE INTO role (name) VALUES
		('ROLE_admin'),('ROLE_student'),('ROLE_tutor');

 INSERT IGNORE INTO permission_role (permission_id, role_id) VALUES
-- course permission_role
     (1,3), /*create-> tutor */
     (2,3), /* read tutor */
     (3,3), /* update tutor */
     (4,3), /* delete tutor */
     (1,1), /*create-> admin */
     (2,1), /* read admin */
     (3,1), /* update admin */
     (4,3), /* delete admin */
     (2,2), /* read student */
-- module permission_role
     (5,3), /*create-> tutor */
     (6,3), /* read tutor */
     (7,3), /* update tutor */
     (8,3), /* delete tutor */
     (5,1), /*create-> admin */
     (6,1), /* read admin */
     (7,1), /* update admin */
     (8,3), /* delete admin */
     (6,2), /* read student */
-- assessment permission_role
     (9,3), /* create tutor */
     (10,3), /* read tutor */
     (11,3), /* update tutor */
     (12,3), /* delete tutor */
     (10,1), /* read admin */
     (10,2), /* read student */
-- attendance permission_role
      (13,3), /*create-> tutor */
      (14,3), /* read tutor */
      (15,3), /* update tutor */
      (16,3), /* delete tutor */
      (14,1), /* read admin */
      (14,2), /* read student */

-- schedules permission_role
     (17,3), /*create-> tutor */
     (18,3), /* read tutor */
     (19,3), /* update tutor */
     (20,3), /* delete tutor */
     (17,1), /*create-> admin */
     (18,1), /* read admin */
     (19,1), /* update admin */
     (20,3), /* delete admin */
     (18,2), /* read student */

-- submission permission_role
     (22,3), /* read tutor */
     (22,1), /* read admin */
     (21,2), /* create student */
     (22,2), /* read student */
     (23,2), /* update student */

-- subscription permission_role
     (25,3), /*create-> tutor */
     (26,3), /* read tutor */
     (27,3), /* update tutor */
     (28,3), /* delete tutor */
     (25,1), /*create-> admin */
     (26,1), /* read admin */
     (27,1), /* update admin */
     (28,3), /* delete admin */
     (25,2), /* create student */
     (26,2), /* read student */
     (27,2), /* update student */
     (28,2), /* delete student */

-- profile permission_role
     (30,3), /* read tutor */
     (31,3), /* update tutor */
     (29,1), /*create-> admin */
     (30,1), /* read admin */
     (31,1), /* update admin */
     (30,2), /* read student */
     (31,2); /* update student */

insert IGNORE into user (id, username,password, email, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked) VALUES ('1', 'krish','{bcrypt}$2a$10$ODGwrk2ufy5d7T6afmACwOA/6j6rvXiP5amAMt1YjOQSdEw44QdqG', 'k@krishantha.com', '1', '1', '1', '1');
 insert IGNORE into  user (id, username,password, email, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked) VALUES ('2', 'suranga', '{bcrypt}$2a$10$wQ8vZl3Zm3.zDSIcZEYym.bGq3fPMJXH9k.Vhudcfr6O6KQwDPSt6','k@krishantha.com', '1', '1', '1', '1');
 insert IGNORE into  user (id, username,password, email, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked) VALUES ('3', 'nuwan', '{bcrypt}$2a$10$wQ8vZl3Zm3.zDSIcZEYym.bGq3fPMJXH9k.Vhudcfr6O6KQwDPSt6','k@krishantha.com', '1', '1', '1', '1');
/*
 passowrds:
 krish - kpass
 suranga - spass
 nuwan - spass
 */


INSERT IGNORE INTO ROLE_USER (ROLE_ID, USER_ID)
    VALUES
    (1, 1), /* krish-admin */
    (2, 2), /* suranga-student */
    (3, 3); /* nuwan-tutor */