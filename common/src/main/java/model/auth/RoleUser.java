package model.auth;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "role_user")
@Data
public class RoleUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name = "role_id")
    private int roleId;
    @Column(name = "user_id")
    private int userId;

    public RoleUser() {
    }

    public RoleUser(int roleId, int userId) {
        this.roleId=roleId;
        this.userId=userId;
    }
}
