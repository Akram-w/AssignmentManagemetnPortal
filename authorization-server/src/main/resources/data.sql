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
 ('delete_modules');/* 8 */
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
     (6,2); /* read student */

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