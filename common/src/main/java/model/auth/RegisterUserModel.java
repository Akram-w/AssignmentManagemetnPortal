package model.auth;

import lombok.Data;

@Data
public class RegisterUserModel {
    private User user;
    private String type;

    public RegisterUserModel() {
    }

    public RegisterUserModel(User user, String type) {
        this.user = user;
        this.type = type;
    }
}
