package model.responseModels;

import lombok.Data;
import model.subscription.Subscription;

import java.util.List;

@Data
public class CourseWithSubscriptionList {
    private CoursesWithModule coursesWithModule;
    private List<Subscription> subscription;

    public CourseWithSubscriptionList() {
    }

    public CourseWithSubscriptionList(CoursesWithModule coursesWithModule, List<Subscription> subscription) {
        this.coursesWithModule = coursesWithModule;
        this.subscription = subscription;
    }
}
