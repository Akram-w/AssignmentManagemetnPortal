package model.responseModels;

import lombok.Data;
import model.subscription.Subscription;

@Data
public class SubscriptionsWithCourses {
    private CoursesWithModule coursesWithModule;
    private Subscription subscription;

    public SubscriptionsWithCourses() {
    }

    public SubscriptionsWithCourses(CoursesWithModule coursesWithModule, Subscription subscription) {
        this.coursesWithModule = coursesWithModule;
        this.subscription = subscription;
    }
}
